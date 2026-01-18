'use client'

import { GameItem } from './GameItem'
import type { GameItem as GameItemType, ColumnType } from '@/types/game'

interface GameColumnProps {
  title: string
  items: readonly GameItemType[]
  column: ColumnType
  selectedItem: GameItemType | null
  onSelectItem: (item: GameItemType, column: ColumnType) => void
  showWrongAnimation: boolean
  showCorrectAnimation: boolean
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
  showWrongAnimation,
  showCorrectAnimation,
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
          // Compare by both ID and position to handle duplicates
          const isThisItemSelected = selectedItem === item
          return (
            <GameItem
              key={`${column}-${item.id}-${index}`}
              item={item}
              column={column}
              isSelected={isThisItemSelected}
              onClick={onSelectItem}
              showWrongAnimation={showWrongAnimation && isThisItemSelected}
              showCorrectAnimation={showCorrectAnimation && isThisItemSelected}
            />
          )
        })}
      </div>
    </div>
  )
}
