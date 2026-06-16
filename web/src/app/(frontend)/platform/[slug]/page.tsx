import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Platform } from '@/components/platform/Platform'
import { loadPlatform, loadPlatforms, loadSiteSettings } from '@/content/db'

export const revalidate = 30

export async function generateStaticParams() {
  const platforms = await loadPlatforms()
  return platforms.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = await loadPlatform(slug)
  if (!p) return {}
  return { title: p.name, description: p.tagline, alternates: { canonical: `/platform/${slug}` } }
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [platform, all, settings] = await Promise.all([
    loadPlatform(slug),
    loadPlatforms(),
    loadSiteSettings(),
  ])
  if (!platform) notFound()
  const others = all.filter((p) => p.slug !== slug)
  return <Platform platform={platform} others={others} settings={settings} />
}
