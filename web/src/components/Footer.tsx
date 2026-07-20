import Link from 'next/link'

import { route } from '@/content'
import type { SiteSettings } from '@/content/types'

export function Footer({ settings }: { settings: SiteSettings }) {
  const { footer } = settings
  const allLinks = footer.links ?? []

  // Split the flat CMS links list into the three footer regions:
  // the email (mailto:), the social link (external / LinkedIn), and the
  // internal page links that make up the top nav row.
  const emailLink = allLinks.find((l) => l.href?.startsWith('mailto:'))
  const socialLink = allLinks.find(
    (l) => l.external || /linkedin/i.test(l.href ?? ''),
  )
  const navLinks = allLinks.filter(
    (l) => l !== emailLink && l !== socialLink && l.label && l.href,
  )

  return (
    <footer className="site-footer" data-cms-section="footer">
      {navLinks.length > 0 && (
        <nav className="foot-nav">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={route(item.href)}
              {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="foot-meta">
        {socialLink && (
          <Link
            className="foot-social"
            href={socialLink.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={socialLink.label || 'LinkedIn'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
          </Link>
        )}

        {emailLink && (
          <Link className="foot-contact" href={emailLink.href}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
            <span>{emailLink.label}</span>
          </Link>
        )}

        {footer.locations && (
          <span className="foot-contact">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{footer.locations}</span>
          </span>
        )}
      </div>

      {footer.copyright && <p className="foot-copyright">{footer.copyright}</p>}
    </footer>
  )
}
