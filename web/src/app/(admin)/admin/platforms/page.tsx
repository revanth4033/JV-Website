import Link from 'next/link'

import { AdminShell } from '@/components/admin/AdminShell'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function PlatformsListPage() {
  const plats = await prisma.platform.findMany({ orderBy: { order: 'asc' } })
  return (
    <AdminShell active="platforms" title="Platforms" subtitle="Choose a platform to edit its content.">
      <div className="cards">
        {plats.map((p) => (
          <Link key={p.slug} href={`/admin/platforms/${p.slug}`} className="card">
            <div className="card-t">{p.name}</div>
            <div className="card-d">{p.sector}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
