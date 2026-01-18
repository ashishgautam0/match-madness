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
    <div className="flex flex-col gap-2">
      {/* Column header */}
      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide px-2">
        {title}
      </h3>

      {/* Items */}
      <div className="flex flex-col gap-2 animate-slide-in">
        {items.map((item, index) => {
          // Compare by object reference to handle duplicates
          const isThisItemSelected = selectedItem === item
          const isThisItemAnimating = animatingItem === item

          return (
            <GameItem
              key={`${column}-${item.id}-${index}`}
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
