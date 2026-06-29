// TEMPORARY one-time runtime seeder. Writes inventory.json content into the
// RUNTIME database (the one the live functions read) and revalidates the site.
// Build-time seeding hits a different Neon branch on this project, so this exists
// to seed the runtime DB directly. Token-guarded; REMOVE after use.
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { sanitizeContent } from '@/lib/sanitize'
import inventory from '@/content/inventory.json'

export const dynamic = 'force-dynamic'

function authed(req: Request): boolean {
  const expected = String(process.env.SEED_TOKEN ?? '').trim()
  if (!expected) return false
  const url = new URL(req.url)
  const got = (url.searchParams.get('token') ?? '').trim()
  return got.length > 0 && got === expected
}

async function currentState() {
  const powered = await prisma.platform.findUnique({ where: { slug: 'powered' } }).catch(() => null)
  const about = await prisma.singleton.findUnique({ where: { key: 'aboutPage' } }).catch(() => null)
  const poweredStr = JSON.stringify(powered?.data ?? {})
  const aboutStr = JSON.stringify(about?.data ?? {})
  return {
    poweredHasCappellaIn: poweredStr.includes('cappella.in'),
    aboutHasPlatformsSection: aboutStr.includes('platformsSection'),
  }
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const before = await currentState()
  if (url.searchParams.get('check') === '1') {
    return NextResponse.json({ ok: true, mode: 'check', state: before })
  }

  const inv = inventory as Record<string, unknown>
  const singletonKeys = ['siteSettings', 'homePage', 'aboutPage', 'teamPage', 'contactPage']
  let singletons = 0
  for (const key of singletonKeys) {
    const raw = inv[key]
    if (!raw) continue
    const data = sanitizeContent(raw) as object
    await prisma.singleton.upsert({
      where: { key },
      update: { data: data as never, draft: Prisma.DbNull, publishAt: null },
      create: { key, data: data as never },
    })
    singletons++
  }

  const platforms = Array.isArray(inv.platforms) ? (inv.platforms as Record<string, unknown>[]) : []
  let platformCount = 0
  for (const p of platforms) {
    const slug = String(p.slug)
    const data = sanitizeContent(p) as Record<string, unknown>
    await prisma.platform.upsert({
      where: { slug },
      update: {
        order: Number(p.order ?? 0),
        name: String(p.name ?? slug),
        sector: String(p.sector ?? ''),
        data: data as never,
        draft: Prisma.DbNull,
        publishAt: null,
      },
      create: {
        slug,
        order: Number(p.order ?? 0),
        name: String(p.name ?? slug),
        sector: String(p.sector ?? ''),
        data: data as never,
      },
    })
    platformCount++
  }

  revalidatePath('/', 'layout')
  revalidatePath('/sitemap.xml')

  const after = await currentState()
  return NextResponse.json({ ok: true, mode: 'seed', singletons, platforms: platformCount, before, after })
}
