'use server'

import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

async function requireUser() {
  const s = await getSession()
  if (!s) throw new Error('Not authenticated')
  return s
}

export type MediaItem = { id: number; url: string; alt: string; filename: string; mime: string }

export async function uploadMedia(formData: FormData): Promise<MediaItem> {
  await requireUser()
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) throw new Error('No file provided')

  const safe = file.name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, '-').replace(/-+/g, '-')
  const filename = `${Date.now()}-${safe}`
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const buf = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buf)

  let width: number | undefined
  let height: number | undefined
  if (file.type.startsWith('image/')) {
    try {
      const meta = await sharp(buf).metadata()
      width = meta.width
      height = meta.height
    } catch {
      /* non-fatal */
    }
  }

  const url = `/uploads/${filename}`
  const media = await prisma.media.create({
    data: { url, filename, alt: formData.get('alt')?.toString() || file.name, mime: file.type, width, height },
  })
  return { id: media.id, url: media.url, alt: media.alt, filename: media.filename, mime: media.mime }
}

export async function deleteMedia(id: number): Promise<void> {
  await requireUser()
  const m = await prisma.media.findUnique({ where: { id } })
  if (!m) return
  // only remove the physical file for admin uploads (never the bundled /assets)
  if (m.url.startsWith('/uploads/')) {
    await fs.rm(path.join(process.cwd(), 'public', m.url), { force: true }).catch(() => {})
  }
  await prisma.media.delete({ where: { id } })
}

export async function listMedia(): Promise<MediaItem[]> {
  const rows = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map((m) => ({ id: m.id, url: m.url, alt: m.alt, filename: m.filename, mime: m.mime }))
}
