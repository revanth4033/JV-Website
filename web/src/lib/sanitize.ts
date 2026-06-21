import 'server-only'

import sanitizeHtml from 'sanitize-html'

// Server-side allowlist for the inline rich text the CMS produces. Defence in
// depth: the editor sanitizes client-side, but a tampered request could POST raw
// HTML straight to a server action — so we re-sanitize before persisting and the
// public site renders only these tags. <script>/<style>/event handlers/<a>/<img>
// etc. are stripped; <em class="soi"> (the brand mark) survives.
const RICH_CONFIG: sanitizeHtml.IOptions = {
  allowedTags: ['strong', 'em', 'b', 'i', 'br'],
  allowedAttributes: { em: ['class'] },
  allowedClasses: { em: ['soi'] },
  disallowedTagsMode: 'discard',
}

/** True when a string looks like it contains markup (so plain text is left untouched). */
const looksLikeHtml = (s: string) => /<[a-z!/]/i.test(s)

/**
 * Collapse accidental repeated currency symbols ("$$500M" → "$500M"). These slip
 * in when an editor types a "$" in front of a value that already carries one; a
 * run of the same currency mark is never intentional in this content.
 */
const normalizeCurrency = (s: string) => s.replace(/([$₹€£])\1+/g, '$1')

export function sanitizeRich(s: string): string {
  const cleaned = normalizeCurrency(s)
  return looksLikeHtml(cleaned) ? sanitizeHtml(cleaned, RICH_CONFIG) : cleaned
}

/**
 * Deep-clone `data`, sanitising every string that contains markup. Used on every
 * content save so no stored field can carry executable HTML to the public site.
 */
export function sanitizeContent<T>(data: T): T {
  if (typeof data === 'string') return sanitizeRich(data) as unknown as T
  if (Array.isArray(data)) return data.map((v) => sanitizeContent(v)) as unknown as T
  if (data && typeof data === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) out[k] = sanitizeContent(v)
    return out as T
  }
  return data
}
