'use client'

import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap'

type LenisCtx = { lenis: Lenis | null; reduced: boolean }
const SmoothScrollContext = createContext<LenisCtx>({ lenis: null, reduced: false })

export const useSmoothScroll = () => useContext(SmoothScrollContext)

/**
 * Mirrors the prototype's Lenis setup: smooth wheel scroll driven by the GSAP
 * ticker, ScrollTrigger synced on every scroll. Disabled under reduced-motion,
 * exactly like the original. Exposes the instance on window.__lenis (QA hook).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  // `reduced` must be state (not a ref) so the value propagates to consumers,
  // who re-run their GSAP effects via the [reduced] dependency.
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // one-time read of a browser preference after mount (avoids hydration mismatch)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(rm)
    if (rm) return

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true })
    instance.on('scroll', ScrollTrigger.update)
    ;(window as unknown as { __lenis?: Lenis }).__lenis = instance

    const raf = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(raf)
      instance.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={{ lenis, reduced }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
