import { notFound } from 'next/navigation'

import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { prisma } from '@/lib/prisma'
import { discardDraft, saveDraft, savePlatform, schedulePublish } from '../../content-actions'

export const dynamic = 'force-dynamic'

export default async function PlatformEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const row = await prisma.platform.findUnique({ where: { slug } })
  if (!row) notFound()
  const data = (row.draft ?? row.data) as Record<string, unknown>
  return (
    <AdminShell
      active="platforms"
      title={row.name}
      subtitle={`${row.sector} · /platform/${slug}`}
      actions={<PreviewLink href={`/platform/${slug}`} label="Open page" />}
      wide
    >
      <SectionForm
        schema="platform"
        defaultValues={data}
        action={savePlatform.bind(null, slug)}
        draftAction={saveDraft.bind(null, 'platform', slug)}
        scheduleAction={schedulePublish.bind(null, 'platform', slug)}
        discardAction={discardDraft.bind(null, 'platform', slug)}
        hasDraft={row.draft != null}
        publishAt={row.publishAt ? row.publishAt.toISOString() : null}
        preview={{ url: `/preview/platform/${slug}`, section: 'platform' }}
      />
    </AdminShell>
  )
}
