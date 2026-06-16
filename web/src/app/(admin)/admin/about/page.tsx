import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { prisma } from '@/lib/prisma'
import { saveAbout } from '../content-actions'

export const dynamic = 'force-dynamic'

export default async function AboutEditPage() {
  const row = await prisma.singleton.findUnique({ where: { key: 'aboutPage' } })
  const data = (row?.data as Record<string, unknown>) ?? {}
  return (
    <AdminShell
      active="about"
      title="About Page"
      subtitle="Hero, beliefs, method, models, ecosystem, GRIDS."
      actions={<PreviewLink href="/about" label="Open page" />}
      wide
    >
      <SectionForm
        schema="about"
        defaultValues={data}
        action={saveAbout}
        preview={{ url: '/preview/about', section: 'about' }}
      />
    </AdminShell>
  )
}
