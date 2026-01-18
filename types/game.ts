/**
 * Grammatical type classifications for French words
 * @remarks Uses literal union type for exhaustive checking
 */
export type GrammaticalType =
  | 'Masculine Singular'
  | 'Feminine Singular'
  | 'Plural'
  | 'Both Genders'

/**
 * Column identifiers in the game board
 */
export type ColumnType = 'french' | 'english' | 'type'

/**
 * Sound effect identifiers
 */
export type SoundType =
  | 'correct'
  | 'wrong'
  | 'complete'
  | 'streak-10'
  | 'streak-25'
  | 'select'

/**
 * Haptic feedback intensity levels
 */
export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'error'

/**
 * Core game item representing a French word with its properties
 * @remarks Immutable by design
 */
export interface GameItem {
  readonly id: string
  readonly french: string
  readonly english: string
  readonly type: GrammaticalType
}

/**
 * User's current selection across three columns
 * @remarks Null represents no selection in that column
 */
export interface Selection {
  readonly french: GameItem | null
  readonly english: GameItem | null
  readonly type: GameItem | null
}

/**
 * Complete game state snapshot
 * @remarks Immutable - use reducer pattern for updates
 */
export interface GameState {
  readonly visibleItems: {
    readonly french: readonly GameItem[]
    readonly english: readonly GameItem[]
    readonly type: readonly GameItem[]
  }
  readonly selection: Selection
  readonly completed: number
  readonly total: number
  readonly streak: number
  readonly isProcessing: boolean
  readonly isComplete: boolean
}

/**
 * Configuration for initializing a game session
 */
export interface GameConfig {
  readonly items: readonly GameItem[]
  readonly totalMatches: number
  readonly itemsPerColumn: number
  readonly minRepetitions: number
  readonly maxRepetitions: number
}

/**
 * Progress tracking data
 */
export interface GameProgress {
  readonly completed: number
  readonly total: number
  readonly percentage: number
  readonly streak: number
}

/**
 * Game statistics for post-game display
 */
export interface GameStats {
  readonly totalMatches: number
  readonly correctMatches: number
  readonly wrongAttempts: number
  readonly accuracy: number
  readonly timeSpent: number // seconds
  readonly averageTimePerMatch: number // seconds
}

/**
 * Type guard to check if selection is complete
 */
export function isSelectionComplete(selection: Selection): boolean {
  return selection.french !== null
    && selection.english !== null
    && selection.type !== null
}

/**
 * Type guard to check if selection is empty
 */
export function isSelectionEmpty(selection: Selection): boolean {
  return selection.french === null
    && selection.english === null
    && selection.type === null
}
