'use client'

import { useEffect } from 'react'

export function MotionController() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = matchMedia('(min-width: 768px)')
    const active = new Set<Animation>()
    const seen = new WeakSet<Element>()
    const feature = document.querySelector<HTMLElement>('.typography-feature')
    const visuals = Array.from(document.querySelectorAll<HTMLElement>('.project-visual'))
    let observer: IntersectionObserver | undefined
    let frame = 0

    const enter = (node: Element, delay = 0, image = false) => {
      if (reduced.matches || !(node instanceof HTMLElement) || !node.animate) return
      const animation = node.animate(
        image
          ? [
              { opacity: 0, clipPath: 'inset(8% 0 0 0)', transform: 'translateY(24px)' },
              { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' },
            ]
          : [
              { opacity: 0, transform: 'translateY(28px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
        { duration: image ? 900 : 700, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' },
      )
      active.add(animation)
      animation.finished.catch(() => undefined).finally(() => active.delete(animation))
    }

    const clamp = (value: number) => Math.max(0, Math.min(1, value))
    const render = () => {
      frame = 0
      if (reduced.matches) return
      const height = innerHeight
      if (feature) {
        const rect = feature.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < height) {
          const progress = clamp((height - rect.top) / (height + rect.height))
          feature.style.setProperty('--type-drift', `${((0.5 - progress) * (desktop.matches ? 100 : 30)).toFixed(2)}px`)
        }
      }
      visuals.forEach((visual) => {
        const rect = visual.getBoundingClientRect()
        if (rect.bottom <= 0 || rect.top >= height) return
        const progress = clamp((height - rect.top) / (height + rect.height))
        visual.style.setProperty('--image-drift', `${((progress - 0.5) * (desktop.matches ? 36 : 16)).toFixed(2)}px`)
      })
    }
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(render)
    }
    const setup = () => {
      observer?.disconnect()
      active.forEach((animation) => animation.cancel())
      active.clear()
      document.documentElement.classList.toggle('motion-enabled', !reduced.matches)
      if (reduced.matches) {
        feature?.style.removeProperty('--type-drift')
        visuals.forEach((node) => node.style.removeProperty('--image-drift'))
        cancelAnimationFrame(frame)
        frame = 0
        return
      }
      observer = new IntersectionObserver(
        (entries) => {
          let order = 0
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            observer?.unobserve(entry.target)
            if (seen.has(entry.target)) return
            seen.add(entry.target)
            enter(entry.target, Math.min(order++ * 70, 210), entry.target.matches('figure'))
          })
        },
        { rootMargin: '0px 0px -6% 0px' },
      )
      document
        .querySelectorAll('.section-heading > *, .chapter, .project-visual, .project-body, .mentoring-photo, .mentoring-certificate, .contact h2, .contact-bottom > *, .site-footer')
        .forEach((node) => { if (!seen.has(node)) observer?.observe(node) })
      schedule()
    }

    const onFocus = (event: FocusEvent) => {
      active.forEach((animation) => {
        const effect = animation.effect
        const target = effect instanceof KeyframeEffect ? effect.target : null
        if (target instanceof Element && event.target instanceof Node && target.contains(event.target)) animation.cancel()
      })
    }
    const onVisibility = () => schedule()
    const onPageHide = () => { cancelAnimationFrame(frame); frame = 0 }
    document.addEventListener('focusin', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('pageshow', schedule)
    window.addEventListener('pagehide', onPageHide)
    reduced.addEventListener('change', setup)
    setup()
    document.querySelectorAll('.hero-title, .hero-identity, .hero-media, .hero-intro, .hero-foot').forEach((node, index) => enter(node, index * 90, node.matches('figure')))

    return () => {
      observer?.disconnect()
      active.forEach((animation) => animation.cancel())
      cancelAnimationFrame(frame)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pageshow', schedule)
      window.removeEventListener('pagehide', onPageHide)
      reduced.removeEventListener('change', setup)
    }
  }, [])

  return null
}
