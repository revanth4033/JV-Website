import { PageSkeleton } from '@/components/admin/PageSkeleton'

// Platform editors are a grandchild route, so they need their own loading
// boundary — the /admin one only covers direct children.
export default function PlatformEditLoading() {
  return <PageSkeleton />
}
