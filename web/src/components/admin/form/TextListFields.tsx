'use client'

import { Controller, useFormContext } from 'react-hook-form'

/** Animated title: a list of lines (one per row) + an emphasis marker. */
export function LinesField({ name, label, hint }: { name: string; label: string; hint?: string }) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const val = field.value || { lines: [], emphasis: '' }
        const lines: string[] = Array.isArray(val.lines) ? val.lines : []
        return (
          <div className="field">
            <label>{label}</label>
            {hint && <div className="hint">{hint}</div>}
            <textarea
              rows={Math.max(2, lines.length)}
              value={lines.join('\n')}
              onChange={(e) => field.onChange({ ...val, lines: e.target.value.split('\n') })}
            />
            <div className="hint" style={{ marginTop: '.45rem' }}>
              Emphasis (italic/red): type <code>all</code>, or <code>line:0</code> / <code>line:1</code> (0-based). Blank = none.
            </div>
            <input
              type="text"
              value={val.emphasis || ''}
              onChange={(e) => field.onChange({ ...val, emphasis: e.target.value })}
            />
          </div>
        )
      }}
    />
  )
}

/** A plain list of strings, edited one-per-row. */
export function StringListField({ name, label, hint }: { name: string; label: string; hint?: string }) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const arr: string[] = Array.isArray(field.value) ? field.value : []
        return (
          <div className="field">
            <label>{label}</label>
            {hint && <div className="hint">{hint}</div>}
            <textarea
              rows={Math.max(2, arr.length)}
              value={arr.join('\n')}
              onChange={(e) => field.onChange(e.target.value.split('\n'))}
            />
          </div>
        )
      }}
    />
  )
}
