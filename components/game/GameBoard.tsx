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
  hiddenColumn?: 'type' | 'english'
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
  onToggleCheckMode,
  hiddenColumn
}: GameBoardProps) {
  const { isEnabled, toggle } = usePronunciation()

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px',
      gap: '12px'
    }}>
      {/* Progress and toggle buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        flexShrink: 0
      }}>
        <ProgressBar progress={progress} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={onToggleCheckMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 11px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '11px',
              transition: 'all 0.2s ease',
              backgroundColor: checkMode ? '#1cb0f6' : '#1a1f2e',
              color: checkMode ? '#ffffff' : '#8b92a7',
              border: checkMode ? '2px solid #1cb0f6' : '2px solid #2a3441',
              cursor: 'pointer',
              boxShadow: checkMode ? '0 0 12px rgba(28, 176, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.3)'
            }}
            title={checkMode ? 'Check Mode ON (Match any 2)' : 'Check Mode OFF (Match all 3)'}
          >
            <span style={{ fontSize: '13px' }}>{checkMode ? '✓' : '✗'}</span>
            <span className="hidden sm:inline">Check Mode</span>
          </button>

          <button
            onClick={toggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 11px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '11px',
              transition: 'all 0.2s ease',
              backgroundColor: isEnabled ? '#1cb0f6' : '#1a1f2e',
              color: isEnabled ? '#ffffff' : '#8b92a7',
              border: isEnabled ? '2px solid #1cb0f6' : '2px solid #2a3441',
              cursor: 'pointer',
              boxShadow: isEnabled ? '0 0 12px rgba(28, 176, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.3)'
            }}
            title={isEnabled ? 'Pronunciation ON' : 'Pronunciation OFF'}
          >
            <span style={{ fontSize: '13px' }}>{isEnabled ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">Pronunciation</span>
          </button>
        </div>
      </div>

      {/* Columns (2 or 3 depending on mode) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: hiddenColumn ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: '8px',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0
      }}>
        <GameColumn
          title="Français"
          items={state.visibleItems.french}
          column="french"
          selectedItem={state.selection.french}
          onSelectItem={onSelectItem}
          animatingItem={animatingSelection.french}
          animationType={animationType.french}
        />

        {hiddenColumn !== 'english' && (
          <GameColumn
            title="English"
            items={state.visibleItems.english}
            column="english"
            selectedItem={state.selection.english}
            onSelectItem={onSelectItem}
            animatingItem={animatingSelection.english}
            animationType={animationType.english}
          />
        )}

        {hiddenColumn !== 'type' && (
          <GameColumn
            title="Type"
            items={state.visibleItems.type}
            column="type"
            selectedItem={state.selection.type}
            onSelectItem={onSelectItem}
            animatingItem={animatingSelection.type}
            animationType={animationType.type}
          />
        )}
      </div>
    </div>
  )
}
