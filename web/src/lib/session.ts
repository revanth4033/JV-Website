import { cookies } from 'next/headers'

import { SESSION_COOKIE, verifySession, type Session } from './auth'

/** Server-side: current logged-in user (or null). Do not import from middleware. */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return verifySession(token)
}
