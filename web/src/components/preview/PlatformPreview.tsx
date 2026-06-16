'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Platform } from '@/components/platform/Platform'
import type { Platform as PlatformT, SiteSettings } from '@/content/types'
import { usePreviewMessages } from './usePreviewMessages'

export function PlatformPreview({
  settings: s0,
  platform: p0,
  others,
}: {
  settings: SiteSettings
  platform: PlatformT
  others: PlatformT[]
}) {
  const { settings, data: platform } = usePreviewMessages(s0, 'platform', p0)
  return (
    <>
      <Header settings={settings} />
      <Platform platform={platform} others={others} settings={settings} />
      <Footer settings={settings} />
    </>
  )
}
