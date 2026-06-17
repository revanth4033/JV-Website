import { TeamPreview } from '@/components/preview/TeamPreview'
import { loadSiteSettings, loadTeamPage } from '@/content/db'

export const dynamic = 'force-dynamic'

export default async function PreviewTeam() {
  const [settings, team] = await Promise.all([loadSiteSettings(), loadTeamPage()])
  return <TeamPreview settings={settings} team={team} />
}
