'use client'

import { GameItem } from './GameItem'
import type { GameItem as GameItemType, ColumnType } from '@/types/game'

interface GameColumnProps {
  title: string
  items: readonly GameItemType[]
  column: ColumnType
  selectedItem: GameItemType | null
  onSelectItem: (item: GameItemType, column: ColumnType) => void
  animatingItem: GameItemType | null
  animationType: 'correct' | 'wrong' | null
}

/**
 * Column component containing 6 game items
 */
export function GameColumn({
  title,
  items,
  column,
  selectedItem,
  onSelectItem,
  animatingItem,
  animationType,
}: GameColumnProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minHeight: 0
    }}>
      {/* Column header */}
      <div style={{
        color: '#8b92a7',
        fontSize: '10px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        paddingLeft: '4px',
        marginBottom: '8px',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
      }}>
        {title}
      </div>

      {/* Items container - uses remaining space */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '2vh',
        minHeight: 0
      }}>
        {items.map((item) => {
          const isThisItemSelected = selectedItem?.instanceId === item.instanceId
          const isThisItemAnimating = animatingItem?.instanceId === item.instanceId

          return (
            <GameItem
              key={`${column}-${item.instanceId}`}
              item={item}
              column={column}
              isSelected={isThisItemSelected}
              onClick={onSelectItem}
              showWrongAnimation={isThisItemAnimating && animationType === 'wrong'}
              showCorrectAnimation={isThisItemAnimating && animationType === 'correct'}
            />
          )
        })}
      </div>
    </div>
  )
}
