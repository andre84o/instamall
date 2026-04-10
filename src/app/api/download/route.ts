import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const password = process.env.DOWNLOAD_PASSWORD
  if (!password) {
    return NextResponse.json({ error: 'Nedladdning är inte konfigurerad' }, { status: 503 })
  }

  let body: { password?: string; imageData?: string; filename?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ogiltig förfrågan' }, { status: 400 })
  }

  const { password: provided, imageData, filename = 'story.png' } = body

  if (!provided || provided !== password) {
    return NextResponse.json({ error: 'Fel lösenord' }, { status: 401 })
  }

  if (!imageData || !imageData.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Bilddata saknas' }, { status: 400 })
  }

  const base64 = imageData.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')
  // Strip path separators and dots to prevent directory traversal
  const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, '_') + '.png'

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${safeName}"`,
      'Content-Length': String(buffer.length),
    },
  })
}
