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

  // Base button styles - Duolingo style with 3D border effect
  const getButtonStyle = () => {
    // Default: dark background matching page, subtle border with 3D bottom
    let backgroundColor = '#0a0e14'
    let borderColor = '#3c4a5e'
    let borderBottomColor = '#2a3441'

    if (showWrongAnimation) {
      borderColor = '#ef4444'
      borderBottomColor = '#b91c1c'
    } else if (showCorrectAnimation) {
      borderColor = '#58cc02'
      borderBottomColor = '#3d8c01'
    } else if (isSelected) {
      borderColor = '#1cb0f6'
      borderBottomColor = '#1489bd'
    }

    return {
      flex: 1,
      position: 'relative' as const,
      backgroundColor,
      border: `2px solid ${borderColor}`,
      borderBottom: `4px solid ${borderBottomColor}`,
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 0,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      padding: '0 12px'
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!showWrongAnimation && !showCorrectAnimation) {
      e.currentTarget.style.borderColor = isSelected ? '#1cb0f6' : '#4d5d73'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!showWrongAnimation && !showCorrectAnimation) {
      e.currentTarget.style.borderColor = isSelected ? '#1cb0f6' : '#3c4a5e'
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
