import { AdminShell } from '@/components/admin/AdminShell'
import { MediaManager } from '@/components/admin/MediaManager'
import { listMedia } from '../media-actions'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const media = await listMedia()
  return (
    <AdminShell active="media" title="Media" subtitle="Images and videos used across the site.">
      <MediaManager initial={media} />
    </AdminShell>
  )
}
