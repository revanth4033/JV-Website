import { HomePreview } from '@/components/preview/HomePreview'
import { loadHomePage, loadSiteSettings } from '@/content/db'

export const dynamic = 'force-dynamic'

export default async function PreviewHome() {
  const [settings, home] = await Promise.all([loadSiteSettings(), loadHomePage()])
  return <HomePreview settings={settings} home={home} />
}
