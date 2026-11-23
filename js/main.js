
/*  INNSTILLINGER*/
const SETTINGS = {
    // Sett til false før endelig levering for å skjule den oransje telleren.
    showPlaceholderCounter: true,
    // Lesehastighet brukt for "Lesetid ca. X min"
    wordsPerMinute: 200,
  };
  
  document.documentElement.classList.add("js");
  
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initHeaderScroll();
    initProgress();
    initReveal();
    initChapterNav();
    initWordCount();
    initPlaceholderCounter();
    setYear();
  });
  
  /* 1. Mobilmeny */
  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;
  
    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    };
  
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }
  
  /* 2. Toppmeny ved scrolling */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }
  
  /* 3. Lesefremdrift */
  function initProgress() {
    const bar = document.querySelector(".progress");
    const article = document.querySelector("[data-article]");
    if (!bar || !article) return;
  
    let ticking = false;
    const update = () => {
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
  
  /* 4. Fade-inn-animasjoner */
  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
  
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  
    items.forEach((el) => observer.observe(el));
  }
  
  /* 5. Aktiv kapittel (XL) */
  function initChapterNav() {
    const links = document.querySelectorAll(".chapter-nav a");
    if (!links.length || !("IntersectionObserver" in window)) return;
  
    const map = new Map();
    links.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      if (section) map.set(section, link);
    });
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          const active = map.get(entry.target);
          active.classList.add("is-active");
          // Hold aktiv lenke synlig i den horisontale menyen på mobil
          active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        }
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
  
    map.forEach((_, section) => observer.observe(section));
  }
  
  /* 6. Ordtelling og lesetid */
  /* Teller ord i brødteksten ([data-article-body]), men hopper over
     plassholdere, bildetekster, faktabokser og kildeliste.
     Resultatet skrives inn i elementer med [data-reading-time] og [data-word-count]. */
  function countWords(root) {
    const clone = root.cloneNode(true);
    clone.querySelectorAll(".ph, .ph-note, figcaption, .factbox, .sources, .chapter-nav, .chapter__label, script")
      .forEach((el) => el.remove());
    const text = clone.textContent.replace(/\s+/g, " ").trim();
    // Tell bare "ord" som inneholder bokstaver eller tall (ikke tankestreker o.l.)
    return text ? text.split(" ").filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0;
  }
  
  function initWordCount() {
    const body = document.querySelector("[data-article-body]");
    if (!body) return;
  
    // XL-artikkelen er delt i flere tekstblokker (rundt kapittelskillet)
    const parts = document.querySelectorAll("[data-article-body], [data-article-body-cont]");
    const words = [...parts].reduce((sum, part) => sum + countWords(part), 0);
    const minutes = Math.max(1, Math.round(words / SETTINGS.wordsPerMinute));
  
    document.querySelectorAll("[data-reading-time]").forEach((el) => {
      el.textContent = `Lesetid ca. ${minutes} min`;
    });
    document.querySelectorAll("[data-word-count]").forEach((el) => {
      el.textContent = `${words} ord`;
    });
  
    // Hjelp i konsollen (F12) mens dere skriver: ord i forhold til målet
    const target = body.dataset.targetWords;
    if (target) {
      console.info(`[Portefølje] Brødtekst: ${words} ord (mål: ${target}). Plassholdere telles ikke.`);
    }
  }
  
  /* 7. Plassholderteller */
  function initPlaceholderCounter() {
    if (!SETTINGS.showPlaceholderCounter) {
      document.body.classList.add("hide-ph");
      return;
    }
    const count = document.querySelectorAll(".ph").length;
    if (!count) return;
  
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ph-counter";
    btn.title = "Klikk for å skjule/vise merkingen av plassholdere";
    const label = () => {
      const hidden = document.body.classList.contains("hide-ph");
      btn.textContent = `${count} plassholder${count === 1 ? "" : "e"} igjen${hidden ? " (skjult)" : ""}`;
    };
    btn.addEventListener("click", () => {
      document.body.classList.toggle("hide-ph");
      label();
    });
    label();
    document.body.appendChild(btn);
  }
  
  /* Årstall i bunntekst */
  function setYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }
  /* 8. Tall som teller opp i statistikkboksen ------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const nums = document.querySelectorAll("[data-count]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Uten animasjon står de riktige tallene allerede i HTML-en
  if (!nums.length || reduce || !("IntersectionObserver" in window)) return;

  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const fmt = new Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - p, 3); // rask start, myk slutt
      el.textContent = fmt.format(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  nums.forEach((el) => io.observe(el));
});