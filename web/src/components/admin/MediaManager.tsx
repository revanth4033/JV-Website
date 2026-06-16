'use client'

import { useRef, useState, useTransition } from 'react'

import { deleteMedia, uploadMedia, type MediaItem } from '@/app/(admin)/admin/media-actions'

export function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial)
  const [busy, startBusy] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const onUpload = (files: FileList | null) => {
    if (!files?.length) return
    startBusy(async () => {
      const added: MediaItem[] = []
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.set('file', file)
        added.push(await uploadMedia(fd))
      }
      setItems((prev) => [...added, ...prev])
      if (fileRef.current) fileRef.current.value = ''
    })
  }

  const onDelete = (id: number) => {
    if (!confirm('Delete this media item?')) return
    startBusy(async () => {
      await deleteMedia(id)
      setItems((prev) => prev.filter((m) => m.id !== id))
    })
  }

  return (
    <div>
      <div className="panel">
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          {busy ? 'Uploading…' : 'Upload images / videos'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4"
            multiple
            hidden
            onChange={(e) => onUpload(e.target.files)}
            disabled={busy}
          />
        </label>
        <span className="hint" style={{ marginLeft: '1rem' }}>
          {items.length} items in the library
        </span>
      </div>

      <div className="media-grid">
        {items.map((m) => (
          <div className="media-cell" key={m.id}>
            {m.mime.startsWith('video') ? (
              <video className="mc-img" src={m.url} muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="mc-img" src={m.url} alt={m.alt} />
            )}
            <div className="mc-meta">
              {m.filename}
              <br />
              <button
                className="arr-rm"
                style={{ position: 'static', marginTop: '.3rem' }}
                onClick={() => onDelete(m.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
