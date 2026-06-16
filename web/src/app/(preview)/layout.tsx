import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import '../(frontend)/styles.css'

import { SmoothScroll } from '@/components/SmoothScroll'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Live-preview chrome: same fonts/CSS/smooth-scroll as the real site, but Header
// and Footer live inside each preview page so they can update from postMessage.
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
