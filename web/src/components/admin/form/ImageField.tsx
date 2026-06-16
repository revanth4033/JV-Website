'use client'

import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { MediaPicker } from './MediaPicker'

export function ImageField({ name, label, hint }: { name: string; label: string; hint?: string }) {
  const { control } = useFormContext()
  const [open, setOpen] = useState(false)
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="field">
          <label>{label}</label>
          {hint && <div className="hint">{hint}</div>}
          <div className="img-field">
            {field.value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="img-thumb" src={field.value} alt="" />
            ) : (
              <div className="img-thumb" />
            )}
            <div>
              <button type="button" className="btn" onClick={() => setOpen(true)}>
                Choose…
              </button>
              {field.value && (
                <button type="button" className="btn" style={{ marginLeft: '.4rem' }} onClick={() => field.onChange('')}>
                  Clear
                </button>
              )}
              <div className="img-meta">{field.value || 'No image selected'}</div>
            </div>
          </div>
          {open && <MediaPicker onPick={(url) => field.onChange(url)} onClose={() => setOpen(false)} />}
        </div>
      )}
    />
  )
}
