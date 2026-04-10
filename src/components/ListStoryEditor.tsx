'use client'

import { useState, useRef, useCallback } from 'react'

const GOLD   = '#C9A96E'
const GOLDD  = '#A8854A'
const CREAM  = '#F9F5F0'
const DARK   = '#1A1A1A'
const MUTED  = '#9A9A9A'
const SF     = "Georgia,'Times New Roman',serif"
const SS     = "'Helvetica Neue',Helvetica,Arial,sans-serif"

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

interface Fields {
  ref: string
  location: string
  title1: string
  title2: string
  price: string
  beds: string
  baths: string
  area: string
  soldText: string
  footer1: string
  footer2: string
}

interface EditableTextProps {
  field: string
  editing: string | null
  tempVal: string
  fields: Fields
  style: React.CSSProperties
  onStartEdit: (key: string) => void
  onCommit: () => void
  onTempChange: (v: string) => void
}

function EditableText({ field, editing, tempVal, fields, style, onStartEdit, onCommit, onTempChange }: EditableTextProps) {
  if (editing === field) {
    return (
      <input
        autoFocus
        value={tempVal}
        onChange={e => onTempChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={e => e.key === 'Enter' && onCommit()}
        style={{
          ...style, background: 'rgba(201,169,110,0.13)',
          border: '1.5px solid #C9A96E', borderRadius: 2,
          outline: 'none', padding: '1px 5px', width: '100%', boxSizing: 'border-box',
        }}
      />
    )
  }
  return (
    <span
      onClick={() => onStartEdit(field)}
      title="Klicka för att redigera"
      style={{ ...style, cursor: 'text', display: 'inline-block', minWidth: 16 }}
    >
      {fields[field as keyof Fields]}
    </span>
  )
}

const ICON_DEFS = [
  { field: 'beds',  label: 'Beds',  svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V19M21 9V19M3 13H21M3 9C3 9 5 7 9 7H15C19 7 21 9 21 9"></path><rect x="7" y="9" width="4" height="4" rx="0.5"></rect><rect x="13" y="9" width="4" height="4" rx="0.5"></rect></svg> },
  { field: 'baths', label: 'Baths', svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12H20V15C20 17.2 18.2 19 16 19H8C5.8 19 4 17.2 4 15V12Z"></path><path d="M4 12V8C4 6.9 4.9 6 6 6C7.1 6 8 6.9 8 8V9"></path><line x1="4" y1="12" x2="20" y2="12"></line></svg> },
  { field: 'area',  label: 'Area',  svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"></rect><path d="M3 9H21M9 3V21"></path></svg> },
]

export default function ListStoryEditor() {
  const [fields, setFields] = useState<Fields>({
    ref:      '58272',
    location: 'PUNTA PRIMA · SPAIN',
    title1:   'Modern',
    title2:   'Bungalow',
    price:    '229.500 €',
    beds:     '2',
    baths:    '2',
    area:     '67 m²',
    soldText: 'SOLD',
    footer1:  'Contact us',
    footer2:  'Exclusive Living',
  })

  const [photo, setPhoto] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [tempVal, setTempVal] = useState('')
  const [password, setPassword] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [authError, setAuthError] = useState('')
  const photoRef = useRef<HTMLInputElement>(null)

  const startEdit = (key: string) => { setEditing(key); setTempVal(fields[key as keyof Fields]) }
  const commitEdit = () => { if (editing) setFields(f => ({ ...f, [editing]: tempVal })); setEditing(null) }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const downloadStory = useCallback(async () => {
    setAuthError('')
    setDownloading(true)
    try {
      const W = 1080, H = 1920
      const canvas = document.createElement('canvas')
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d')!

      const loadImg = (src: string | null): Promise<HTMLImageElement | null> => new Promise(res => {
        if (!src) { res(null); return }
        const img = new Image()
        img.onload = () => res(img)
        img.onerror = () => res(null)
        img.src = src
      })

      const bg = await loadImg(photo)

      ctx.fillStyle = DARK
      ctx.fillRect(0, 0, W, H)

      if (bg) {
        const s = Math.max(W / bg.width, H / bg.height)
        const sw = bg.width * s, sh = bg.height * s
        ctx.save()
        ctx.drawImage(bg, (W - sw) / 2, (H - sh) / 2, sw, sh)
        ctx.restore()
      }

      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0,    'rgba(26,26,26,0.75)')
      grad.addColorStop(0.40, 'rgba(26,26,26,0.55)')
      grad.addColorStop(0.70, 'rgba(26,26,26,0.80)')
      grad.addColorStop(1,    'rgba(26,26,26,0.95)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Watermark SOLD text
      ctx.font = `900 320px ${SF}`
      ctx.fillStyle = GOLD
      ctx.globalAlpha = 0.15
      ctx.textAlign = 'center'
      ctx.fillText(fields.soldText, W / 2, H / 2 + 110)
      ctx.globalAlpha = 1

      // Gold dividers
      ctx.fillStyle = GOLD
      ctx.fillRect(66, 660, W - 132, 2)
      ctx.fillRect(66, 1260, W - 132, 2)

      // REF badge
      ctx.fillStyle = 'rgba(249,245,240,0.10)'
      roundRect(ctx, 52, 52, 240, 64, 4); ctx.fill()
      ctx.font = `500 26px ${SS}`
      ctx.fillStyle = 'rgba(249,245,240,0.80)'
      ctx.textAlign = 'left'
      ctx.fillText(`REF  ${fields.ref}`, 78, 93)

      // Large SOLD
      ctx.font = `900 180px ${SF}`
      ctx.fillStyle = GOLD
      ctx.textAlign = 'center'
      ctx.fillText(fields.soldText, W / 2, H / 2 - 60)

      // Location
      let y = 730
      ctx.beginPath(); ctx.arc(66 + 9, y + 12, 9, 0, Math.PI * 2)
      ctx.fillStyle = GOLD; ctx.fill()
      ctx.font = `500 28px ${SS}`
      ctx.fillStyle = GOLD
      ctx.textAlign = 'left'
      ctx.fillText(fields.location.toUpperCase(), 66 + 26, y + 18)
      y += 70

      ctx.font = `300 130px ${SF}`
      ctx.fillStyle = CREAM
      ctx.fillText(fields.title1, 66, y + 110)
      y += 140

      ctx.font = `300 italic 120px ${SF}`
      ctx.fillStyle = 'rgba(201,169,110,0.85)'
      ctx.fillText(fields.title2, 66, y + 100)

      y = 1310
      ctx.font = `400 26px ${SS}`
      ctx.fillStyle = MUTED
      ctx.fillText('SOLD FOR', 66, y)
      y += 52

      ctx.font = `600 96px ${SF}`
      ctx.fillStyle = CREAM
      ctx.fillText(fields.price, 66, y + 80)
      y += 120

      const bx = 66, bw = W - 132, bh = 170
      ctx.fillStyle = 'rgba(249,245,240,0.08)'
      roundRect(ctx, bx, y, bw, bh, 8); ctx.fill()
      ctx.strokeStyle = 'rgba(201,169,110,0.30)'; ctx.lineWidth = 1.5
      roundRect(ctx, bx, y, bw, bh, 8); ctx.stroke()

      const cw = bw / 3
      for (let i = 1; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(bx + cw * i, y + 24)
        ctx.lineTo(bx + cw * i, y + bh - 24)
        ctx.strokeStyle = 'rgba(201,169,110,0.25)'; ctx.lineWidth = 1.5
        ctx.stroke()
      }

      ;([
        [fields.beds,  'BEDS'],
        [fields.baths, 'BATHS'],
        [fields.area,  'AREA'],
      ] as [string, string][]).forEach(([val, label], i) => {
        const cx = bx + cw * i + cw / 2
        ctx.font = `bold 62px ${SF}`; ctx.fillStyle = GOLD; ctx.textAlign = 'center'
        ctx.fillText(val, cx, y + 102)
        ctx.font = `300 22px ${SS}`; ctx.fillStyle = MUTED
        ctx.fillText(label, cx, y + 142)
      })
      ctx.textAlign = 'left'

      const fy = H - 100
      ctx.font = `500 28px ${SS}`; ctx.fillStyle = CREAM
      ctx.fillText(fields.footer1, 66, fy)
      const f1w = ctx.measureText(fields.footer1).width

      ctx.font = `italic 34px ${SF}`; ctx.fillStyle = GOLD
      ctx.textAlign = 'right'
      ctx.fillText(fields.footer2, W - 66, fy)
      const f2w = ctx.measureText(fields.footer2).width
      ctx.textAlign = 'left'

      ctx.fillStyle = GOLD
      ctx.fillRect(66 + f1w + 28, fy - 9, (W - 132) - f1w - f2w - 56, 1)

      const imageData = canvas.toDataURL('image/png')
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, imageData, filename: `list_ref${fields.ref}.png` }),
      })

      if (!res.ok) {
        const err = await res.json()
        setAuthError(err.error ?? 'Fel vid nedladdning')
        setDownloading(false)
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `list_ref${fields.ref}.png`
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)
      setDownloading(false)

    } catch (err: unknown) {
      console.error(err)
      setAuthError('Fel vid generering: ' + (err instanceof Error ? err.message : String(err)))
      setDownloading(false)
    }
  }, [fields, photo, password])

  return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 12px', fontFamily: SS }}>

      <div style={{ marginBottom: 14, textAlign: 'center' }}>
        <div style={{ color: GOLD, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>List Story Editor</div>
        <div style={{ color: '#555', fontSize: 10, letterSpacing: 2 }}>✏️ Klicka på text · 📷 Klicka på bilden för att byta</div>
      </div>

      {/* PREVIEW CARD */}
      <div style={{ width: 340, background: DARK, borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 70px rgba(0,0,0,0.8)', flexShrink: 0, position: 'relative' }}>

        {/* Full-bleed background photo */}
        <div
          onClick={() => photoRef.current?.click()}
          style={{ position: 'absolute', inset: 0, background: photo ? `url(${photo}) center/cover` : '#1e1e1e', cursor: 'pointer', zIndex: 0 }}
        >
          {!photo && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, color: '#444' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M9 6l1.5-3h3L15 6"/></svg>
              <span style={{ fontSize: 9, letterSpacing: 3 }}>KLICKA FÖR FOTO</span>
            </div>
          )}
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />

        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,26,26,0.70) 0%, rgba(26,26,26,0.50) 40%, rgba(26,26,26,0.75) 70%, rgba(26,26,26,0.95) 100%)', zIndex: 1 }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: 604 }}>

          {/* REF badge */}
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(249,245,240,0.10)', padding: '4px 10px', borderRadius: 2 }}>
            <span style={{ fontSize: 8, color: 'rgba(249,245,240,0.75)', letterSpacing: 2 }}>REF </span>
            <EditableText field="ref" editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 9, color: 'rgba(249,245,240,0.80)', letterSpacing: 2 }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} />
          </div>

          {/* Big SOLD */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0 20px' }}>
            <EditableText field="soldText" editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 68, fontFamily: SF, fontWeight: 900, color: GOLD, letterSpacing: 8, textTransform: 'uppercase' }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} />
          </div>

          {/* Gold divider */}
          <div style={{ height: 1, background: GOLD, margin: '0 18px', opacity: 0.5 }} />

          {/* Property info */}
          <div style={{ padding: '12px 18px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, background: GOLD, borderRadius: '50%', flexShrink: 0 }} />
              <EditableText field="location" editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 8, color: GOLD, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500 }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} />
            </div>
            <div style={{ lineHeight: 1.05 }}>
              <div><EditableText field="title1" editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 28, color: CREAM, fontFamily: SF, fontWeight: 300 }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} /></div>
              <div><EditableText field="title2" editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 28, color: 'rgba(201,169,110,0.85)', fontFamily: SF, fontStyle: 'italic', fontWeight: 300 }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} /></div>
            </div>
          </div>

          {/* Gold divider */}
          <div style={{ height: 1, background: GOLD, margin: '4px 18px', opacity: 0.5 }} />

          {/* Price */}
          <div style={{ padding: '6px 18px' }}>
            <div style={{ fontSize: 7, color: MUTED, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Sold for</div>
            <EditableText field="price" editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 22, color: CREAM, fontFamily: SF, fontWeight: 600 }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} />
          </div>

          {/* Icon bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: 'rgba(249,245,240,0.06)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: 3, overflow: 'hidden', margin: '4px 18px 8px' }}>
            {ICON_DEFS.map(({ field, label, svg }, i) => (
              <div key={field} style={{ padding: '7px 3px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRight: i < 2 ? '1px solid rgba(201,169,110,0.20)' : 'none' }}>
                {svg}
                <EditableText field={field} editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 12, fontWeight: 'bold', color: GOLD, fontFamily: SF, textAlign: 'center' }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} />
                <div style={{ fontSize: 6, color: MUTED, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 18px 10px' }}>
            <EditableText field="footer1" editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 7, letterSpacing: 3, textTransform: 'uppercase', color: CREAM }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} />
            <div style={{ flex: 1, height: 1, background: GOLD, margin: '0 7px', opacity: 0.4 }} />
            <EditableText field="footer2" editing={editing} tempVal={tempVal} fields={fields} style={{ fontSize: 9, fontStyle: 'italic', color: GOLD, fontFamily: SF }} onStartEdit={startEdit} onCommit={commitEdit} onTempChange={setTempVal} />
          </div>
        </div>
      </div>

      {/* PASSWORD + DOWNLOAD */}
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <input
          type="password"
          placeholder="Lösenord för nedladdning"
          value={password}
          onChange={e => { setPassword(e.target.value); setAuthError('') }}
          style={{
            padding: '10px 18px', fontSize: 12, borderRadius: 6,
            border: authError ? '1.5px solid #e55' : '1.5px solid #3a3020',
            background: '#1a1710', color: '#fff', outline: 'none',
            width: 240, fontFamily: SS, letterSpacing: 1,
          }}
        />
        {authError && <div style={{ color: '#e55', fontSize: 10, letterSpacing: 1 }}>{authError}</div>}
        <button
          onClick={downloadStory}
          disabled={downloading || !password}
          style={{
            background: downloading || !password ? '#333' : `linear-gradient(135deg,${GOLD},${GOLDD})`,
            color: '#fff', border: 'none', borderRadius: 8,
            padding: '15px 44px', fontSize: 13, fontWeight: 700,
            letterSpacing: 3, textTransform: 'uppercase',
            cursor: downloading || !password ? 'not-allowed' : 'pointer',
            boxShadow: downloading || !password ? 'none' : '0 8px 28px rgba(201,169,110,0.45)',
            transition: 'all 0.2s', fontFamily: SS,
          }}
        >
          {downloading ? '⏳  Genererar...' : '⬇  Ladda ner  1080 × 1920 px'}
        </button>
      </div>
      <div style={{ marginTop: 10, color: '#444', fontSize: 10, letterSpacing: 1 }}>PNG · Klar för Instagram Stories</div>
    </div>
  )
}
