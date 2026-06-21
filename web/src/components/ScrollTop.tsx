'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useSmoothScroll } from './SmoothScroll'

/** Floating "back to top" button — appears after scrolling, on every page. */
export function ScrollTop() {
  const { lenis } = useSmoothScroll()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = (y: number) => setShow(y > 600)
    if (lenis) {
      const handler = (e: { scroll: number }) => onScroll(e.scroll)
      lenis.on('scroll', handler)
      return () => lenis.off('scroll', handler)
    }
    const native = () => onScroll(window.scrollY)
    window.addEventListener('scroll', native, { passive: true })
    return () => window.removeEventListener('scroll', native)
  }, [lenis])

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={`scroll-top${show ? ' show' : ''}`}
      onClick={toTop}
      aria-label="Back to top"
    >
      <ArrowUp size={20} strokeWidth={2.2} aria-hidden="true" />
    </button>
  )
}
