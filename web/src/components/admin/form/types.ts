export type FieldDef =
  | { type: 'text' | 'textarea' | 'number' | 'checkbox' | 'image'; name: string; label: string; hint?: string }
  | { type: 'lines'; name: string; label: string; hint?: string }
  | { type: 'stringList'; name: string; label: string; hint?: string }
  | { type: 'group'; name: string; label?: string; fields: FieldDef[] }
  | {
      type: 'array'
      name: string
      label: string
      itemTitleKey?: string // which child field to show in the item header
      fields: FieldDef[]
      newItem?: () => Record<string, unknown>
    }

export const join = (prefix: string, name: string) => (prefix ? `${prefix}.${name}` : name)
