/* Motion adapted from romancaseres.cloud: opposing scroll typography,
   staggered entrances and restrained image movement. No runtime dependencies. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 768px)');
  const active = new Set();
  const seen = new WeakSet();
  const feature = document.querySelector('.typography-feature');
  const visuals = [...document.querySelectorAll('.project-visual')];
  const header = document.querySelector('.site-header');
  let observer;
  let frame = 0;

  function enter(node, delay = 0, image = false) {
    if (reduced.matches || !node.animate) return;
    const animation = node.animate(image ? [
      { opacity: 0, clipPath: 'inset(8% 0 0 0)', transform: 'translateY(24px)' },
      { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' }
    ] : [
      { opacity: 0, transform: 'translateY(28px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: image ? 900 : 700, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    active.add(animation);
    animation.finished.catch(() => {}).finally(() => active.delete(animation));
  }

  const clamp = value => Math.max(0, Math.min(1, value));
  function render() {
    frame = 0;
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    if (reduced.matches) return;
    const height = window.innerHeight;
    if (feature) {
      const rect = feature.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < height) {
        const progress = clamp((height - rect.top) / (height + rect.height));
        const distance = desktop.matches ? 100 : 30;
        feature.style.setProperty('--type-drift', `${((.5 - progress) * distance).toFixed(2)}px`);
      }
    }
    visuals.forEach(visual => {
      const rect = visual.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= height) return;
      const progress = clamp((height - rect.top) / (height + rect.height));
      visual.style.setProperty('--image-drift', `${((progress - .5) * (desktop.matches ? 36 : 16)).toFixed(2)}px`);
    });
  }
  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }

  function setup() {
    observer?.disconnect();
    active.forEach(animation => animation.cancel());
    active.clear();
    document.documentElement.classList.toggle('motion-enabled', !reduced.matches);
    if (reduced.matches) {
      feature?.style.removeProperty('--type-drift');
      visuals.forEach(node => node.style.removeProperty('--image-drift'));
      cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        let order = 0;
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          observer.unobserve(node);
          if (seen.has(node)) return;
          seen.add(node);
          // A short stagger never holds up reading or keyboard navigation.
          enter(node, Math.min(order++ * 70, 210), node.matches('figure'));
        });
      }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
      document.querySelectorAll('.section-heading > *, .chapter, .project-visual, .project-body, .mentoring-photo, .mentoring-certificate, .contact h2, .contact-bottom > *, .site-footer').forEach(node => {
        if (!seen.has(node)) observer.observe(node);
      });
    }
    schedule();
  }

  // Reveal animation must not conceal a newly focused link or control.
  document.addEventListener('focusin', event => {
    active.forEach(animation => {
      if (animation.effect?.target?.contains(event.target)) animation.cancel();
    });
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', setup);
  setup();
  document.querySelectorAll('.hero-title, .hero-identity, .hero-media, .hero-intro, .hero-foot').forEach((node, index) => enter(node, index * 90, node.matches('figure')));
})();
