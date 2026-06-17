import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { getContactPage } from '@/content'
import { prisma } from '@/lib/prisma'
import { saveContact } from '../content-actions'

export const dynamic = 'force-dynamic'

export default async function ContactEditPage() {
  const row = await prisma.singleton.findUnique({ where: { key: 'contactPage' } })
  const data = (row?.data as Record<string, unknown>) ?? (getContactPage() as unknown as Record<string, unknown>)
  return (
    <AdminShell
      active="contact"
      title="Contact Page"
      subtitle="Hero, email, enquiry types, and offices."
      actions={<PreviewLink href="/contact" label="Open page" />}
      wide
    >
      <SectionForm schema="contact" defaultValues={data} action={saveContact} preview={{ url: '/preview/contact', section: 'contact' }} />
    </AdminShell>
  )
}
