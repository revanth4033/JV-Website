import { ContactPreview } from '@/components/preview/ContactPreview'
import { loadContactPage, loadSiteSettings } from '@/content/db'

export const dynamic = 'force-dynamic'

export default async function PreviewContact() {
  const [settings, contact] = await Promise.all([loadSiteSettings(), loadContactPage()])
  return <ContactPreview settings={settings} contact={contact} />
}
