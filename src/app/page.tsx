'use client'
import { useState } from 'react'
import StoryEditor from '@/components/StoryEditor'
import PropertyStoryEditor from '@/components/PropertyStoryEditor'
import ListStoryEditor from '@/components/ListStoryEditor'
import Lyxery from '@/components/Lyxery'

export default function Home() {
  const [active, setActive] = useState<'story' | 'property' | 'list' | 'lyxery'>('story')

  const TEAL = '#3D8A8F'
  const SS = "'Helvetica Neue',Helvetica,Arial,sans-serif"

  return (
    <div style={{ background: '#091212', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: SS }}>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 2, marginTop: 28, marginBottom: 0 }}>
        {(['story', 'property', 'list', 'lyxery'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              padding: '9px 26px',
              background: active === tab ? TEAL : 'transparent',
              color: active === tab ? '#fff' : TEAL,
              border: `1.5px solid ${TEAL}`,
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: SS,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'story' ? 'Story' : tab === 'property' ? 'Property' : tab === 'list' ? 'List' : 'Lyxery'}
          </button>
        ))}
      </div>

      {active === 'story' ? <StoryEditor /> : active === 'property' ? <PropertyStoryEditor /> : active === 'list' ? <ListStoryEditor /> : <Lyxery />}
    </div>
  )
}
