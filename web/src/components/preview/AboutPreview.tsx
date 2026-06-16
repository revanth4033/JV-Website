'use client'

import { About } from '@/components/about/About'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { AboutPage, SiteSettings } from '@/content/types'
import { usePreviewMessages } from './usePreviewMessages'

export function AboutPreview({ settings: s0, about: a0 }: { settings: SiteSettings; about: AboutPage }) {
  const { settings, data: about } = usePreviewMessages(s0, 'about', a0)
  return (
    <>
      <Header settings={settings} />
      <About about={about} settings={settings} />
      <Footer settings={settings} />
    </>
  )
}
