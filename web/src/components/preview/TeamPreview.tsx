'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Team } from '@/components/team/Team'
import type { SiteSettings, TeamPage } from '@/content/types'
import { usePreviewMessages } from './usePreviewMessages'

export function TeamPreview({ settings: s0, team: t0 }: { settings: SiteSettings; team: TeamPage }) {
  const { settings, data: team } = usePreviewMessages(s0, 'team', t0)
  return (
    <>
      <Header settings={settings} />
      <Team team={team} settings={settings} />
      <Footer settings={settings} />
    </>
  )
}
