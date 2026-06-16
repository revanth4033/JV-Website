'use client'

import { useEffect, useState } from 'react'

import type { SiteSettings } from '@/content/types'

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
      if (m.section === 'siteSettings') setSettings(m.data)
      else if (m.section === section) setData(m.data)
    }
    window.addEventListener('message', onMsg)
    window.parent?.postMessage({ source: 'jv-preview', ready: true }, window.location.origin)
    return () => window.removeEventListener('message', onMsg)
  }, [section])

  return { settings, data }
}
