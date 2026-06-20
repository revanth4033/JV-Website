import { NextResponse } from 'next/server'

import { runScheduledPublishes } from '@/lib/scheduled-publish'

export const dynamic = 'force-dynamic'

// Invoked by Vercel Cron (see vercel.json). When CRON_SECRET is set, Vercel sends
// it as a Bearer token; we reject anything else. If unset, the endpoint is open
// (set CRON_SECRET in the Vercel project to lock it down).
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const result = await runScheduledPublishes()
  return NextResponse.json({ ok: true, ...result })
}
