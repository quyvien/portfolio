(() => {
  'use strict';
  const config = window.PORTFOLIO || {};
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const color = matchMedia('(prefers-color-scheme: dark)');
  document.querySelectorAll('[data-content]').forEach(node => {
    const value = config[node.dataset.content];
    if (typeof value === 'string' && value.trim()) node.textContent = value;
  });
  document.title = `${config.name || 'Quy Vien'} — Aspiring Software Engineer`;
  document.querySelector('#year').textContent = new Date().getFullYear();
  const menu = document.querySelector('#site-menu');
  const menuToggle = document.querySelector('.menu-toggle');
  if (menu && typeof menu.showModal === 'function') {
    document.documentElement.classList.add('js-menu');
    menuToggle.hidden = false;
    menuToggle.addEventListener('click', () => {
      menu.showModal();
      document.body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
    });
    const closeMenu = target => {
      menu.close();
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth' });
        history.replaceState(null, '', `#${target.id}`);
      } else menuToggle.focus({ preventScroll: true });
    };
    menu.querySelector('.menu-close').addEventListener('click', () => closeMenu());
    menu.addEventListener('cancel', event => {
      event.preventDefault();
      closeMenu();
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      closeMenu(target);
    }));
  }
  document.querySelectorAll('[data-project]').forEach((article, index) => {
    article.id = `project-${String(index + 1).padStart(2, '0')}`;
  });
  const themeButton = document.querySelector('.theme-toggle');
  let chosenTheme = null;
  try { chosenTheme = localStorage.getItem('portfolio-theme'); } catch { /* Storage can be disabled. */ }
  const setTheme = theme => {
    document.documentElement.dataset.theme = theme;
    const next = theme === 'dark' ? 'light' : 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${next} mode`);
    themeButton.title = `Switch to ${next} mode`;
    themeButton.querySelector('.theme-label').textContent = next[0].toUpperCase() + next.slice(1);
  };
  setTheme(document.documentElement.dataset.theme || (color.matches ? 'dark' : 'light'));
  themeButton.addEventListener('click', () => {
    chosenTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(chosenTheme);
    try { localStorage.setItem('portfolio-theme', chosenTheme); } catch { /* Keep the choice for this visit. */ }
  });
  color.addEventListener('change', event => { if (!['light', 'dark'].includes(chosenTheme)) setTheme(event.matches ? 'dark' : 'light'); });

  // Keep the compact header useful on long pages and expose the current
  // chapter without turning the navigation into a separate visual system.
  const sectionLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .overlay-nav a[href^="#"]')];
  const linkedSections = sectionLinks
    .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(item => item.section);
  if ('IntersectionObserver' in window && linkedSections.length) {
    const visibleSections = new Map();
    const updateCurrentSection = () => {
      const current = [...visibleSections.entries()]
        .filter(([, visible]) => visible)
        .map(([section]) => section)
        .sort((a, b) => Math.abs(a.getBoundingClientRect().top - 100) - Math.abs(b.getBoundingClientRect().top - 100))[0];
      linkedSections.forEach(({ link, section }) => {
        if (section === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => visibleSections.set(entry.target, entry.isIntersecting));
      updateCurrentSection();
    }, { rootMargin: '-18% 0px -62% 0px', threshold: 0 });
    linkedSections.forEach(({ section }) => sectionObserver.observe(section));
  }

  const safeURL = (value, email = false) => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, location.href);
      return ['http:', 'https:', ...(email ? ['mailto:'] : [])].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };
  for (const [kind, value] of Object.entries(config.contact || {})) {
    const row = document.querySelector(`[data-contact="${kind}"]`);
    if (!row || !value) continue;
    const url = safeURL(kind === 'email' ? `mailto:${value}` : value, kind === 'email');
    if (!url) continue;
    const link = document.createElement('a');
    link.href = url;
    link.textContent = kind === 'email' ? `${value} ↗` : `Visit ${kind === 'github' ? 'GitHub' : 'LinkedIn'} ↗`;
    row.querySelector('.contact-placeholder, a').replaceWith(link);
  }
  (config.projects || []).forEach((project, index) => {
    const article = document.querySelector(`[data-project="${index}"]`);
    if (!article) return;
    const fields = { title: '.project-title h3', summary: '.project-summary' };
    for (const [key, selector] of Object.entries(fields)) if (project[key]) article.querySelector(selector).textContent = project[key];
    if (project.title) {
      article.querySelector('.project-title .eyebrow').textContent = `${String(index + 1).padStart(2, '0')} / PROJECT`;
      const indexLink = document.querySelectorAll('.project-index a')[index];
      if (indexLink) indexLink.childNodes[1].textContent = ` ${project.title} `;
    }
    ['problem', 'contribution', 'approach', 'learning'].forEach((key, detailIndex) => {
      if (project[key]) article.querySelectorAll('dd')[detailIndex].textContent = project[key];
    });
    const visual = article.querySelector('.project-visual');
    const img = visual.querySelector('img');
    if (project.image) {
      const fallback = img.src;
      const fallbackAlt = img.alt;
      img.addEventListener('error', () => { img.src = fallback; img.alt = fallbackAlt; visual.querySelector('figcaption span:last-child').textContent = 'VISUAL UNAVAILABLE — PLACEHOLDER'; }, { once: true });
      img.src = project.image;
      img.alt = project.imageAlt || `${project.title || 'Project'} preview`;
      visual.querySelector('figcaption span:last-child').textContent = 'PROJECT PREVIEW';
    }
    if (project.video) {
      const clip = document.createElement('video');
      clip.controls = true; clip.playsInline = true; clip.preload = 'none';
      clip.poster = project.image || img.src; clip.src = project.video;
      clip.setAttribute('aria-label', `${project.title || 'Project'} demonstration`);
      clip.style.cssText = 'display:block;width:100%;height:100%;object-fit:contain;background:#242720';
      clip.addEventListener('error', () => { clip.remove(); img.hidden = false; visual.querySelector('figcaption').hidden = false; });
      img.hidden = true; visual.append(clip); visual.querySelector('figcaption').hidden = true;
    }
    const links = (project.links || []).filter(link => link.label && safeURL(link.url));
    if (links.length) {
      const container = article.querySelector('.project-links'); container.replaceChildren();
      links.forEach(item => { const link = document.createElement('a'); link.href = safeURL(item.url); link.textContent = `${item.label} ↗`; container.append(link); });
    }
  });

  const video = document.querySelector('#hero-video');
  const poster = document.querySelector('#hero-poster');
  const control = document.querySelector('#video-control');
  const status = document.querySelector('#media-status');
  const media = config.hero || {};
  let failed = false;
  let userPaused = false;
  if (media.poster) {
    poster.addEventListener('error', () => { poster.src = 'assets/hero-poster.svg'; video.poster = poster.src; }, { once: true });
    poster.src = media.poster; video.poster = media.poster;
  }
  if (media.posterAlt) poster.alt = media.posterAlt;
  function fallback(message) {
    video.pause(); video.hidden = true; control.hidden = true; status.textContent = message;
  }
  function updateControl() {
    control.textContent = video.paused ? 'Play video ▷' : 'Pause video Ⅱ';
    control.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
  }
  async function startVideo() {
    if (!media.video || failed || motion.matches) return;
    video.muted = true;
    if (!video.getAttribute('src')) video.src = media.video;
    try {
      await video.play();
      if (motion.matches || failed) return fallback('01 / STILL FRAME');
      video.hidden = false; control.hidden = false; status.textContent = '01 / MOVING PERSPECTIVES'; updateControl();
    } catch {
      fallback('01 / STILL FRAME — VIDEO UNAVAILABLE');
    }
  }
  video.addEventListener('error', () => { failed = true; fallback('01 / STILL FRAME — VIDEO UNAVAILABLE'); });
  video.addEventListener('pause', updateControl);
  video.addEventListener('play', updateControl);
  control.addEventListener('click', () => {
    if (video.paused) { userPaused = false; startVideo(); }
    else { userPaused = true; video.pause(); }
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      fallback('01 / STILL FRAME');
    } else if (!userPaused) startVideo();
  });
  if (media.video && motion.matches) fallback('01 / STILL FRAME');
  else startVideo();
})();
