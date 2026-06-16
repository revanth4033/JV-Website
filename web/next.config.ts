import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: '/assets/**' }, // seeded prototype assets
      { pathname: '/uploads/**' }, // admin-uploaded media
      { pathname: '/favicon.png' },
    ],
  },
  // Redirect the old prototype URLs to the new routes (preserve inbound links).
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      {
        source: '/platform.html',
        has: [{ type: 'query', key: 'p', value: '(?<p>[^&]+)' }],
        destination: '/platform/:p',
        permanent: true,
      },
      { source: '/platform.html', destination: '/platform', permanent: true },
    ]
  },
}

export default nextConfig
