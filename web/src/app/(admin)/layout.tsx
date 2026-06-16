import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'JV Ventures CMS',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
