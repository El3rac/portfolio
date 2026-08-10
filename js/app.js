(function () {
  const fmtViews = new Intl.NumberFormat("fr-FR");
  const SHOW_MORE_THRESHOLD = 9;
  const ROLE_CLASS = {
    "script": "role-script",
    "montage": "role-montage",
    "réalisation": "role-realisation",
    "voix": "role-voix",
  };

  const NEW_BADGE_DAYS = 30;

  let activeCategory = "all";
  let activeRole = "all";

  function renderProfile() {
    document.title = `${PROFILE.name} — Portfolio`;
    document.getElementById("logo-text").textContent = PROFILE.name;
    document.getElementById("hero-eyebrow").textContent = PROFILE.eyebrow || "";
    document.getElementById("hero-name").textContent = PROFILE.name;
    document.getElementById("hero-bio").textContent = PROFILE.bio || "";

    const availEl = document.getElementById("availability-badge");
    const isAvailable = PROFILE.availability !== "complet";
    availEl.textContent = isAvailable ? "Disponible pour de nouveaux projets" : "Complet en ce moment";
    availEl.classList.toggle("is-available", isAvailable);
    availEl.classList.toggle("is-full", !isAvailable);

    const avatarEl = document.getElementById("avatar");
    if (PROFILE.avatar) {
      avatarEl.src = PROFILE.avatar;
      avatarEl.alt = PROFILE.name;
      avatarEl.hidden = false;
    }

    for (const containerId of ["socials", "socials-footer"]) {
      const el = document.getElementById(containerId);
      el.innerHTML = "";
      (PROFILE.socials || []).forEach((s) => {
        const a = document.createElement("a");
        a.href = s.url;
        a.textContent = s.label;
        if (/^https?:/.test(s.url)) {
          a.target = "_blank";
          a.rel = "noopener";
        }
        el.appendChild(a);
      });
    }
  }

  function sunIcon() {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>`;
  }

  function moonIcon() {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.6 15.6A9 9 0 1 1 8.4 3.4a7 7 0 0 0 12.2 12.2Z"/></svg>`;
  }

  // Clic = passe au thème inverse. L'icône affichée est celle du thème vers lequel on bascule.
  function setupThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    const apply = (theme) => {
      document.documentElement.dataset.theme = theme;
      btn.innerHTML = theme === "light" ? moonIcon() : sunIcon();
    };
    apply(localStorage.getItem("theme") === "light" ? "light" : "dark");

    btn.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      apply(next);
    });
  }

  function youtubeIcon() {
    return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z"/></svg>`;
  }

  // "PT1H2M3S" (format YouTube) -> "1:02:03"
  function formatDuration(iso) {
    const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || "");
    if (!m) return "";
    const h = parseInt(m[1] || "0", 10);
    const min = parseInt(m[2] || "0", 10);
    const s = parseInt(m[3] || "0", 10);
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
  }

  // Date ISO -> "il y a 3 mois"
  function formatRelativeTime(iso) {
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    const units = [
      ["an", 31536000], ["mois", 2592000], ["semaine", 604800],
      ["jour", 86400], ["heure", 3600], ["minute", 60],
    ];
    for (const [label, secs] of units) {
      const val = Math.floor(diffSec / secs);
      if (val >= 1) return `il y a ${val} ${label}${val > 1 && label !== "mois" ? "s" : ""}`;
    }
    return "à l'instant";
  }

  function roleBadges(roles) {
    if (!roles || !roles.length) return "";
    const badges = roles
      .map((r) => `<span class="role-badge ${ROLE_CLASS[r.toLowerCase()] || ""}">${r}</span>`)
      .join("");
    return `<div class="role-badges">${badges}</div>`;
  }

  // Anime un nombre affiché de sa valeur actuelle vers "to" (effet "compteur en direct").
  // La valeur finale est affichée immédiatement en secours : si le navigateur retarde
  // l'animation (onglet en arrière-plan...), le chiffre reste toujours correct et visible.
  function animateNumber(el, to) {
    const toNum = Number(to);
    const from = parseInt(el.dataset.rawValue || "0", 10);
    el.dataset.rawValue = toNum;
    el.textContent = fmtViews.format(toNum);
    if (from === toNum) return;

    const duration = 600;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = fmtViews.format(Math.round(from + (toNum - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Vidéos/chaînes sont calculés depuis CATEGORIES : toujours à jour automatiquement
  // dès qu'on ajoute/retire une vidéo ou une catégorie dans data.js.
  function renderStats() {
    const videoCount = CATEGORIES.reduce((sum, cat) => sum + cat.videos.length, 0);
    document.getElementById("stat-videos").textContent = videoCount;
    document.getElementById("stat-channels").textContent = CATEGORIES.length;

    if (PROFILE.youtubeApiKey) {
      document.getElementById("stat-tile-views").hidden = false;
    }
  }

  function updateTotalViewsStat() {
    if (!PROFILE.youtubeApiKey) return;
    let total = 0;
    document.querySelectorAll(".video-card").forEach((card) => {
      total += parseInt(card.dataset.views || "0", 10);
    });
    animateNumber(document.getElementById("stat-views"), total);
  }

  function slugify(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // Extrait le "@handle" d'une URL de chaîne YouTube (ex: youtube.com/@el3rac -> "el3rac").
  // Ne fonctionne que pour les URL au format @handle (pas /channel/UC... ni /c/NomPerso).
  function extractHandle(url) {
    if (!url) return null;
    const m = url.match(/youtube\.com\/@([^/?#]+)/i);
    return m ? m[1] : null;
  }

  function renderFilters() {
    const filtersEl = document.getElementById("filters");
    filtersEl.innerHTML = "";

    const allPill = document.createElement("button");
    allPill.className = "filter-pill active";
    allPill.textContent = "Tout";
    allPill.dataset.target = "all";
    filtersEl.appendChild(allPill);

    CATEGORIES.forEach((cat) => {
      const pill = document.createElement("button");
      pill.className = "filter-pill";
      pill.textContent = cat.name;
      pill.dataset.target = slugify(cat.name);
      filtersEl.appendChild(pill);
    });

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      filtersEl.querySelectorAll(".filter-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.target;
      applyFiltersWithTransition();
    });
  }

  function setupToolbar() {
    document.getElementById("search-input").addEventListener("input", applyFiltersWithTransition);

    const roleFilter = document.getElementById("role-filter");
    const allRoles = new Set();
    CATEGORIES.forEach((cat) => cat.videos.forEach((v) => (v.roles || []).forEach((r) => allRoles.add(r))));
    if (allRoles.size > 0) {
      roleFilter.hidden = false;
      [...allRoles].sort().forEach((role) => {
        const opt = document.createElement("option");
        opt.value = role.toLowerCase();
        opt.textContent = role;
        roleFilter.appendChild(opt);
      });
    }
    roleFilter.addEventListener("change", () => {
      activeRole = roleFilter.value;
      applyFiltersWithTransition();
    });

    document.getElementById("print-link").addEventListener("click", () => window.print());
  }

  // Combine tri par vues + filtre par catégorie + recherche + dépliage "voir plus" en un seul passage.
  function applyFilters() {
    const searchTerm = document.getElementById("search-input").value.trim().toLowerCase();
    let anyVisible = false;

    document.querySelectorAll(".category").forEach((section) => {
      const categoryMatches = activeCategory === "all" || section.dataset.slug === activeCategory;
      if (!categoryMatches) {
        section.style.display = "none";
        return;
      }

      sortByViews(section);

      let anyMatch = false;
      section.querySelectorAll(".video-card").forEach((card) => {
        const title = card.querySelector('[data-role="title"]').textContent.toLowerCase();
        const matchesSearch = !searchTerm || title.includes(searchTerm);
        const cardRoles = (card.dataset.roles || "").split(",");
        const matchesRole = activeRole === "all" || cardRoles.includes(activeRole);
        const matches = matchesSearch && matchesRole;
        card.style.display = matches ? "" : "none";
        if (matches) anyMatch = true;
      });

      const isFiltering = searchTerm !== "" || activeRole !== "all";
      const sectionVisible = !(isFiltering && !anyMatch);
      section.style.display = sectionVisible ? "" : "none";
      if (sectionVisible) anyVisible = true;

      const forceExpand = isFiltering || section.dataset.userExpanded === "true";
      section.classList.toggle("expanded", forceExpand);

      const moreBtn = section.querySelector(".show-more-btn");
      if (moreBtn) {
        const hideBtn = isFiltering || section.dataset.userExpanded === "true";
        moreBtn.closest(".show-more-row").style.display = hideBtn ? "none" : "";
      }
    });

    document.getElementById("empty-state").hidden = anyVisible;
  }

  // Version "utilisateur" d'applyFilters : ajoute un léger fondu pour adoucir le changement
  // (recherche, filtre catégorie/rôle). Les mises à jour automatiques (vues qui arrivent...)
  // continuent d'appeler applyFilters() directement, sans fondu, pour ne pas clignoter.
  function applyFiltersWithTransition() {
    const root = document.getElementById("categories");
    root.classList.add("filtering");
    setTimeout(() => {
      applyFilters();
      requestAnimationFrame(() => root.classList.remove("filtering"));
    }, 120);
  }

  // Vidéos toujours classées de la plus vue à la moins vue (recalculé à chaque
  // ajout de vidéo et à chaque rafraîchissement des vues, sans rien à faire).
  function sortByViews(section) {
    const grid = section.querySelector(".video-grid");
    const cards = [...grid.querySelectorAll(".video-card")];
    cards.sort((a, b) => parseInt(b.dataset.views || "0", 10) - parseInt(a.dataset.views || "0", 10));
    cards.forEach((card, i) => {
      card.classList.toggle("extra", i >= SHOW_MORE_THRESHOLD);
      grid.appendChild(card);
    });
  }

  function renderCategories() {
    const root = document.getElementById("categories");
    root.innerHTML = "";

    CATEGORIES.forEach((cat) => {
      const section = document.createElement("section");
      section.className = "category";
      section.dataset.slug = slugify(cat.name);

      const head = document.createElement("div");
      head.className = "category-head reveal";
      if (cat.logo) {
        const img = document.createElement("img");
        img.className = "category-logo";
        img.src = cat.logo;
        img.alt = cat.name;
        head.appendChild(img);
      }
      const headText = document.createElement("div");
      const nameRow = document.createElement("div");
      nameRow.className = "category-name-row";
      const h3 = document.createElement("h3");
      h3.className = "category-name";
      h3.textContent = cat.name;
      nameRow.appendChild(h3);

      const handle = extractHandle(cat.channelUrl);
      if (handle && PROFILE.youtubeApiKey) {
        const subs = document.createElement("span");
        subs.className = "sub-badge skeleton-text skeleton-subs";
        subs.dataset.role = "subs";
        subs.dataset.handle = handle;
        nameRow.appendChild(subs);
      }
      headText.appendChild(nameRow);
      if (cat.description) {
        const p = document.createElement("p");
        p.className = "category-desc";
        p.textContent = cat.description;
        headText.appendChild(p);
      }
      head.appendChild(headText);

      if (cat.channelUrl) {
        const link = document.createElement("a");
        link.className = "channel-btn";
        link.href = cat.channelUrl;
        link.target = "_blank";
        link.rel = "noopener";
        link.innerHTML = `${youtubeIcon()}<span>Voir la chaîne</span>`;
        head.appendChild(link);
      }

      section.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "video-grid";

      cat.videos.forEach((video, i) => {
        grid.appendChild(renderVideoCard(video, i));
      });

      section.appendChild(grid);

      if (cat.videos.length > SHOW_MORE_THRESHOLD) {
        const row = document.createElement("div");
        row.className = "show-more-row";
        const btn = document.createElement("button");
        btn.className = "show-more-btn";
        btn.textContent = `Voir plus (${cat.videos.length - SHOW_MORE_THRESHOLD})`;
        btn.addEventListener("click", () => {
          section.dataset.userExpanded = "true";
          section.classList.add("expanded");
          row.style.display = "none";
        });
        row.appendChild(btn);
        section.appendChild(row);
      }

      root.appendChild(section);
    });
  }

  function renderVideoCard(video, index) {
    const card = document.createElement("div");
    card.className = "video-card reveal";
    card.dataset.videoId = video.youtubeId;
    card.dataset.views = "0";
    card.dataset.roles = (video.roles || []).map((r) => r.toLowerCase()).join(",");
    card.style.transitionDelay = `${(index % 6) * 60}ms`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    const hasTitle = !!video.title;
    const showViews = !!PROFILE.youtubeApiKey;

    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg" alt="${hasTitle ? video.title : ""}" loading="lazy" width="480" height="360">
        <div class="play-badge"></div>
        ${showViews ? `<span class="new-badge" data-role="new" hidden>Nouveau</span><span class="duration-badge" data-role="duration"></span>` : ""}
      </div>
      <div class="video-body">
        ${roleBadges(video.roles)}
        <p class="video-title${hasTitle ? "" : " skeleton-text"}" data-role="title">${hasTitle ? video.title : ""}</p>
        ${showViews ? `<div class="video-meta"><span class="skeleton-text skeleton-views" data-role="views"></span><span data-role="published"></span></div>` : ""}
      </div>
    `;

    card.addEventListener("click", () => openModal(video, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(video, card);
      }
    });

    const thumbImg = card.querySelector(".thumb-wrap img");
    if (thumbImg.complete) {
      thumbImg.classList.add("loaded");
    } else {
      thumbImg.addEventListener("load", () => thumbImg.classList.add("loaded"));
    }

    return card;
  }

  function setupBackToTop() {
    const btn = document.getElementById("back-to-top");
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function setupScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  }

  let lastFocusedCard = null;

  function openModal(video, card) {
    const modal = document.getElementById("video-modal");
    const player = document.getElementById("modal-player");
    const title = document.getElementById("modal-title");
    const meta = document.getElementById("modal-meta");

    const titleText = card.querySelector('[data-role="title"]').textContent;
    const viewsText = card.querySelector('[data-role="views"]').textContent;

    player.innerHTML = `<iframe src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0" title="${titleText}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    title.textContent = titleText;
    meta.textContent = viewsText;

    lastFocusedCard = card;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close").focus();
  }

  function closeModal() {
    const modal = document.getElementById("video-modal");
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
      document.getElementById("modal-player").innerHTML = "";
    }, 200);
    if (lastFocusedCard) lastFocusedCard.focus();
  }

  function setupModalControls() {
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-backdrop").addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // Récupère le titre des vidéos sans "title" défini, via l'oEmbed public de YouTube (aucune clé requise).
  async function fillMissingTitles() {
    const cards = document.querySelectorAll(".video-card");
    for (const card of cards) {
      const titleEl = card.querySelector('[data-role="title"]');
      if (!titleEl.classList.contains("skeleton-text")) continue;
      try {
        const id = card.dataset.videoId;
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        if (!res.ok) throw new Error("oEmbed failed");
        const data = await res.json();
        titleEl.textContent = data.title;
        const img = card.querySelector(".thumb-wrap img");
        if (img) img.alt = data.title;
      } catch {
        titleEl.textContent = "";
      } finally {
        titleEl.classList.remove("skeleton-text");
      }
    }
  }

  // Récupère le nombre d'abonnés de chaque chaîne via l'API YouTube Data v3 (un appel par
  // chaîne, l'API ne permet pas de grouper la recherche par handle comme pour les vidéos).
  async function fillSubscriberCounts() {
    if (!PROFILE.youtubeApiKey) return;
    const badges = document.querySelectorAll('[data-role="subs"]');

    for (const badge of badges) {
      const handle = badge.dataset.handle;
      try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${encodeURIComponent(handle)}&key=${PROFILE.youtubeApiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("channels.list failed");
        const data = await res.json();
        const stats = data.items && data.items[0] && data.items[0].statistics;

        badge.classList.remove("skeleton-text", "skeleton-subs");

        const count = stats && !stats.hiddenSubscriberCount ? parseInt(stats.subscriberCount, 10) : 0;
        if (!count) {
          badge.textContent = "";
          continue;
        }
        if (!badge.querySelector(".subs-count")) {
          badge.innerHTML = `<span class="subs-count"></span> abonnés`;
        }
        animateNumber(badge.querySelector(".subs-count"), count);
      } catch (err) {
        console.warn("Impossible de récupérer les abonnés YouTube :", err);
        badge.classList.remove("skeleton-text", "skeleton-subs");
        badge.textContent = "";
      }
    }
  }

  // Récupère le nombre de vues via l'API YouTube Data v3, seulement si une clé est fournie dans data.js.
  async function fillViewCounts() {
    if (!PROFILE.youtubeApiKey) return;

    const ids = [...new Set([...document.querySelectorAll(".video-card")].map((c) => c.dataset.videoId))];
    const chunks = [];
    for (let i = 0; i < ids.length; i += 50) chunks.push(ids.slice(i, i + 50));

    const stats = {};
    for (const chunk of chunks) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${chunk.join(",")}&key=${PROFILE.youtubeApiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("YouTube API failed");
        const data = await res.json();
        (data.items || []).forEach((item) => {
          stats[item.id] = {
            views: item.statistics.viewCount,
            duration: item.contentDetails && item.contentDetails.duration,
            publishedAt: item.snippet && item.snippet.publishedAt,
          };
        });
      } catch (err) {
        console.warn("Impossible de récupérer les vues YouTube :", err);
        break;
      }
    }

    document.querySelectorAll(".video-card").forEach((card) => {
      const info = stats[card.dataset.videoId];
      const count = info && info.views;
      if (count) card.dataset.views = count;

      const viewsEl = card.querySelector('[data-role="views"]');
      if (viewsEl) {
        viewsEl.classList.remove("skeleton-text", "skeleton-views");
        if (count) {
          if (!viewsEl.querySelector(".views-count")) {
            viewsEl.innerHTML = `<span class="views-count"></span> vues`;
          }
          animateNumber(viewsEl.querySelector(".views-count"), count);
        } else {
          viewsEl.textContent = "";
        }
      }

      const durationEl = card.querySelector('[data-role="duration"]');
      if (durationEl && info && info.duration) {
        durationEl.textContent = formatDuration(info.duration);
      }

      const publishedEl = card.querySelector('[data-role="published"]');
      if (publishedEl && info && info.publishedAt) {
        publishedEl.textContent = `· ${formatRelativeTime(info.publishedAt)}`;
      }

      const newEl = card.querySelector('[data-role="new"]');
      if (newEl && info && info.publishedAt) {
        const ageDays = (Date.now() - new Date(info.publishedAt).getTime()) / 86400000;
        newEl.hidden = ageDays > NEW_BADGE_DAYS;
      }
    });

    updateTotalViewsStat();
    applyFilters();
  }

  // Tant que la page reste ouverte, on rafraîchit les vues toutes les 5 minutes
  // pour un effet "temps réel" (inutile de descendre en dessous : le quota API
  // gratuit est limité et les vues ne bougent pas seconde par seconde).
  const VIEW_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

  setupThemeToggle();
  renderProfile();
  renderStats();
  renderFilters();
  renderCategories();
  setupToolbar();
  setupModalControls();
  setupScrollReveal();
  setupBackToTop();
  applyFilters();
  fillMissingTitles().then(applyFilters);
  fillViewCounts();
  fillSubscriberCounts();
  setInterval(() => {
    fillViewCounts();
    fillSubscriberCounts();
  }, VIEW_REFRESH_INTERVAL_MS);
})();
