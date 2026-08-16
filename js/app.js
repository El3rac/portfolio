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

  // Lit ?cat=... dans l'URL (utilisé par les liens du carrousel clients de l'accueil
  // pour arriver directement filtré sur la bonne chaîne sur la page Projets).
  function getInitialCategoryFromURL() {
    return new URLSearchParams(location.search).get("cat");
  }

  function renderSocialsInto(el) {
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

  // Éléments communs aux deux pages (header, footer).
  function renderChrome() {
    document.title = document.getElementById("hero-name") ? `${PROFILE.name} — Portfolio` : `${PROFILE.name} — Projets`;
    document.getElementById("logo-text").textContent = PROFILE.name;

    const availEl = document.getElementById("availability-badge");
    const isAvailable = PROFILE.availability !== "complet";
    availEl.textContent = isAvailable ? "Disponible pour de nouveaux projets" : "Complet en ce moment";
    availEl.classList.toggle("is-available", isAvailable);
    availEl.classList.toggle("is-full", !isAvailable);

    renderSocialsInto(document.getElementById("socials-footer"));
  }

  // Bloc "à propos" : uniquement présent sur l'accueil.
  function renderHero() {
    document.getElementById("hero-eyebrow").textContent = PROFILE.eyebrow || "";
    document.getElementById("hero-name").textContent = PROFILE.name;
    document.getElementById("hero-bio").textContent = PROFILE.bio || "";

    const avatarEl = document.getElementById("avatar");
    if (PROFILE.avatar) {
      avatarEl.src = PROFILE.avatar;
      avatarEl.alt = PROFILE.name;
      avatarEl.hidden = false;
    }

    renderSocialsInto(document.getElementById("socials"));
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

  function playIcon() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
  }

  // Une icône par rôle, pour qu'on le reconnaisse même sans lire le texte du badge.
  const ROLE_ICON = {
    script: () => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
    montage: () => `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
    "réalisation": () => `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="18" height="12" rx="1"/><path d="M3 8l2-5h4l-2 5M9 8l2-5h4l-2 5M15 8l2-5h2l-1 5"/></svg>`,
    voix: () => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  };

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

  // Date ISO -> "3 mois" (sans le "il y a" : le ticket d'affichage porte déjà ce mot comme légende)
  function formatRelativeTime(iso) {
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    const units = [
      ["an", 31536000], ["mois", 2592000], ["semaine", 604800],
      ["jour", 86400], ["heure", 3600], ["minute", 60],
    ];
    for (const [label, secs] of units) {
      const val = Math.floor(diffSec / secs);
      if (val >= 1) return `${val} ${label}${val > 1 && label !== "mois" ? "s" : ""}`;
    }
    return "quelques secondes";
  }

  function roleBadges(roles) {
    if (!roles || !roles.length) return "";
    const badges = roles
      .map((r) => {
        const key = r.toLowerCase();
        const icon = ROLE_ICON[key] ? ROLE_ICON[key]() : "";
        return `<span class="role-badge ${ROLE_CLASS[key] || ""}">${icon}${r}</span>`;
      })
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

  // Le total s'appuie sur TOUTES les vidéos de data.js (pas seulement celles affichées
  // sur la page en cours) : sur l'accueil, seule une sélection de vidéos est visible,
  // mais "Vues cumulées" doit refléter l'ensemble du travail, pas juste ce qui est montré.
  function updateTotalViewsStat(statsById) {
    const statViews = document.getElementById("stat-views");
    if (!statViews || !PROFILE.youtubeApiKey) return;
    let total = 0;
    Object.values(statsById).forEach((info) => {
      total += parseInt(info.views || "0", 10);
    });
    animateNumber(statViews, total);
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

  // Carrousel des chaînes/clients, tout premier bloc de l'accueil. Chaque carte mène
  // vers la page Projets déjà filtrée sur cette chaîne (?cat=slug).
  function renderClientCarousel() {
    const track = document.getElementById("client-carousel");
    if (!track) return;
    track.innerHTML = "";

    CATEGORIES.forEach((cat) => {
      const slug = slugify(cat.name);
      const card = document.createElement("a");
      card.className = "client-card reveal";
      card.href = `projets.html?cat=${slug}`;

      const handle = extractHandle(cat.channelUrl);
      const showSubs = handle && PROFILE.youtubeApiKey;

      card.innerHTML = `
        <div class="client-avatar">${cat.logo ? `<img src="${cat.logo}" alt="${cat.name}">` : ""}</div>
        <h3 class="client-name">${cat.name}</h3>
        <div class="client-tickets">
          ${showSubs ? `<div class="ticket skeleton-ticket" data-role="subs" data-handle="${handle}"><span class="n"></span><span class="lbl">abonnés</span></div>` : ""}
          <div class="ticket"><span class="n">${cat.videos.length}</span><span class="lbl">vidéo${cat.videos.length > 1 ? "s" : ""}</span></div>
        </div>
        ${cat.description ? `<p class="client-desc">${cat.description}</p>` : ""}
      `;

      track.appendChild(card);
    });
  }

  function setupCarouselArrows() {
    const track = document.getElementById("client-carousel");
    const prev = document.getElementById("carousel-prev");
    const next = document.getElementById("carousel-next");
    if (!track || !prev || !next) return;
    const amount = () => track.clientWidth * 0.8;
    prev.addEventListener("click", () => track.scrollBy({ left: -amount(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: amount(), behavior: "smooth" }));
  }

  // Section "Quelques vidéos" de l'accueil : uniquement les vidéos marquées
  // "featured: true" dans data.js, ou à défaut la première vidéo de chaque chaîne.
  // "Quelques exemples de vidéos" (accueil) : la vidéo la plus vue de chaque chaîne
  // + toutes les vidéos publiées il y a moins de NEW_BADGE_DAYS jours. Sans clé API
  // (pas de vues/dates connues), on se rabat sur la première vidéo de chaque chaîne.
  // Rappelée à chaque rafraîchissement des vues : la sélection reste toujours à jour.
  function renderFeaturedVideos(statsById) {
    const grid = document.getElementById("featured-grid");
    if (!grid) return;

    // Chaque pick garde trace de sa chaîne d'origine : sur l'accueil (plusieurs chaînes
    // mélangées), un petit tag au-dessus du titre indique de laquelle vient chaque vidéo.
    let picks;
    if (statsById) {
      const viewsOf = (v) => parseInt((statsById[v.youtubeId] || {}).views || "0", 10);

      const topPerCategory = CATEGORIES
        .filter((cat) => cat.videos.length > 0)
        .map((cat) => ({ video: cat.videos.reduce((best, v) => (viewsOf(v) > viewsOf(best) ? v : best)), categoryName: cat.name }));

      const newVideos = [];
      CATEGORIES.forEach((cat) => cat.videos.forEach((v) => {
        const info = statsById[v.youtubeId];
        if (!info || !info.publishedAt) return;
        const ageDays = (Date.now() - new Date(info.publishedAt).getTime()) / 86400000;
        if (ageDays <= NEW_BADGE_DAYS) newVideos.push({ video: v, categoryName: cat.name });
      }));

      const seen = new Set();
      picks = [...topPerCategory, ...newVideos].filter((p) => {
        if (seen.has(p.video.youtubeId)) return false;
        seen.add(p.video.youtubeId);
        return true;
      });
    } else {
      picks = CATEGORIES.filter((cat) => cat.videos.length > 0).map((cat) => ({ video: cat.videos[0], categoryName: cat.name }));
    }

    grid.innerHTML = "";
    picks.forEach((p, i) => {
      const card = renderVideoCard(p.video, i, p.categoryName);
      card.classList.add("visible"); // cette section peut se reconstruire en direct : pas d'animation d'apparition à re-déclencher
      grid.appendChild(card);
    });
  }

  function renderFilters() {
    const filtersEl = document.getElementById("filters");
    if (!filtersEl) return;
    filtersEl.innerHTML = "";

    const urlCat = getInitialCategoryFromURL();
    let matchedUrlCat = false;

    const allPill = document.createElement("button");
    allPill.className = "filter-pill";
    allPill.textContent = "Tout";
    allPill.dataset.target = "all";
    filtersEl.appendChild(allPill);

    CATEGORIES.forEach((cat) => {
      const pill = document.createElement("button");
      const slug = slugify(cat.name);
      pill.className = "filter-pill";
      pill.textContent = cat.name;
      pill.dataset.target = slug;
      if (urlCat && urlCat === slug) {
        pill.classList.add("active");
        activeCategory = slug;
        matchedUrlCat = true;
      }
      filtersEl.appendChild(pill);
    });

    if (!matchedUrlCat) {
      allPill.classList.add("active");
      activeCategory = "all";
    }

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      filtersEl.querySelectorAll(".filter-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.target;
      applyFiltersWithTransition();
    });
  }

  function setupPrintLink() {
    const btn = document.getElementById("print-link");
    if (btn) btn.addEventListener("click", () => window.print());
  }

  // Formulaire de contact optionnel (footer), envoyé via Web3Forms (gratuit, sans backend).
  // Reste caché tant qu'aucune clé n'est renseignée dans PROFILE.web3formsAccessKey.
  function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form || !PROFILE.web3formsAccessKey) return;
    form.hidden = false;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.elements.botcheck.checked) return; // piège à robots spammeurs

      const status = document.getElementById("contact-form-status");
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi…";
      status.hidden = true;

      const formData = new FormData(form);
      formData.append("access_key", PROFILE.web3formsAccessKey);
      formData.append("subject", `Nouveau projet via le portfolio — ${formData.get("name")}`);

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Erreur inconnue");

        form.reset();
        status.textContent = "Message envoyé, merci ! Je vous réponds au plus vite.";
        status.className = "contact-form-status success";
      } catch (err) {
        status.textContent = "Oups, l'envoi a échoué. Écrivez-moi directement par email à la place.";
        status.className = "contact-form-status error";
        console.warn("Erreur formulaire de contact :", err);
      } finally {
        status.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer";
      }
    });
  }

  function setupRoleFilter() {
    const roleFilter = document.getElementById("role-filter");
    if (!roleFilter) return;

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
  }

  // Combine tri par vues + filtre par catégorie/rôle + dépliage "voir plus" en un seul passage.
  // Ne fait rien sur l'accueil (pas de page Projets = pas de #categories dans le DOM).
  function applyFilters() {
    const categoriesRoot = document.getElementById("categories");
    if (!categoriesRoot) return;

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
        const cardRoles = (card.dataset.roles || "").split(",");
        const matches = activeRole === "all" || cardRoles.includes(activeRole);
        card.style.display = matches ? "" : "none";
        if (matches) anyMatch = true;
      });

      const isFiltering = activeRole !== "all";
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
    if (!root) return;
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
    if (!root) return;
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

  function renderVideoCard(video, index, channelName) {
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
        <div class="play-badge"><div class="aperture">${playIcon()}</div></div>
        ${showViews ? `<span class="new-badge" data-role="new" hidden>Nouveau</span><span class="duration-badge" data-role="duration"></span>` : ""}
      </div>
      <div class="video-body">
        ${roleBadges(video.roles)}
        ${channelName ? `<span class="channel-tag">${channelName}</span>` : ""}
        <p class="video-title${hasTitle ? "" : " skeleton-text"}" data-role="title">${hasTitle ? video.title : ""}</p>
        ${showViews ? `
          <div class="card-footer">
            <div class="ticket-stack">
              <div class="ticket skeleton-ticket" data-role="views"><span class="n"></span><span class="lbl">vues</span></div>
              <div class="ticket skeleton-ticket" data-role="published"><span class="lbl">il y a</span><span class="n"></span></div>
            </div>
          </div>
        ` : ""}
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

  // Halo doré qui suit la souris sur tout le site (les deux pages). Le halo est en
  // position fixed (coordonnées écran directes) : il s'arrête visuellement au bandeau
  // du haut et à celui du bas car ceux-ci ont un fond opaque qui le masque (voir CSS).
  function setupPageSpotlight() {
    const spot = document.getElementById("page-spotlight");
    if (!spot) return;
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      spot.style.setProperty("--mx", x + "%");
      spot.style.setProperty("--my", y + "%");
    });
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
    const viewsTicket = card.querySelector('[data-role="views"]');
    const viewsN = viewsTicket && viewsTicket.querySelector(".n");
    const viewsText = viewsN ? `${viewsN.textContent} vues` : "";

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
  // Fonctionne aussi bien pour les badges du carrousel accueil que ceux de la page Projets.
  async function fillSubscriberCounts() {
    if (!PROFILE.youtubeApiKey) return;
    const badges = document.querySelectorAll('[data-role="subs"]');

    for (const badge of badges) {
      const handle = badge.dataset.handle;
      // Le badge du carrousel accueil est un ticket (icône .n/.lbl déjà en place dans
      // le HTML) ; celui des en-têtes de catégorie sur Projets est un simple texte.
      const isTicket = badge.classList.contains("ticket");
      try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${encodeURIComponent(handle)}&key=${PROFILE.youtubeApiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("channels.list failed");
        const data = await res.json();
        const stats = data.items && data.items[0] && data.items[0].statistics;
        const count = stats && !stats.hiddenSubscriberCount ? parseInt(stats.subscriberCount, 10) : 0;

        if (isTicket) {
          badge.classList.remove("skeleton-ticket");
          if (count) {
            animateNumber(badge.querySelector(".n"), count);
          } else {
            badge.remove();
          }
        } else {
          badge.classList.remove("skeleton-text", "skeleton-subs");
          if (!count) {
            badge.textContent = "";
            continue;
          }
          if (!badge.querySelector(".subs-count")) {
            badge.innerHTML = `<span class="subs-count"></span> abonnés`;
          }
          animateNumber(badge.querySelector(".subs-count"), count);
        }
      } catch (err) {
        console.warn("Impossible de récupérer les abonnés YouTube :", err);
        if (isTicket) {
          badge.remove();
        } else {
          badge.classList.remove("skeleton-text", "skeleton-subs");
          badge.textContent = "";
        }
      }
    }
  }

  // Récupère le nombre de vues via l'API YouTube Data v3, seulement si une clé est fournie dans data.js.
  // Va chercher les stats de TOUTES les vidéos de data.js (pas seulement celles affichées sur la
  // page en cours), pour que "Vues cumulées" reste juste même sur l'accueil (qui n'affiche qu'une
  // sélection). Un seul appel API par tranche de 50 vidéos, donc ça ne coûte rien de plus.
  async function fillViewCounts() {
    if (!PROFILE.youtubeApiKey) return;

    const ids = [...new Set(CATEGORIES.flatMap((cat) => cat.videos.map((v) => v.youtubeId)))];
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

    // L'accueil peut se reconstruire avec de nouveaux choix (vidéo la plus vue par
    // chaîne + nouveautés) : on le refait avant de décorer les cartes avec les stats,
    // sinon les cartes fraîchement créées resteraient sans vues/durée/titre.
    renderFeaturedVideos(stats);
    applyStatsToCards(stats);
    fillMissingTitles();

    updateTotalViewsStat(stats);
    applyFilters();
  }

  function applyStatsToCards(stats) {
    document.querySelectorAll(".video-card").forEach((card) => {
      const info = stats[card.dataset.videoId];
      const count = info && info.views;
      if (count) card.dataset.views = count;

      const viewsTicket = card.querySelector('[data-role="views"]');
      if (viewsTicket) {
        viewsTicket.classList.remove("skeleton-ticket");
        if (count) {
          animateNumber(viewsTicket.querySelector(".n"), count);
        }
      }

      const durationEl = card.querySelector('[data-role="duration"]');
      if (durationEl && info && info.duration) {
        durationEl.textContent = formatDuration(info.duration);
      }

      const publishedTicket = card.querySelector('[data-role="published"]');
      if (publishedTicket && info && info.publishedAt) {
        publishedTicket.classList.remove("skeleton-ticket");
        publishedTicket.querySelector(".n").textContent = formatRelativeTime(info.publishedAt);
      }

      const newEl = card.querySelector('[data-role="new"]');
      if (newEl && info && info.publishedAt) {
        const ageDays = (Date.now() - new Date(info.publishedAt).getTime()) / 86400000;
        newEl.hidden = ageDays > NEW_BADGE_DAYS;
      }
    });
  }

  // Tant que la page reste ouverte, on rafraîchit les vues toutes les 5 minutes
  // pour un effet "temps réel" (inutile de descendre en dessous : le quota API
  // gratuit est limité et les vues ne bougent pas seconde par seconde).
  const VIEW_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

  setupThemeToggle();
  renderChrome();
  setupPrintLink();
  setupContactForm();
  setupModalControls();
  setupBackToTop();
  setupPageSpotlight();

  if (document.getElementById("hero-name")) {
    renderHero();
    renderStats();
    renderClientCarousel();
    setupCarouselArrows();
    renderFeaturedVideos();
  }

  if (document.getElementById("categories")) {
    renderFilters();
    renderCategories();
    setupRoleFilter();
  }

  setupScrollReveal();
  applyFilters();
  fillMissingTitles().then(applyFilters);
  fillViewCounts();
  fillSubscriberCounts();
  setInterval(() => {
    fillViewCounts();
    fillSubscriberCounts();
  }, VIEW_REFRESH_INTERVAL_MS);
})();
