'use client'

import { memo } from 'react'
import type { GameItem as GameItemType, ColumnType } from '@/types/game'

interface GameItemProps {
  item: GameItemType
  column: ColumnType
  isSelected: boolean
  onClick: (item: GameItemType, column: ColumnType) => void
  showWrongAnimation: boolean
  showCorrectAnimation: boolean
}

/**
 * Individual game item component
 * @remarks Displays French word, English, or Type based on column
 * @remarks Memoized to prevent unnecessary re-renders
 */
function GameItemComponent({ item, column, isSelected, onClick, showWrongAnimation, showCorrectAnimation }: GameItemProps) {
  const handleClick = () => {
    onClick(item, column)
  }

  // Determine what to display based on column
  const displayText = column === 'french'
    ? item.french
    : column === 'english'
    ? item.english
    : item.type

  return (
    <button
      onClick={handleClick}
      className={`
        relative w-full px-4 py-3 rounded-lg
        bg-neutral-800 shadow-sm
        border-2 transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        active:translate-y-0
        ${showWrongAnimation
          ? 'border-error bg-error/20 shadow-md shadow-error/20 animate-shake'
          : showCorrectAnimation
          ? 'border-success bg-success/20 shadow-md shadow-success/20'
          : isSelected
          ? 'border-primary bg-primary/20 shadow-md shadow-primary/20'
          : 'border-neutral-700 hover:border-primary/50'
        }
        font-medium text-sm md:text-base text-white
        ${column === 'type' ? 'text-xs md:text-sm' : ''}
      `}
      aria-pressed={isSelected}
      aria-label={`Select ${displayText}`}
    >
      <span className="block truncate">{displayText}</span>

      {/* Selection indicator */}
      {isSelected && !showWrongAnimation && !showCorrectAnimation && (
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pop" />
      )}
      {showWrongAnimation && (
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error animate-pop" />
      )}
      {showCorrectAnimation && (
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-success animate-pop" />
      )}
    </button>
  )
}

export const GameItem = memo(GameItemComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these specific props change
  return (
    prevProps.item.instanceId === nextProps.item.instanceId &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.showWrongAnimation === nextProps.showWrongAnimation &&
    prevProps.showCorrectAnimation === nextProps.showCorrectAnimation
  )
})
