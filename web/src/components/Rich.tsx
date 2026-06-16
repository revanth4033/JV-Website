import type { ElementType } from 'react'

/**
 * Renders a small trusted rich string that may contain <em>/<strong>/<br>/&nbsp;
 * (carried over from the prototype copy). Content originates from the CMS/editors,
 * not anonymous users. In Phase 6 the lexical→HTML serializer feeds the same prop.
 */
export function Rich({
  html,
  as: Tag = 'span',
  className,
}: {
  html: string
  as?: ElementType
  className?: string
}) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
