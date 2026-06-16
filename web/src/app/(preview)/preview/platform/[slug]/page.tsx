import { notFound } from 'next/navigation'

import { PlatformPreview } from '@/components/preview/PlatformPreview'
import { loadPlatform, loadPlatforms, loadSiteSettings } from '@/content/db'

export const dynamic = 'force-dynamic'

export default async function PreviewPlatform({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, platform, all] = await Promise.all([
    loadSiteSettings(),
    loadPlatform(slug),
    loadPlatforms(),
  ])
  if (!platform) notFound()
  const others = all.filter((p) => p.slug !== slug)
  return <PlatformPreview settings={settings} platform={platform} others={others} />
}
