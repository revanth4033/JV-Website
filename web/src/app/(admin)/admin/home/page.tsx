import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { getHomePage } from '@/content'
import { prisma } from '@/lib/prisma'
import { discardDraft, saveDraft, saveHome, schedulePublish } from '../content-actions'

export const dynamic = 'force-dynamic'

export default async function HomeEditPage() {
  const row = await prisma.singleton.findUnique({ where: { key: 'homePage' } })
  const data = (row?.draft ?? row?.data ?? getHomePage()) as unknown as Record<string, unknown>
  return (
    <AdminShell
      active="home"
      title="Home Page"
      subtitle="The four-slide presentation deck."
      actions={<PreviewLink href="/" label="Open page" />}
      wide
    >
      <SectionForm
        schema="home"
        defaultValues={data}
        action={saveHome}
        draftAction={saveDraft.bind(null, 'singleton', 'homePage')}
        scheduleAction={schedulePublish.bind(null, 'singleton', 'homePage')}
        discardAction={discardDraft.bind(null, 'singleton', 'homePage')}
        hasDraft={row?.draft != null}
        publishAt={row?.publishAt ? row.publishAt.toISOString() : null}
        preview={{ url: '/preview/home', section: 'home' }}
      />
    </AdminShell>
  )
}
