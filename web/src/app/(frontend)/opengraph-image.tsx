import { ImageResponse } from 'next/og'

export const alt = 'JV Ventures — Reimagining Investing'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded social share image, generated at build (no external asset needed).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #2769dd 0%, #133778 45%, #0c2758 100%)',
          color: '#f4f6fb',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', opacity: 0.78 }}>
          JV Ventures
        </div>
        <div style={{ fontSize: 88, fontWeight: 600, marginTop: 18, lineHeight: 1.04 }}>
          Reimagining Investing
        </div>
        <div style={{ fontSize: 30, marginTop: 28, opacity: 0.85, maxWidth: 880, lineHeight: 1.35 }}>
          A value-creation partner building institutional platforms across education, lifesciences,
          healthcare &amp; managed living.
        </div>
      </div>
    ),
    { ...size },
  )
}
