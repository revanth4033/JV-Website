import { redirect } from 'next/navigation'

import { loadPlatforms } from '@/content/db'

export default async function PlatformIndex() {
  const platforms = await loadPlatforms()
  redirect(`/platform/${platforms[0]?.slug ?? 'powered'}`)
}
