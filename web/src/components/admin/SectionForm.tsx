'use client'

import dynamic from 'next/dynamic'

import { aboutSchema, contactSchema, homeSchema, platformSchema, siteSettingsSchema, teamSchema } from './schemas'

// Render the RHF form client-only — avoids SSR/hydration churn for a form whose
// state is entirely client-driven anyway (it's a logged-in admin tool).
const EntityForm = dynamic(() => import('./form/Form').then((m) => m.EntityForm), {
  ssr: false,
  loading: () => <p className="hint">Loading editor…</p>,
})

const SCHEMAS = {
  siteSettings: siteSettingsSchema,
  home: homeSchema,
  about: aboutSchema,
  platform: platformSchema,
  team: teamSchema,
  contact: contactSchema,
}

// Client wrapper: the schema (which contains factory functions) lives entirely in
// the client bundle, so server pages only pass serializable data + a server action.
export function SectionForm({
  schema,
  defaultValues,
  action,
  preview,
}: {
  schema: keyof typeof SCHEMAS
  defaultValues: Record<string, unknown>
  action: (data: Record<string, unknown>) => Promise<{ ok: boolean; error?: string }>
  preview?: { url: string; section: string }
}) {
  return <EntityForm defs={SCHEMAS[schema]} defaultValues={defaultValues} action={action} preview={preview} />
}
