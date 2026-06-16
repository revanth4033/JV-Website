import Link from 'next/link'

import { AdminShell } from '@/components/admin/AdminShell'
import { getSession } from '@/lib/session'

const SECTIONS = [
  { href: '/admin/site-settings', t: 'Site Settings', d: 'Logo, navigation, footer, and the closing quote shown on every page.' },
  { href: '/admin/home', t: 'Home Page', d: 'The four-slide deck: Investing, Impact, Ecosystems, Platforms.' },
  { href: '/admin/about', t: 'About Page', d: 'Hero, beliefs, method, models, ecosystem, and GRIDS.' },
  { href: '/admin/platforms', t: 'Platforms', d: 'PowerEd, PoweRx, PowerCare, PowerPod — ventures, totals, metrics.' },
  { href: '/admin/media', t: 'Media', d: 'Upload and manage all images and videos.' },
]

export default async function Dashboard() {
  const session = await getSession()
  return (
    <AdminShell active="dashboard" title="Dashboard" subtitle={`Signed in as ${session?.email ?? ''}`}>
      <div className="cards">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="card">
            <div className="card-t">{s.t}</div>
            <div className="card-d">{s.d}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
