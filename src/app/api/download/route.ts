import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.DOWNLOAD_PASSWORD ?? 'instamall2024'

export async function POST(req: NextRequest) {
  let body: { password?: string; imageData?: string; filename?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ogiltig förfrågan' }, { status: 400 })
  }

  const { password, imageData, filename = 'story.png' } = body

  if (!password || password !== PASSWORD) {
    return NextResponse.json({ error: 'Fel lösenord' }, { status: 401 })
  }

  if (!imageData || !imageData.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Bilddata saknas' }, { status: 400 })
  }

  const base64 = imageData.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${safeName}"`,
      'Content-Length': String(buffer.length),
    },
  })
}
