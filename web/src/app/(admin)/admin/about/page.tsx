import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { getAboutPage } from '@/content'
import { prisma } from '@/lib/prisma'
import { discardDraft, saveAbout, saveDraft, schedulePublish } from '../content-actions'

export const dynamic = 'force-dynamic'

export default async function AboutEditPage() {
  const row = await prisma.singleton.findUnique({ where: { key: 'aboutPage' } })
  const data = (row?.draft ?? row?.data ?? getAboutPage()) as unknown as Record<string, unknown>
  return (
    <AdminShell
      active="about"
      title="About Page"
      subtitle="Hero, beliefs, method, four platforms, models, GRIDS."
      actions={<PreviewLink href="/about" label="Open page" />}
      wide
    >
      <SectionForm
        schema="about"
        defaultValues={data}
        action={saveAbout}
        draftAction={saveDraft.bind(null, 'singleton', 'aboutPage')}
        scheduleAction={schedulePublish.bind(null, 'singleton', 'aboutPage')}
        discardAction={discardDraft.bind(null, 'singleton', 'aboutPage')}
        hasDraft={row?.draft != null}
        publishAt={row?.publishAt ? row.publishAt.toISOString() : null}
        preview={{ url: '/preview/about', section: 'about' }}
      />
    </AdminShell>
  )
}
