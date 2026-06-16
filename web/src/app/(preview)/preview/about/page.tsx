import { AboutPreview } from '@/components/preview/AboutPreview'
import { loadAboutPage, loadSiteSettings } from '@/content/db'

export const dynamic = 'force-dynamic'

export default async function PreviewAbout() {
  const [settings, about] = await Promise.all([loadSiteSettings(), loadAboutPage()])
  return <AboutPreview settings={settings} about={about} />
}
