'use client'

import { GameColumn } from './GameColumn'
import { ProgressBar } from './ProgressBar'
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
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      {/* Progress at top */}
      <ProgressBar progress={progress} />

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
