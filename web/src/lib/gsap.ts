'use client'

// Central GSAP setup so plugins register exactly once on the client.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

// Motion grammar carried over from the prototype: one easing, three durations.
export const EASE = 'power3.out'

export { gsap, ScrollTrigger, useGSAP }
