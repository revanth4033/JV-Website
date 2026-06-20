'use client'

import { useEffect, useState } from 'react'

import type { SiteSettings } from '@/content/types'

/** Bring the section the editor is on into view. Home's horizontal deck is driven
 *  via a custom event (goTo); every other page scrolls a [data-cms-section] anchor. */
function scrollToSection(id: string) {
  const run = () => {
    const slide = /^deck\.slides\.(\d+)$/.exec(id)
    if (slide) {
      window.dispatchEvent(new CustomEvent('jv:goto-slide', { detail: { index: Number(slide[1]) } }))
      return
    }
    if (id === 'deck') {
      window.dispatchEvent(new CustomEvent('jv:goto-slide', { detail: { index: 0 } }))
      return
    }
    const el = document.querySelector(`[data-cms-section="${id}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  // let any just-applied content render first
  setTimeout(run, 90)
}

/**
 * Live-preview channel. Holds the page's section data + site settings, updating
 * from postMessage sent by the admin editor as the user types. On mount it tells
 * the parent it's ready so the editor can push the current values immediately.
 */
export function usePreviewMessages<T>(initialSettings: SiteSettings, section: string, initialData: T) {
  const [settings, setSettings] = useState(initialSettings)
  const [data, setData] = useState(initialData)

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      const m = e.data
      if (!m || m.source !== 'jv-admin') return
      if (m.scrollTo) {
        scrollToSection(String(m.scrollTo))
        return
      }
      if (m.section === 'siteSettings') setSettings(m.data)
      else if (m.section === section) setData(m.data)
    }
    window.addEventListener('message', onMsg)
    window.parent?.postMessage({ source: 'jv-preview', ready: true }, window.location.origin)
    return () => window.removeEventListener('message', onMsg)
  }, [section])

  return { settings, data }
}
