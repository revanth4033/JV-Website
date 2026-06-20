import { AdminShell } from '@/components/admin/AdminShell'
import { PreviewLink } from '@/components/admin/PreviewLink'
import { SectionForm } from '@/components/admin/SectionForm'
import { getSiteSettings } from '@/content'
import { prisma } from '@/lib/prisma'
import { discardDraft, saveDraft, saveSiteSettings, schedulePublish } from '../content-actions'

export const dynamic = 'force-dynamic'

export default async function SiteSettingsPage() {
  const row = await prisma.singleton.findUnique({ where: { key: 'siteSettings' } })
  const data = (row?.draft ?? row?.data ?? getSiteSettings()) as unknown as Record<string, unknown>
  return (
    <AdminShell
      active="site-settings"
      title="Site Settings"
      subtitle="Header, footer, and the closing quote."
      actions={<PreviewLink href="/" label="Open site" />}
      wide
    >
      <SectionForm
        schema="siteSettings"
        defaultValues={data}
        action={saveSiteSettings}
        draftAction={saveDraft.bind(null, 'singleton', 'siteSettings')}
        scheduleAction={schedulePublish.bind(null, 'singleton', 'siteSettings')}
        discardAction={discardDraft.bind(null, 'singleton', 'siteSettings')}
        hasDraft={row?.draft != null}
        publishAt={row?.publishAt ? row.publishAt.toISOString() : null}
        preview={{ url: '/preview/home', section: 'siteSettings' }}
      />
    </AdminShell>
  )
}
