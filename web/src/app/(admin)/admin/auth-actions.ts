'use server'

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SESSION_COOKIE, signSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Durable brute-force throttle, backed by the database (works across serverless
// instances): after MAX_FAILS failures within WINDOW_MS, the email is locked out.
const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILS = 8
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  const rec = await prisma.loginAttempt.findUnique({ where: { key: email } }).catch(() => null)
  const within = rec ? Date.now() - rec.windowAt.getTime() < WINDOW_MS : false
  if (within && rec!.fails >= MAX_FAILS) {
    return { error: 'Too many attempts. Please wait a few minutes and try again.' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    // record the failure (reset the window if it has expired)
    if (within) {
      await prisma.loginAttempt.update({ where: { key: email }, data: { fails: { increment: 1 } } }).catch(() => {})
    } else {
      await prisma.loginAttempt
        .upsert({ where: { key: email }, create: { key: email, fails: 1, windowAt: new Date() }, update: { fails: 1, windowAt: new Date() } })
        .catch(() => {})
    }
    await sleep(400) // slow automated guessing
    return { error: 'Invalid email or password.' }
  }
  await prisma.loginAttempt.deleteMany({ where: { key: email } }).catch(() => {})
  const token = await signSession({ id: user.id, email: user.email, name: user.name, role: user.role })
  ;(await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect('/admin')
}

export async function logout() {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/admin/login')
}
