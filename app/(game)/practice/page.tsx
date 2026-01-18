'use client'

import Link from 'next/link'
import { MatchGame } from '@/components/game/MatchGame'
import { functionWords } from '@/data/function-words/articles'
import {
  ITEMS_PER_COLUMN,
  TOTAL_MATCHES,
  MIN_REPETITIONS,
  MAX_REPETITIONS
} from '@/lib/utils/constants'
import type { GameConfig } from '@/types/game'

export default function PracticePage() {
  const config: GameConfig = {
    items: functionWords,
    totalMatches: TOTAL_MATCHES,
    itemsPerColumn: ITEMS_PER_COLUMN,
    minRepetitions: MIN_REPETITIONS,
    maxRepetitions: MAX_REPETITIONS,
  }

  return (
    <main className="min-h-screen bg-neutral-900">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur border-b border-neutral-800 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back to Modes</span>
          </Link>
        </div>
      </div>

      <MatchGame config={config} />
    </main>
  )
}
