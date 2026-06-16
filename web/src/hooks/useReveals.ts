'use client'

import type { RefObject } from 'react'

import { EASE, gsap, useGSAP } from '@/lib/gsap'

/**
 * Masked line-reveals + fade-up reveals, scoped to a page container.
 * Mirrors the prototype: `.line-inner` slide up (skipping deck-activated lines),
 * `.reveal` fade/translate in. Under reduced-motion the CSS shows them statically,
 * so we no-op.
 */
export function useReveals(scope: RefObject<HTMLElement | null>, reduced: boolean) {
  useGSAP(
    () => {
      if (reduced) return
      gsap.utils.toArray<HTMLElement>('.line-inner').forEach((el) => {
        if (el.closest('.deck-stage')) return // deck lines are slide-activated
        gsap.to(el, {
          y: 0,
          duration: 1.2,
          ease: EASE,
          scrollTrigger: { trigger: el.closest('.line'), start: 'top 88%', once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    },
    { scope: scope as RefObject<HTMLElement>, dependencies: [reduced] },
  )
}
