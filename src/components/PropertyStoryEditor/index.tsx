'use client'

import { useState, useRef, useCallback } from 'react'

export default function PropertyStoryEditor() {
  const [fields, setFields] = useState({
    ref: '58272',
    location: 'PUNTA PRIMA · SPAIN',
    title1: 'Modern',
    title2: 'Bungalow',
    price: '229.500 €',
    beds: '2',
    baths: '2',
    area: '67 m²',
    type: 'Bungalow',
    footer1: 'Contact us',
    footer2: 'Exclusive Living',
  })

  const [photo1, setPhoto1] = useState<string | null>(null)
  const [photo2, setPhoto2] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [tempVal, setTempVal] = useState('')
  const [downloading, setDownloading] = useState(false)
  const photo1Ref = useRef<HTMLInputElement>(null)
  const photo2Ref = useRef<HTMLInputElement>(null)

  const startEdit = (key: string) => { setEditing(key); setTempVal(fields[key as keyof typeof fields]) }
  const commitEdit = () => { if (editing) setFields(f => ({ ...f, [editing]: tempVal })); setEditing(null) }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setter(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  const downloadStory = useCallback(async () => {
    setDownloading(true)
    try {
      const W = 1080, H = 1920
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!

      const loadImg = (src: string | null): Promise<HTMLImageElement | null> => new Promise((res) => {
        if (!src) { res(null); return }
        const img = new Image()
        img.onload = () => res(img)
        img.onerror = () => res(null)
        img.src = src
      })

      const [img1, img2, houseImg, bedImg, showerImg, sizeImg] = await Promise.all([
        loadImg(photo1), loadImg(photo2),
        loadImg('/house-icon.svg'), loadImg('/bed-icon.svg'),
        loadImg('/shower-icon.svg'), loadImg('/size-icon.svg'),
      ])

      // Background
      ctx.fillStyle = '#F9F5F0'
      ctx.fillRect(0, 0, W, H)

      // TOP PHOTO 0–750
      const topH = 750
      if (img1) {
        const scale = Math.max(W / img1.width, topH / img1.height)
        const sw = img1.width * scale, sh = img1.height * scale
        const ox = (W - sw) / 2, oy = (topH - sh) / 2
        ctx.save()
        ctx.beginPath(); ctx.rect(0, 0, W, topH); ctx.clip()
        ctx.drawImage(img1, ox, oy, sw, sh)
        ctx.restore()
      } else {
        ctx.fillStyle = '#cccccc'
        ctx.fillRect(0, 0, W, topH)
      }
      // fade to cream
      const grad1 = ctx.createLinearGradient(0, topH - 200, 0, topH)
      grad1.addColorStop(0, 'rgba(249,245,240,0)')
      grad1.addColorStop(1, 'rgba(249,245,240,1)')
      ctx.fillStyle = grad1
      ctx.fillRect(0, topH - 200, W, 200)

      // REF badge
      ctx.fillStyle = 'rgba(249,245,240,0.95)'
      roundRect(ctx, 44, 44, 240, 64, 4); ctx.fill()
      ctx.font = "500 26px 'Helvetica Neue', Helvetica, sans-serif"
      ctx.fillStyle = '#9A9A9A'
      ctx.fillText(`REF  ${fields.ref}`, 70, 85)

      // CONTENT
      let y = 800

      // Gold dot + location
      ctx.beginPath(); ctx.arc(70, y + 12, 9, 0, Math.PI * 2)
      ctx.fillStyle = '#C9A96E'; ctx.fill()
      ctx.font = "500 28px 'Helvetica Neue', Helvetica, sans-serif"
      ctx.fillStyle = '#C9A96E'
      ctx.fillText(fields.location.toUpperCase(), 96, y + 18)
      y += 70

      // Title1
      ctx.font = '300 130px Georgia, serif'
      ctx.fillStyle = '#2C2C2C'
      ctx.fillText(fields.title1, 66, y + 110)
      y += 130

      // Title2 italic
      ctx.font = '300 italic 120px Georgia, serif'
      ctx.fillStyle = '#8B7355'
      ctx.fillText(fields.title2, 66, y + 100)
      y += 120

      // Divider
      ctx.fillStyle = '#C9A96E'
      ctx.fillRect(66, y + 20, 110, 3)
      y += 70

      // Price label
      ctx.font = "400 26px 'Helvetica Neue', Helvetica, sans-serif"
      ctx.fillStyle = '#9A9A9A'
      ctx.fillText('PRICE', 66, y)
      y += 46

      // Price
      ctx.font = '600 96px Georgia, serif'
      ctx.fillStyle = '#2C2C2C'
      ctx.fillText(fields.price, 66, y + 80)
      y += 120

      function tintIcon(img: HTMLImageElement | null, color: string, size: number): HTMLCanvasElement | null {
        if (!img) return null
        const off = document.createElement('canvas')
        off.width = size; off.height = size
        const oc = off.getContext('2d')!
        oc.drawImage(img, 0, 0, size, size)
        oc.globalCompositeOperation = 'source-in'
        oc.fillStyle = color
        oc.fillRect(0, 0, size, size)
        return off
      }

      // ICON BAR
      const bx = 66, bw = W - 132, bh = 170
      ctx.fillStyle = '#FFFFFF'
      roundRect(ctx, bx, y, bw, bh, 8); ctx.fill()
      ctx.strokeStyle = '#E8E0D5'; ctx.lineWidth = 2
      roundRect(ctx, bx, y, bw, bh, 8); ctx.stroke()

      const cw = bw / 4
      for (let i = 1; i < 4; i++) {
        ctx.beginPath()
        ctx.moveTo(bx + cw * i, y + 24)
        ctx.lineTo(bx + cw * i, y + bh - 24)
        ctx.strokeStyle = '#E8E0D5'; ctx.lineWidth = 1.5
        ctx.stroke()
      }

      const GOLD = '#C9A96E'
      const iSize = 56
      const icons = [
        { val: fields.beds,  img: tintIcon(bedImg, GOLD, iSize) },
        { val: fields.baths, img: tintIcon(showerImg, GOLD, iSize) },
        { val: fields.area,  img: tintIcon(sizeImg, GOLD, iSize) },
        { val: fields.type,  img: tintIcon(houseImg, GOLD, iSize) },
      ]
      ctx.textAlign = 'center'
      icons.forEach(({ val, img }, i) => {
        const cx = bx + cw * i + cw / 2
        if (img) ctx.drawImage(img, cx - iSize / 2, y + 16, iSize, iSize)
        const isLong = val.length > 5
        ctx.font = isLong ? '500 30px Georgia, serif' : 'bold 50px Georgia, serif'
        ctx.fillStyle = '#2C2C2C'
        ctx.fillText(val, cx, y + 148)
      })
      ctx.textAlign = 'left'
      y += bh + 36

      // BOTTOM PHOTO
      const ph2 = 1565 - y
      if (img2 && ph2 > 0) {
        const scale = Math.max((W - 132) / img2.width, ph2 / img2.height)
        const sw = img2.width * scale, sh = img2.height * scale
        const ox = 66 + ((W - 132) - sw) / 2
        const oy = y + (ph2 - sh) / 2
        ctx.save()
        roundRect(ctx, 66, y, W - 132, ph2, 8); ctx.clip()
        ctx.drawImage(img2, ox, oy, sw, sh)
        ctx.restore()
      } else if (ph2 > 0) {
        ctx.fillStyle = '#cccccc'
        roundRect(ctx, 66, y, W - 132, ph2, 8); ctx.fill()
      }

      // FOOTER
      const fy = 1630
      ctx.font = "500 28px 'Helvetica Neue', Helvetica, sans-serif"
      ctx.fillStyle = '#2C2C2C'
      ctx.fillText(fields.footer1, 66, fy)
      const f1w = ctx.measureText(fields.footer1).width

      ctx.font = 'italic 34px Georgia, serif'
      ctx.fillStyle = '#8B7355'
      ctx.textAlign = 'right'
      ctx.fillText(fields.footer2, W - 66, fy)
      const f2w = ctx.measureText(fields.footer2).width
      ctx.textAlign = 'left'

      ctx.fillStyle = '#C9A96E'
      ctx.fillRect(66 + f1w + 28, fy - 9, (W - 132) - f1w - f2w - 56, 2)

      // Send to API for authenticated download
      const imageData = canvas.toDataURL('image/png')
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          filename: `property_story_ref${fields.ref}.png`,
        }),
      })
      if (!res.ok) {
        setDownloading(false)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `property_story_ref${fields.ref}.png`
      a.click()
      URL.revokeObjectURL(url)
      setDownloading(false)

    } catch (err: unknown) {
      console.error(err)
      alert('Fel vid generering: ' + (err instanceof Error ? err.message : String(err)))
      setDownloading(false)
    }
  }, [fields, photo1, photo2])

  const EditableText = ({ field, style }: { field: string; style: React.CSSProperties }) =>
    editing === field ? (
      <input
        autoFocus
        value={tempVal}
        onChange={e => setTempVal(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={e => e.key === 'Enter' && commitEdit()}
        style={{
          ...style, background: 'rgba(201,169,110,0.13)',
          border: '1.5px solid #C9A96E', borderRadius: 2,
          outline: 'none', padding: '1px 5px', width: '100%', boxSizing: 'border-box',
        }}
      />
    ) : (
      <span
        onClick={() => startEdit(field)}
        title="Klicka för att redigera"
        style={{ ...style, cursor: 'text', display: 'inline-block', minWidth: 16 }}
      >
        {fields[field as keyof typeof fields]}
      </span>
    )

  const iconDefs = [
    { field: 'beds',  svg: <img src="/bed-icon.svg" width={19} height={19} style={{ objectFit: 'contain' }} alt="" /> },
    { field: 'baths', svg: <img src="/shower-icon.svg" width={19} height={19} style={{ objectFit: 'contain' }} alt="" /> },
    { field: 'area',  svg: <img src="/size-icon.svg" width={19} height={19} style={{ objectFit: 'contain' }} alt="" /> },
    { field: 'type',  svg: <img src="/house-icon.svg" width={19} height={14} style={{ objectFit: 'contain' }} alt="" /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 12px', fontFamily: 'sans-serif' }}>

      <div style={{ marginBottom: 14, textAlign: 'center' }}>
        <div style={{ color: '#C9A96E', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}>Property Story Editor</div>
        <div style={{ color: '#555', fontSize: 10, letterSpacing: 2 }}>✏️ Klicka på text · 📷 Klicka på bilder för att byta</div>
      </div>

      {/* PREVIEW CARD */}
      <div style={{ width: 340, background: '#F9F5F0', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 70px rgba(0,0,0,0.6)', flexShrink: 0 }}>

        {/* Top photo */}
        <div onClick={() => photo1Ref.current?.click()} style={{ height: 198, background: photo1 ? `url(${photo1}) center/cover` : '#1e1e1e', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
          {!photo1 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, color: '#444' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M9 6l1.5-3h3L15 6"/></svg>
            <span style={{ fontSize: 9, letterSpacing: 3 }}>KLICKA FÖR FOTO 1</span>
          </div>}
          <input ref={photo1Ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePhoto(e, setPhoto1)} />
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(249,245,240,0.93)', padding: '4px 10px', borderRadius: 2, display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 8, color: '#9A9A9A', letterSpacing: 2 }}>REF</span>
            <EditableText field="ref" style={{ fontSize: 9, color: '#5A5A5A', letterSpacing: 2 }} />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 46, background: 'linear-gradient(transparent,#F9F5F0)' }} />
        </div>

        {/* Content */}
        <div style={{ padding: '6px 18px 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, background: '#C9A96E', borderRadius: '50%', flexShrink: 0 }} />
            <EditableText field="location" style={{ fontSize: 8, color: '#C9A96E', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500 }} />
          </div>
          <div style={{ lineHeight: 1.05 }}>
            <div><EditableText field="title1" style={{ fontSize: 31, color: '#2C2C2C', fontFamily: 'Georgia,serif', fontWeight: 300 }} /></div>
            <div><EditableText field="title2" style={{ fontSize: 31, color: '#8B7355', fontFamily: 'Georgia,serif', fontStyle: 'italic', fontWeight: 300 }} /></div>
          </div>
          <div style={{ width: 38, height: 1, background: '#C9A96E' }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
            <span style={{ fontSize: 8, color: '#9A9A9A', letterSpacing: 3, textTransform: 'uppercase' }}>Price</span>
            <EditableText field="price" style={{ fontSize: 22, color: '#2C2C2C', fontFamily: 'Georgia,serif', fontWeight: 600 }} />
          </div>

          {/* Icons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#fff', border: '1px solid #E8E0D5', borderRadius: 3, overflow: 'hidden', margin: '2px 0' }}>
            {iconDefs.map(({ field, svg }, i) => (
              <div key={field} style={{ padding: '7px 3px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, borderRight: i < 3 ? '1px solid #E8E0D5' : 'none' }}>
                {svg}
                <EditableText field={field} style={{ fontSize: field === 'type' ? 7 : 12, fontWeight: 'bold', color: '#2C2C2C', fontFamily: 'Georgia,serif', textAlign: 'center' }} />
              </div>
            ))}
          </div>

          {/* Bottom photo */}
          <div onClick={() => photo2Ref.current?.click()} style={{ height: 82, background: photo2 ? `url(${photo2}) center/cover` : '#1e1e1e', borderRadius: 3, cursor: 'pointer', position: 'relative', marginBottom: 2 }}>
            {!photo2 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, color: '#444' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M9 6l1.5-3h3L15 6"/></svg>
              <span style={{ fontSize: 8, letterSpacing: 2 }}>KLICKA FÖR FOTO 2</span>
            </div>}
            <input ref={photo2Ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePhoto(e, setPhoto2)} />
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0 8px' }}>
            <EditableText field="footer1" style={{ fontSize: 7, letterSpacing: 3, textTransform: 'uppercase', color: '#2C2C2C' }} />
            <div style={{ flex: 1, height: 1, background: '#C9A96E', margin: '0 7px' }} />
            <EditableText field="footer2" style={{ fontSize: 9, fontStyle: 'italic', color: '#8B7355', fontFamily: 'Georgia,serif' }} />
          </div>
        </div>
      </div>

      {/* DOWNLOAD */}
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button
          onClick={downloadStory}
          disabled={downloading}
          style={{
            background: downloading ? '#333' : 'linear-gradient(135deg,#C9A96E,#A8854A)',
            color: '#fff', border: 'none', borderRadius: 8,
            padding: '15px 44px', fontSize: 13, fontWeight: 700,
            letterSpacing: 3, textTransform: 'uppercase',
            cursor: downloading ? 'not-allowed' : 'pointer',
            boxShadow: downloading ? 'none' : '0 8px 28px rgba(201,169,110,0.45)',
            transition: 'all 0.2s',
          }}
        >
          {downloading ? '⏳  Genererar...' : '⬇  Ladda ner  1080 × 1920 px'}
        </button>
      </div>
      <div style={{ marginTop: 10, color: '#444', fontSize: 10, letterSpacing: 1 }}>PNG · Klar för Instagram Stories</div>
    </div>
  )
}
