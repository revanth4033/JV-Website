import { notFound } from 'next/navigation'

import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { prisma } from '@/lib/prisma'
import { savePlatform } from '../../content-actions'

export const dynamic = 'force-dynamic'

export default async function PlatformEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const row = await prisma.platform.findUnique({ where: { slug } })
  if (!row) notFound()
  const data = row.data as Record<string, unknown>
  const action = savePlatform.bind(null, slug)
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
        action={action}
        preview={{ url: `/preview/platform/${slug}`, section: 'platform' }}
      />
    </AdminShell>
  )
}
