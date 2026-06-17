import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { getTeamPage } from '@/content'
import { prisma } from '@/lib/prisma'
import { saveTeam } from '../content-actions'

export const dynamic = 'force-dynamic'

export default async function TeamEditPage() {
  const row = await prisma.singleton.findUnique({ where: { key: 'teamPage' } })
  const data = (row?.data as Record<string, unknown>) ?? (getTeamPage() as unknown as Record<string, unknown>)
  return (
    <AdminShell
      active="team"
      title="Team Page"
      subtitle="Hero, co-founders, and the leadership roster."
      actions={<PreviewLink href="/team" label="Open page" />}
      wide
    >
      <SectionForm schema="team" defaultValues={data} action={saveTeam} preview={{ url: '/preview/team', section: 'team' }} />
    </AdminShell>
  )
}
