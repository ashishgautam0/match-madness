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
  animationType: {
    french: 'correct' | 'wrong' | null
    english: 'correct' | 'wrong' | null
    type: 'correct' | 'wrong' | null
  }
  checkMode: boolean
  onToggleCheckMode: () => void
}

/**
 * Main game board with three columns
 */
export function GameBoard({
  state,
  progress,
  onSelectItem,
  animatingSelection,
  animationType,
  checkMode,
  onToggleCheckMode
}: GameBoardProps) {
  const { isEnabled, toggle } = usePronunciation()

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      {/* Progress and toggle buttons */}
      <div className="flex items-center justify-between gap-4">
        <ProgressBar progress={progress} />

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCheckMode}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              font-medium text-sm transition-all
              ${checkMode
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
              }
            `}
            title={checkMode ? 'Check Mode ON (Match any 2)' : 'Check Mode OFF (Match all 3)'}
          >
            <span className="text-lg">{checkMode ? '✓' : '✗'}</span>
            <span className="hidden sm:inline">Check Mode</span>
          </button>

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
          animationType={animationType.french}
        />

        <GameColumn
          title="English"
          items={state.visibleItems.english}
          column="english"
          selectedItem={state.selection.english}
          onSelectItem={onSelectItem}
          animatingItem={animatingSelection.english}
          animationType={animationType.english}
        />

        <GameColumn
          title="Type"
          items={state.visibleItems.type}
          column="type"
          selectedItem={state.selection.type}
          onSelectItem={onSelectItem}
          animatingItem={animatingSelection.type}
          animationType={animationType.type}
        />
      </div>
    </div>
  )
}
