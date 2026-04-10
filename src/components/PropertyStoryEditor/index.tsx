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

      const loadSvg = (): Promise<HTMLImageElement | null> => new Promise((res) => {
        const img = new Image()
        img.onload = () => res(img)
        img.onerror = () => res(null)
        img.src = '/house-icon.svg'
      })

      const [img1, img2, houseImg] = await Promise.all([loadImg(photo1), loadImg(photo2), loadSvg()])

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

      const icons = [
        { val: fields.beds,  emoji: '🛏' },
        { val: fields.baths, emoji: '🛁' },
        { val: fields.area,  emoji: '📐' },
        { val: fields.type,  emoji: null },
      ]
      ctx.textAlign = 'center'
      icons.forEach(({ val, emoji }, i) => {
        const cx = bx + cw * i + cw / 2
        if (emoji) {
          ctx.font = '58px serif'
          ctx.fillText(emoji, cx, y + 74)
        } else if (houseImg) {
          const ih = 58, iw = ih * (600 / 433)
          ctx.drawImage(houseImg, cx - iw / 2, y + 18, iw, ih)
        }
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
    { field: 'beds', svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9V19M21 9V19M3 13H21M3 9C3 9 5 7 9 7H15C19 7 21 9 21 9"></path><rect x="7" y="9" width="4" height="4" rx="0.5"></rect><rect x="13" y="9" width="4" height="4" rx="0.5"></rect></svg> },
    { field: 'baths', svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12H20V15C20 17.2 18.2 19 16 19H8C5.8 19 4 17.2 4 15V12Z"></path><path d="M4 12V8C4 6.9 4.9 6 6 6C7.1 6 8 6.9 8 8V9"></path><line x1="4" y1="12" x2="20" y2="12"></line></svg> },
    { field: 'area', svg: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"></rect><path d="M3 9H21M9 3V21"></path></svg> },
    { field: 'type', svg: <svg width="19" height="14" viewBox="0 0 600 433" xmlns="http://www.w3.org/2000/svg" fill="#C9A96E" stroke="none"><g transform="translate(0,433) scale(0.05,-0.05)"><path d="M5070 6978 c-2715 -1997 -2523 -1851 -2571 -1949 -159 -330 199 -665 526 -492 l115 61 0 -1689 0 -1689 -146 0 c-206 0 -302 -89 -203 -189 42 -41 6384 -48 6425 -7 97 97 -8 196 -210 196 l-146 0 0 1690 c0 930 5 1690 10 1690 6 0 44 -22 85 -49 392 -255 813 293 461 601 -37 32 -262 201 -501 376 l-435 318 0 664 c0 618 -3 666 -37 697 -55 50 -984 50 -1026 0 -18 -23 -30 -114 -37 -289 l-10 -256 -450 331 c-774 569 -884 647 -917 647 -18 0 -438 -298 -933 -662z m1215 205 c259 -192 842 -620 2235 -1642 380 -278 715 -529 745 -557 87 -81 73 -203 -28 -256 -96 -49 -57 -73 -1017 632 -470 346 -1384 1016 -1847 1354 -186 135 -353 246 -372 246 -19 0 -141 -80 -272 -177 -867 -645 -2815 -2062 -2848 -2073 -55 -17 -143 29 -180 94 -59 105 -30 133 609 603 330 243 1068 786 1640 1207 572 421 1047 765 1055 765 8 1 134 -87 280 -196z m1975 -664 c0 -471 -2 -499 -35 -480 -19 11 -161 113 -315 226 l-280 207 -6 274 -5 274 320 0 321 0 0 -501z m-1895 -74 c190 -141 779 -574 1310 -963 l965 -707 0 -1778 0 -1777 -1480 0 -1480 0 0 1409 c0 1373 -1 1410 -39 1430 -25 14 -331 21 -859 21 l-820 0 -31 -44 c-27 -40 -31 -209 -31 -1430 l0 -1386 -270 0 -270 0 0 1775 0 1775 1315 965 c723 530 1322 964 1330 965 8 0 170 -115 360 -255z m-905 -3905 l0 -1320 -670 0 -670 0 0 1307 c0 718 6 1312 13 1320 8 7 309 13 670 13 l657 0 0 -1320z"/><path d="M5860 5881 c-647 -197 -523 -1131 150 -1131 650 0 786 935 163 1120 -107 32 -231 36 -313 11z m266 -230 c100 -36 151 -83 196 -181 157 -341 -255 -658 -542 -417 -297 250 -20 729 346 598z"/><path d="M6231 4049 c-27 -28 -31 -110 -31 -599 0 -555 -1 -568 -41 -580 -129 -41 -107 -457 32 -591 l71 -69 894 -5 c998 -6 985 -8 1079 133 71 107 68 461 -5 518 l-50 40 0 547 c0 464 -5 555 -31 593 l-31 44 -928 0 c-816 0 -931 -4 -959 -31z m849 -679 l0 -490 -330 0 -330 0 0 490 0 490 330 0 330 0 0 -490z m875 -5 l6 -485 -331 0 -330 0 0 490 0 491 325 -6 325 -5 5 -485z m105 -801 c0 -152 46 -144 -869 -144 -909 1 -862 -6 -877 123 -15 126 -85 117 879 117 l867 0 0 -96z"/><path d="M5041 2621 c-117 -117 27 -309 175 -233 132 68 89 255 -62 268 -51 5 -83 -5 -113 -35z"/></g></svg> },
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
