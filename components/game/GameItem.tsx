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

  // Base button styles
  const getButtonStyle = () => {
    let backgroundColor = '#1a1f2e'
    let borderColor = '#2a3441'
    let boxShadow = '0 2px 4px rgba(0,0,0,0.3)'

    if (showWrongAnimation) {
      backgroundColor = 'rgba(239, 68, 68, 0.15)'
      borderColor = '#ef4444'
      boxShadow = '0 0 12px rgba(239, 68, 68, 0.4)'
    } else if (showCorrectAnimation) {
      backgroundColor = 'rgba(88, 204, 2, 0.15)'
      borderColor = '#58cc02'
      boxShadow = '0 0 12px rgba(88, 204, 2, 0.4)'
    } else if (isSelected) {
      backgroundColor = 'rgba(28, 176, 246, 0.15)'
      borderColor = '#1cb0f6'
      boxShadow = '0 0 12px rgba(28, 176, 246, 0.3)'
    }

    return {
      flex: 1,
      position: 'relative' as const,
      backgroundColor,
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 0,
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow,
      padding: '0 8px'
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!showWrongAnimation && !showCorrectAnimation) {
      e.currentTarget.style.backgroundColor = isSelected ? 'rgba(28, 176, 246, 0.25)' : '#242b3d'
      e.currentTarget.style.borderColor = isSelected ? '#1cb0f6' : '#3a4558'
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = isSelected ? '0 4px 16px rgba(28, 176, 246, 0.4)' : '0 4px 12px rgba(0,0,0,0.4)'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!showWrongAnimation && !showCorrectAnimation) {
      e.currentTarget.style.backgroundColor = isSelected ? 'rgba(28, 176, 246, 0.15)' : '#1a1f2e'
      e.currentTarget.style.borderColor = isSelected ? '#1cb0f6' : '#2a3441'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = isSelected ? '0 0 12px rgba(28, 176, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.3)'
    }
  }

  return (
    <button
      onClick={handleClick}
      style={getButtonStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-pressed={isSelected}
      aria-label={`Select ${displayText}`}
    >
      <span style={{
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {displayText}
      </span>

      {/* Selection indicator */}
      {isSelected && !showWrongAnimation && !showCorrectAnimation && (
        <div style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#1cb0f6',
          boxShadow: '0 0 6px rgba(28, 176, 246, 0.6)'
        }} />
      )}
      {showWrongAnimation && (
        <div style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
        }} />
      )}
      {showCorrectAnimation && (
        <div style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#58cc02',
          boxShadow: '0 0 6px rgba(88, 204, 2, 0.6)'
        }} />
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
