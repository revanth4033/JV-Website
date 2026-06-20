import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { getTeamPage } from '@/content'
import { prisma } from '@/lib/prisma'
import { discardDraft, saveDraft, saveTeam, schedulePublish } from '../content-actions'

export const dynamic = 'force-dynamic'

export default async function TeamEditPage() {
  const row = await prisma.singleton.findUnique({ where: { key: 'teamPage' } })
  const data = (row?.draft ?? row?.data ?? getTeamPage()) as unknown as Record<string, unknown>
  return (
    <AdminShell
      active="team"
      title="Team Page"
      subtitle="Hero, co-founders, and the leadership roster."
      actions={<PreviewLink href="/team" label="Open page" />}
      wide
    >
      <SectionForm
        schema="team"
        defaultValues={data}
        action={saveTeam}
        draftAction={saveDraft.bind(null, 'singleton', 'teamPage')}
        scheduleAction={schedulePublish.bind(null, 'singleton', 'teamPage')}
        discardAction={discardDraft.bind(null, 'singleton', 'teamPage')}
        hasDraft={row?.draft != null}
        publishAt={row?.publishAt ? row.publishAt.toISOString() : null}
        preview={{ url: '/preview/team', section: 'team' }}
      />
    </AdminShell>
  )
}
