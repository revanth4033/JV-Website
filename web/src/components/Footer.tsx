import Link from 'next/link'

import { route } from '@/content'
import type { SiteSettings } from '@/content/types'

export function Footer({ settings }: { settings: SiteSettings }) {
  const { footer } = settings
  return (
    <footer className="site-footer" data-cms-section="footer">
      <div className="foot-left">
        <span>{footer.locations}</span>
      </div>
      <div className="foot-right">
        {footer.links
          .filter((l) => l.href && l.href !== '#')
          .map((l) => (
          <Link
            key={l.label}
            href={route(l.href)}
            {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </footer>
  )
}
