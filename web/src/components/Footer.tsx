import Link from 'next/link'

import { route } from '@/content'
import type { SiteSettings } from '@/content/types'

export function Footer({ settings }: { settings: SiteSettings }) {
  const { footer, nav } = settings
  return (
    <footer className="site-footer" data-cms-section="footer">
      {/* same links as the top nav */}
      <div className="foot-left">
        {nav
          .filter((item) => item.dropdown?.length || (item.href && item.href !== '#'))
          .map((item) => (
            <Link
              key={item.label}
              href={route(item.href)}
              {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              {item.label}
            </Link>
          ))}
      </div>
      <div className="foot-right">
        <span>{footer.locations}</span>
      </div>
    </footer>
  )
}
