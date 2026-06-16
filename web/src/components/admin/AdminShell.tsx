import Link from 'next/link'

import { logout } from '@/app/(admin)/admin/auth-actions'

const NAV = [
  { href: '/admin', label: 'Dashboard', key: 'dashboard' },
  { href: '/admin/site-settings', label: 'Site Settings', key: 'site-settings' },
  { href: '/admin/home', label: 'Home Page', key: 'home' },
  { href: '/admin/about', label: 'About Page', key: 'about' },
  { href: '/admin/platforms', label: 'Platforms', key: 'platforms' },
  { href: '/admin/media', label: 'Media', key: 'media' },
]

export function AdminShell({
  active,
  title,
  subtitle,
  actions,
  children,
  wide,
}: {
  active: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">JV Ventures CMS</div>
        <nav>
          {NAV.map((n) => (
            <Link key={n.key} href={n.href} className={active === n.key ? 'active' : ''}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          <Link href="/" target="_blank" style={{ color: '#cdd7ea' }}>
            View site ↗
          </Link>
          <form action={logout} style={{ marginTop: '.5rem' }}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <main className={`admin-main${wide ? ' wide' : ''}`}>
        <div className="admin-head">
          <div>
            <h1>{title}</h1>
            {subtitle && <div className="sub">{subtitle}</div>}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  )
}
