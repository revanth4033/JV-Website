'use server'

import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

type Data = Record<string, unknown>
const json = (d: Data) => d as Prisma.InputJsonValue
type Result = { ok: boolean; error?: string }

async function guard() {
  const s = await getSession()
  if (!s) throw new Error('Not authenticated')
}

async function revalidateSite() {
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/team')
  revalidatePath('/contact')
  const plats = await prisma.platform.findMany({ select: { slug: true } })
  for (const p of plats) revalidatePath(`/platform/${p.slug}`)
}

async function saveSingleton(key: string, data: Data): Promise<Result> {
  await guard()
  await prisma.singleton.upsert({ where: { key }, create: { key, data: json(data) }, update: { data: json(data) } })
  await revalidateSite()
  return { ok: true }
}

export async function saveSiteSettings(data: Data): Promise<Result> {
  return saveSingleton('siteSettings', data)
}
export async function saveHome(data: Data): Promise<Result> {
  return saveSingleton('homePage', data)
}
export async function saveAbout(data: Data): Promise<Result> {
  return saveSingleton('aboutPage', data)
}
export async function saveTeam(data: Data): Promise<Result> {
  return saveSingleton('teamPage', data)
}
export async function saveContact(data: Data): Promise<Result> {
  return saveSingleton('contactPage', data)
}

export async function savePlatform(slug: string, data: Data): Promise<Result> {
  await guard()
  await prisma.platform.update({
    where: { slug },
    data: {
      name: String(data.name ?? ''),
      sector: String(data.sector ?? ''),
      order: Number(data.order ?? 0),
      data: json(data),
    },
  })
  await revalidateSite()
  return { ok: true }
}
