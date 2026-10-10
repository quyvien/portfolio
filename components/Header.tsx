'use client'

import { useEffect, useRef } from 'react'
import { navigation, portfolio } from '@/data/portfolio'

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 19c-4 1-4-2-6-3m12 6v-4c0-1-.4-1.5-1-2 3-.4 6-1.5 6-6 0-1.5-.5-2.5-1.5-3.5.3-1 .3-2-.2-3.5-1 0-2 .5-3.5 1.5a12 12 0 0 0-5.6 0C7.7 3.5 6.7 3 5.7 3c-.5 1.5-.5 2.5-.2 3.5C4.5 7.5 4 8.5 4 10c0 4.5 3 5.6 6 6-.6.5-1 1-1 2v4" />
    </svg>
  )
}

export function Header() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const themeLabelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    document.documentElement.classList.add('js-menu')
    const header = document.querySelector<HTMLElement>('.site-header')
    const colorQuery = matchMedia('(prefers-color-scheme: dark)')
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a[href^="#"], .overlay-nav a[href^="#"]'),
    )

    const updateThemeButton = () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
      const next = theme === 'dark' ? 'light' : 'dark'
      const button = document.querySelector<HTMLButtonElement>('.theme-toggle')
      if (button) {
        button.ariaLabel = `Switch to ${next} mode`
        button.title = `Switch to ${next} mode`
      }
      if (themeLabelRef.current) {
        themeLabelRef.current.textContent = next[0].toUpperCase() + next.slice(1)
      }
    }

    const syncSystemTheme = (event: MediaQueryListEvent) => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem('portfolio-theme')
      } catch {}
      if (saved !== 'light' && saved !== 'dark') {
        document.documentElement.dataset.theme = event.matches ? 'dark' : 'light'
        updateThemeButton()
      }
    }

    const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 24)
    onScroll()
    updateThemeButton()
    window.addEventListener('scroll', onScroll, { passive: true })
    colorQuery.addEventListener('change', syncSystemTheme)

    const sectionMap = new Map<Element, HTMLAnchorElement[]>()
    for (const link of links) {
      const id = link.hash.slice(1)
      const section = document.getElementById(id)
      if (!section) continue
      sectionMap.set(section, [...(sectionMap.get(section) ?? []), link])
    }
    const visible = new Map<Element, boolean>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target, entry.isIntersecting))
        const current = [...visible.entries()]
          .filter(([, isVisible]) => isVisible)
          .map(([section]) => section)
          .sort(
            (a, b) =>
              Math.abs(a.getBoundingClientRect().top - 100) -
              Math.abs(b.getBoundingClientRect().top - 100),
          )[0]
        links.forEach((link) => link.removeAttribute('aria-current'))
        sectionMap.get(current)?.forEach((link) => link.setAttribute('aria-current', 'location'))
      },
      { rootMargin: '-18% 0px -62% 0px' },
    )
    sectionMap.forEach((_, section) => observer.observe(section))

    return () => {
      document.documentElement.classList.remove('js-menu')
      window.removeEventListener('scroll', onScroll)
      colorQuery.removeEventListener('change', syncSystemTheme)
      observer.disconnect()
    }
  }, [])

  const closeMenu = (targetId?: string) => {
    dialogRef.current?.close()
    document.body.classList.remove('menu-open')
    toggleRef.current?.setAttribute('aria-expanded', 'false')
    if (targetId) {
      const target = document.getElementById(targetId)
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
      history.replaceState(null, '', `#${targetId}`)
    } else {
      toggleRef.current?.focus({ preventScroll: true })
    }
  }

  const toggleTheme = () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('portfolio-theme', next)
    } catch {}
    const button = document.querySelector<HTMLButtonElement>('.theme-toggle')
    if (button) {
      button.ariaLabel = `Switch to ${current} mode`
      button.title = `Switch to ${current} mode`
    }
    if (themeLabelRef.current) {
      themeLabelRef.current.textContent = current[0].toUpperCase() + current.slice(1)
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header wrap">
        <a className="wordmark" href="#home" aria-label="DevByVien — Home">DevByVien</a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([, label, id]) => (
            <a key={id} href={`#${id}`}>{label}{label === 'Contact' && <span aria-hidden="true">↗</span>}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-pill" href="#contact" aria-label="Messages — Contact Vien"><MessageIcon /><span>Messages</span></a>
          <a className="header-pill" href={portfolio.github} aria-label="Visit Quy Vien on GitHub"><GithubIcon /><span>GitHub</span></a>
        </div>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Switch color theme">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          <span className="theme-label" ref={themeLabelRef}>Theme</span>
        </button>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="site-menu"
          onClick={() => {
            dialogRef.current?.showModal()
            document.body.classList.add('menu-open')
            toggleRef.current?.setAttribute('aria-expanded', 'true')
          }}
        ><span /><span /><span /></button>
      </header>
      <dialog
        ref={dialogRef}
        id="site-menu"
        aria-labelledby="menu-title"
        onCancel={(event) => { event.preventDefault(); closeMenu() }}
      >
        <div className="menu-top wrap"><span id="menu-title" className="eyebrow">EXPLORE THE PORTFOLIO</span><button className="menu-close" type="button" aria-label="Close menu" onClick={() => closeMenu()}>✕</button></div>
        <nav className="overlay-nav wrap" aria-label="Expanded navigation">
          {navigation.map(([number, label, id]) => (
            <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); closeMenu(id) }}><span>{number}</span>{label}<span aria-hidden="true">↗</span></a>
          ))}
        </nav>
        <p className="menu-bottom eyebrow">SOFTWARE · LEARNING · DEVELOPMENT</p>
      </dialog>
    </>
  )
}
