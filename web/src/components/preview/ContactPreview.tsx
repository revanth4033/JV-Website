'use client'

import { Contact } from '@/components/contact/Contact'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { ContactPage, SiteSettings } from '@/content/types'
import { usePreviewMessages } from './usePreviewMessages'

export function ContactPreview({ settings: s0, contact: c0 }: { settings: SiteSettings; contact: ContactPage }) {
  const { settings, data: contact } = usePreviewMessages(s0, 'contact', c0)
  return (
    <>
      <Header settings={settings} />
      <Contact contact={contact} settings={settings} />
      <Footer settings={settings} />
    </>
  )
}
