import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let body: { imageData?: string; filename?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ogiltig förfrågan' }, { status: 400 })
  }

  const { imageData, filename = 'story.png' } = body

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
