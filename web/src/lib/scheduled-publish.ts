import 'server-only'

import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { prisma } from './prisma'

type Data = Record<string, unknown>

/** Promote any drafts whose scheduled publishAt has arrived. Called by the cron route. */
export async function runScheduledPublishes(): Promise<{ published: string[] }> {
  const now = new Date()
  const published: string[] = []

  for (const r of await prisma.singleton.findMany({ where: { publishAt: { lte: now } } })) {
    if (r.draft == null) {
      await prisma.singleton.update({ where: { key: r.key }, data: { publishAt: null } })
      continue
    }
    await prisma.singleton.update({
      where: { key: r.key },
      data: { data: r.draft as Prisma.InputJsonValue, draft: Prisma.DbNull, publishAt: null },
    })
    await prisma.revision.create({ data: { entity: r.key, label: r.key, userEmail: 'scheduler', data: r.draft as Prisma.InputJsonValue } }).catch(() => {})
    await prisma.auditLog.create({ data: { userEmail: 'scheduler', entity: r.key, label: r.key, action: 'publish' } }).catch(() => {})
    published.push(r.key)
  }

  for (const r of await prisma.platform.findMany({ where: { publishAt: { lte: now } } })) {
    if (r.draft == null) {
      await prisma.platform.update({ where: { id: r.id }, data: { publishAt: null } })
      continue
    }
    const d = r.draft as Data
    await prisma.platform.update({
      where: { id: r.id },
      data: {
        name: String(d.name ?? r.name),
        sector: String(d.sector ?? r.sector),
        order: Number(d.order ?? r.order),
        data: r.draft as Prisma.InputJsonValue,
        draft: Prisma.DbNull,
        publishAt: null,
      },
    })
    await prisma.revision.create({ data: { entity: `platform:${r.slug}`, label: r.name, userEmail: 'scheduler', data: r.draft as Prisma.InputJsonValue } }).catch(() => {})
    await prisma.auditLog.create({ data: { userEmail: 'scheduler', entity: `platform:${r.slug}`, label: r.name, action: 'publish' } }).catch(() => {})
    revalidatePath(`/platform/${r.slug}`)
    published.push(`platform:${r.slug}`)
  }

  if (published.length) {
    for (const p of ['/', '/about', '/team', '/contact', '/platform', '/sitemap.xml']) revalidatePath(p)
  }
  return { published }
}
