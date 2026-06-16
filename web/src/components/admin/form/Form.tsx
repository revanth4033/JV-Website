'use client'

import { useEffect, useRef, useState } from 'react'
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'

import { ImageField } from './ImageField'
import { PreviewFrame, type PreviewHandle } from './PreviewFrame'
import { LinesField, StringListField } from './TextListFields'
import { join, type FieldDef } from './types'

type SaveResult = { ok: boolean; error?: string }

export function EntityForm({
  defs,
  defaultValues,
  action,
  saveLabel = 'Save & publish',
  preview,
}: {
  defs: FieldDef[]
  defaultValues: Record<string, unknown>
  action: (data: Record<string, unknown>) => Promise<SaveResult>
  saveLabel?: string
  preview?: { url: string; section: string }
}) {
  const methods = useForm({ defaultValues })
  const [state, setState] = useState<{ saving?: boolean; ok?: boolean; error?: string }>({})
  const [showPreview, setShowPreview] = useState(true)
  const frameRef = useRef<PreviewHandle>(null)

  // push live form values to the preview iframe as the user types (debounced)
  useEffect(() => {
    if (!preview) return
    let t: ReturnType<typeof setTimeout>
    frameRef.current?.post(preview.section, methods.getValues())
    const sub = methods.watch((values) => {
      clearTimeout(t)
      t = setTimeout(() => frameRef.current?.post(preview.section, values), 120)
    })
    return () => {
      clearTimeout(t)
      sub.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, showPreview])

  const onSubmit = methods.handleSubmit(async (data) => {
    setState({ saving: true })
    try {
      const res = await action(data)
      setState(res.ok ? { ok: true } : { error: res.error || 'Could not save.' })
    } catch (e) {
      setState({ error: e instanceof Error ? e.message : 'Could not save.' })
    }
  })

  const split = preview && showPreview

  return (
    <FormProvider {...methods}>
      <div className={split ? 'editor-split' : ''}>
        <div className="editor-form">
          <form onSubmit={onSubmit}>
            <Fields fields={defs} prefix="" />
            <div className="savebar">
              <button className="btn btn-primary" type="submit" disabled={state.saving}>
                {state.saving ? 'Saving…' : saveLabel}
              </button>
              {preview && (
                <button type="button" className="btn" onClick={() => setShowPreview((v) => !v)}>
                  {showPreview ? 'Hide preview' : 'Show preview'}
                </button>
              )}
              {state.ok && <span className="saved-msg">Saved ✓ — live within 30s</span>}
              {state.error && <span className="err-msg">{state.error}</span>}
            </div>
          </form>
        </div>
        {split && (
          <div className="editor-preview-col">
            <div className="editor-preview-bar">
              <span>Live preview — updates as you type (not saved until you publish)</span>
              <span className="preview-toggle">
                <button
                  type="button"
                  className="btn"
                  style={{ padding: '.3rem .6rem', fontSize: '.75rem' }}
                  onClick={() => frameRef.current?.reload()}
                  title="Rebuild the preview — use after adding/removing/reordering items"
                >
                  ↻ Refresh
                </button>
                <a href={preview!.url} target="_blank" rel="noopener noreferrer">Open ↗</a>
              </span>
            </div>
            <PreviewFrame ref={frameRef} url={preview!.url} />
          </div>
        )}
      </div>
    </FormProvider>
  )
}

function Fields({ fields, prefix }: { fields: FieldDef[]; prefix: string }) {
  return (
    <>
      {fields.map((f) => (
        <FieldView key={f.name} field={f} prefix={prefix} />
      ))}
    </>
  )
}

function FieldView({ field, prefix }: { field: FieldDef; prefix: string }) {
  const { register } = useFormContext()
  const path = join(prefix, field.name)

  switch (field.type) {
    case 'group':
      return (
        <div className="panel">
          {field.label && <div className="panel-t">{field.label}</div>}
          <Fields fields={field.fields} prefix={path} />
        </div>
      )
    case 'array':
      return <ArrayField field={field} prefix={prefix} />
    case 'image':
      return <ImageField name={path} label={field.label} hint={field.hint} />
    case 'lines':
      return <LinesField name={path} label={field.label} hint={field.hint} />
    case 'stringList':
      return <StringListField name={path} label={field.label} hint={field.hint} />
    case 'textarea':
      return (
        <div className="field">
          <label>{field.label}</label>
          {field.hint && <div className="hint">{field.hint}</div>}
          <textarea {...register(path)} />
        </div>
      )
    case 'checkbox':
      return (
        <div className="field check">
          <input type="checkbox" id={path} {...register(path)} />
          <label htmlFor={path} style={{ marginBottom: 0 }}>{field.label}</label>
        </div>
      )
    case 'number':
      return (
        <div className="field">
          <label>{field.label}</label>
          {field.hint && <div className="hint">{field.hint}</div>}
          <input type="number" {...register(path, { valueAsNumber: true })} />
        </div>
      )
    default:
      return (
        <div className="field">
          <label>{field.label}</label>
          {field.hint && <div className="hint">{field.hint}</div>}
          <input type="text" {...register(path)} />
        </div>
      )
  }
}

function ArrayField({ field, prefix }: { field: Extract<FieldDef, { type: 'array' }>; prefix: string }) {
  const { control, watch } = useFormContext()
  const path = join(prefix, field.name)
  const { fields, append, remove } = useFieldArray({ control, name: path })

  return (
    <div className="arr">
      <div className="arr-t">{field.label}</div>
      {fields.map((item, i) => {
        const head = field.itemTitleKey ? String(watch(`${path}.${i}.${field.itemTitleKey}`) || '') : ''
        return (
          <div className="arr-item" key={item.id}>
            <button type="button" className="arr-rm" onClick={() => remove(i)}>
              Remove
            </button>
            {head && <div className="arr-t" style={{ marginBottom: '.6rem' }}>{head}</div>}
            <Fields fields={field.fields} prefix={`${path}.${i}`} />
          </div>
        )
      })}
      <button type="button" className="btn btn-add" onClick={() => append((field.newItem?.() ?? {}) as never)}>
        + Add {field.label.replace(/s$/, '')}
      </button>
    </div>
  )
}
