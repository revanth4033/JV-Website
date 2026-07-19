'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { asset, route } from '@/content'
import type { SiteSettings } from '@/content/types'
import { useSmoothScroll } from './SmoothScroll'

export function Header({ settings }: { settings: SiteSettings }) {
  const { logo, nav, ui } = settings
  const headerRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [atTopEdge, setAtTopEdge] = useState(false)
  const [autoHide, setAutoHide] = useState(false)
  const { lenis } = useSmoothScroll()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutoHide(window.matchMedia('(pointer: fine)').matches)

    const onScroll = (y: number) => setScrolled(y > 40)
    let cleanupScroll: () => void
    if (lenis) {
      const handler = (e: { scroll: number }) => onScroll(e.scroll)
      lenis.on('scroll', handler)
      cleanupScroll = () => lenis.off('scroll', handler)
    } else {
      const native = () => onScroll(window.scrollY)
      window.addEventListener('scroll', native, { passive: true })
      cleanupScroll = () => window.removeEventListener('scroll', native)
    }

    const onMove = (e: MouseEvent) => setAtTopEdge(e.clientY <= 70)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cleanupScroll()
      window.removeEventListener('mousemove', onMove)
    }
  }, [lenis])

  const hidden = autoHide && scrolled && !atTopEdge && !open

  useEffect(() => {
    if (lenis) (open ? lenis.stop() : lenis.start())
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis])

  const filteredNav = nav.filter(
    (item) => item.dropdown?.length || (item.href && item.href !== '#'),
  )

  return (
    <header
      ref={headerRef}
      className={`site-header${scrolled && !open ? ' scrolled' : ''}${hidden ? ' is-hidden' : ''}${open ? ' nav-open' : ''}`}
    >
      <Link
        className="logo"
        href={ui?.logoHref || '/'}
        onClick={() => setOpen(false)}
        data-cms-section="logo"
      >
        <Image src={asset(logo.src)} alt={logo.alt} width={240} height={30} priority unoptimized />
      </Link>

      <nav className="site-nav" data-cms-section="navigation">
        {filteredNav.map((item, idx) => {
          const num = String(idx + 1).padStart(2, '0')
          if (item.dropdown) {
            return (
              <div className="nav-has-drop" key={item.label}>
                <div className="nav-drop-trigger">
                  <span className="menu-count">{num}</span>
                  {item.label}
                  <svg
                    className="nav-caret"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                <div className="nav-drop">
                  {item.dropdown.map((d) => (
                    <Link href={route(d.href)} key={d.name} onClick={() => setOpen(false)}>
                      <span className="nd-name">{d.name}</span>
                      <span className="nd-sector">{d.sector}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          }
          return (
            <Link
              key={item.label}
              href={route(item.href)}
              className={item.cta ? 'nav-cta' : undefined}
              onClick={() => setOpen(false)}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="menu-count">{num}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <button
        className="nav-toggle"
        aria-label={ui?.menuLabel || 'Menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  )
}
