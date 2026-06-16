import type { Metadata } from 'next'

import { About } from '@/components/about/About'
import { loadAboutPage, loadSiteSettings } from '@/content/db'

export const revalidate = 30

export const metadata: Metadata = {
  title: 'About',
  description:
    'Founded in 2015, JV Ventures is a value-creation partner with a $550M portfolio, pioneering institutional models across lifesciences, education, healthcare, and managed living.',
  alternates: { canonical: '/about' },
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([loadAboutPage(), loadSiteSettings()])
  return <About about={about} settings={settings} />
}
