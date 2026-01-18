'use client'

import { GameColumn } from './GameColumn'
import { ProgressBar } from './ProgressBar'
import { usePronunciation } from '@/lib/hooks/usePronunciation'
import type { GameState, GameItem, ColumnType, GameProgress } from '@/types/game'

interface GameBoardProps {
  state: GameState
  progress: GameProgress
  onSelectItem: (item: GameItem, column: ColumnType) => void
  animatingSelection: {
    french: GameItem | null
    english: GameItem | null
    type: GameItem | null
  }
  animationType: 'correct' | 'wrong' | null
}

/**
 * Main game board with three columns
 */
export function GameBoard({ state, progress, onSelectItem, animatingSelection, animationType }: GameBoardProps) {
  const { isEnabled, toggle } = usePronunciation()

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      {/* Progress and pronunciation toggle */}
      <div className="flex items-center justify-between gap-4">
        <ProgressBar progress={progress} />

        <button
          onClick={toggle}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            font-medium text-sm transition-all
            ${isEnabled
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
            }
          `}
          title={isEnabled ? 'Pronunciation ON' : 'Pronunciation OFF'}
        >
          <span className="text-lg">{isEnabled ? '🔊' : '🔇'}</span>
          <span className="hidden sm:inline">Pronunciation</span>
        </button>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        <GameColumn
          title="Français"
          items={state.visibleItems.french}
          column="french"
          selectedItem={state.selection.french}
          onSelectItem={onSelectItem}
          animatingItem={animatingSelection.french}
          animationType={animationType}
        />

        <GameColumn
          title="English"
          items={state.visibleItems.english}
          column="english"
          selectedItem={state.selection.english}
          onSelectItem={onSelectItem}
          animatingItem={animatingSelection.english}
          animationType={animationType}
        />

        <GameColumn
          title="Type"
          items={state.visibleItems.type}
          column="type"
          selectedItem={state.selection.type}
          onSelectItem={onSelectItem}
          animatingItem={animatingSelection.type}
          animationType={animationType}
        />
      </div>
    </div>
  )
}
