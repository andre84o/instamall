'use client'
import { useState } from 'react'
import StoryEditor from '@/components/StoryEditor'
import PropertyStoryEditor from '@/components/PropertyStoryEditor'
import ListStoryEditor from '@/components/ListStoryEditor'
import Lyxery from '@/components/Lyxery'

type Tab = 'story' | 'property' | 'list' | 'lyxery'

const TABS: { key: Tab; label: string }[] = [
  { key: 'story',    label: 'Story' },
  { key: 'property', label: 'Property' },
  { key: 'list',     label: 'List' },
  { key: 'lyxery',   label: 'Lyxery' },
]

export default function Home() {
  const [active, setActive] = useState<Tab>('story')

  return (
    <div className="min-h-screen bg-[#091212] flex flex-col items-center font-sans">
      {/* Tab switcher — segmented control, mobile-first */}
      <nav
        aria-label="Editor tabs"
        className="
          sticky top-0 z-50 w-full
          backdrop-blur-md bg-[#091212]/80
          border-b border-white/5
          px-3 py-3 sm:py-4
          flex justify-center
        "
      >
        <div
          role="tablist"
          className="
            inline-flex items-center
            gap-1 p-1
            rounded-full
            bg-white/5
            border border-white/10
            shadow-lg shadow-black/40
            max-w-full overflow-x-auto
            scrollbar-hide
          "
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {TABS.map(({ key, label }) => {
            const isActive = active === key
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(key)}
                className={`
                  relative shrink-0
                  px-4 sm:px-5 py-2 sm:py-2.5
                  text-[11px] sm:text-xs
                  font-semibold tracking-[0.15em] uppercase
                  rounded-full
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50
                  ${isActive
                    ? 'bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md shadow-teal-900/50'
                    : 'text-teal-300/80 hover:text-white hover:bg-white/5'}
                `}
              >
                {label}
              </button>
            )
          })}
        </div>
      </nav>

      {active === 'story' ? (
        <StoryEditor />
      ) : active === 'property' ? (
        <PropertyStoryEditor />
      ) : active === 'list' ? (
        <ListStoryEditor />
      ) : (
        <Lyxery />
      )}
    </div>
  )
}
