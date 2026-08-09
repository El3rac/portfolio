(function () {
  const fmtViews = new Intl.NumberFormat("fr-FR");

  function renderProfile() {
    document.title = `${PROFILE.name} — Portfolio`;
    document.getElementById("logo-text").textContent = PROFILE.name;
    document.getElementById("hero-eyebrow").textContent = PROFILE.eyebrow || "";
    document.getElementById("hero-name").textContent = PROFILE.name;
    document.getElementById("hero-bio").textContent = PROFILE.bio || "";
    document.getElementById("footer-text").textContent = PROFILE.footerText || "";

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

  function youtubeIcon() {
    return `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z"/></svg>`;
  }

  function slugify(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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

      const target = btn.dataset.target;
      document.querySelectorAll(".category").forEach((section) => {
        section.style.display = target === "all" || section.dataset.slug === target ? "" : "none";
      });
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
      head.className = "category-head";
      if (cat.logo) {
        const img = document.createElement("img");
        img.className = "category-logo";
        img.src = cat.logo;
        img.alt = cat.name;
        head.appendChild(img);
      }
      const headText = document.createElement("div");
      const h3 = document.createElement("h3");
      h3.className = "category-name";
      h3.textContent = cat.name;
      headText.appendChild(h3);
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

      cat.videos.forEach((video) => {
        grid.appendChild(renderVideoCard(video));
      });

      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  function renderVideoCard(video) {
    const card = document.createElement("div");
    card.className = "video-card";
    card.dataset.videoId = video.youtubeId;

    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg" alt="" loading="lazy">
        <div class="play-badge"></div>
      </div>
      <div class="video-body">
        <p class="video-title" data-role="title">${video.title || "Chargement…"}</p>
        <div class="video-meta">
          <span data-role="views"></span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openModal(video, card));
    return card;
  }

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

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const modal = document.getElementById("video-modal");
    document.getElementById("modal-player").innerHTML = "";
    modal.hidden = true;
    document.body.style.overflow = "";
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
      if (titleEl.textContent !== "Chargement…") continue;
      try {
        const id = card.dataset.videoId;
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        if (!res.ok) throw new Error("oEmbed failed");
        const data = await res.json();
        titleEl.textContent = data.title;
      } catch {
        titleEl.textContent = "";
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
        const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${chunk.join(",")}&key=${PROFILE.youtubeApiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("YouTube API failed");
        const data = await res.json();
        (data.items || []).forEach((item) => {
          stats[item.id] = item.statistics.viewCount;
        });
      } catch (err) {
        console.warn("Impossible de récupérer les vues YouTube :", err);
        return;
      }
    }

    document.querySelectorAll(".video-card").forEach((card) => {
      const count = stats[card.dataset.videoId];
      if (count) {
        card.querySelector('[data-role="views"]').textContent = `${fmtViews.format(count)} vues`;
      }
    });
  }

  // Tant que la page reste ouverte, on rafraîchit les vues toutes les 5 minutes
  // pour un effet "temps réel" (inutile de descendre en dessous : le quota API
  // gratuit est limité et les vues ne bougent pas seconde par seconde).
  const VIEW_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

  renderProfile();
  renderFilters();
  renderCategories();
  setupModalControls();
  fillMissingTitles();
  fillViewCounts();
  setInterval(fillViewCounts, VIEW_REFRESH_INTERVAL_MS);
})();
