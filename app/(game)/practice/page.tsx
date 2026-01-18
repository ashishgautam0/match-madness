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
    <main className="min-h-screen">
      <MatchGame config={config} />
    </main>
  )
}
