import type {
  GameItem,
  GameState,
  GameConfig,
  Selection,
  ColumnType,
  GameProgress
} from '@/types/game'
import { generatePool } from './RepetitionManager'
import { validateMatch } from './Validator'
import { shuffle } from './Shuffler'

/**
 * Core game engine implementing match-three mechanics
 * @remarks Pure functional core - no React dependencies
 * @example
 * const engine = new MatchGameEngine(config)
 * const state = engine.getState()
 * engine.selectItem(item, 'french')
 */
export class MatchGameEngine {
  private pool: GameItem[]
  private currentIndex: number
  private state: GameState
  private readonly config: GameConfig

  constructor(config: GameConfig) {
    this.config = config

    // Generate item pool with repetitions
    this.pool = generatePool(
      config.items,
      config.totalMatches,
      config.minRepetitions,
      config.maxRepetitions
    )

    this.currentIndex = 0

    // Initialize state
    this.state = {
      visibleItems: this.generateInitialVisibleItems(),
      selection: { french: null, english: null, type: null },
      completed: 0,
      total: config.totalMatches,
      streak: 0,
      isProcessing: false,
      isComplete: false,
    }
  }

  /**
   * Generates initial visible items for all three columns
   */
  private generateInitialVisibleItems(): GameState['visibleItems'] {
    const count = this.config.itemsPerColumn
    const sourceItems = this.pool.slice(this.currentIndex, this.currentIndex + count)

    // Create unique instances for each column to ensure independent selection
    return {
      french: shuffle(sourceItems.map(item => ({
        ...item,
        instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))),
      english: shuffle(sourceItems.map(item => ({
        ...item,
        instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))),
      type: shuffle(sourceItems.map(item => ({
        ...item,
        instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))),
    }
  }

  /**
   * Gets the next batch of items from the pool
   * @param count - Number of items to retrieve
   * @returns Array of items
   */
  private getNextItems(count: number): GameItem[] {
    const items: GameItem[] = []

    for (let i = 0; i < count; i++) {
      if (this.currentIndex < this.pool.length) {
        items.push(this.pool[this.currentIndex])
        this.currentIndex++
      }
    }

    return items
  }

  /**
   * Refills a column after successful match
   * @param column - Column to refill
   * @param removeInstanceId - Instance ID of the specific item to remove
   * @returns New column items
   */
  private refillColumn(column: ColumnType, removeInstanceId: string): readonly GameItem[] {
    const currentItems = this.state.visibleItems[column]
    // Remove only the specific instance that was matched
    const filtered = currentItems.filter(item => item.instanceId !== removeInstanceId)

    // Get new items and create unique instances for this column
    const newItems = this.getNextItems(1).map(item => ({
      ...item,
      instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }))

    // Combine and shuffle
    return shuffle([...filtered, ...newItems])
  }

  /**
   * Gets current game state (immutable)
   */
  public getState(): Readonly<GameState> {
    return { ...this.state }
  }

  /**
   * Selects an item in a column
   * @param item - Item to select
   * @param column - Column where item is located
   * @returns New selection state
   */
  public selectItem(item: GameItem, column: ColumnType): Selection {
    // Update selection
    const newSelection: Selection = {
      ...this.state.selection,
      [column]: item,
    }

    this.state = {
      ...this.state,
      selection: newSelection,
    }

    return newSelection
  }

  /**
   * Attempts to process current selection as a match
   * @returns Object indicating if match was valid and new state
   */
  public processSelection(): {
    isValid: boolean
    isComplete: boolean
    streak: number
    matchedId?: string
  } {
    const isValid = validateMatch(this.state.selection)

    if (!isValid) {
      // DON'T clear selection here - let the hook handle it for animation
      // Just reset streak
      this.state = {
        ...this.state,
        streak: 0,
      }

      return { isValid: false, isComplete: false, streak: 0 }
    }

    // Valid match - DON'T refill columns yet, let hook handle it for animation
    const matchedId = this.state.selection.french!.id

    const newCompleted = this.state.completed + 1
    const newStreak = this.state.streak + 1
    const isComplete = newCompleted >= this.state.total

    this.state = {
      ...this.state,
      completed: newCompleted,
      streak: newStreak,
      isComplete,
    }

    return { isValid: true, isComplete, streak: newStreak, matchedId }
  }

  /**
   * Completes a successful match by refilling columns and clearing selection
   * @param selection - The selection that was matched (contains instanceIds)
   */
  public completeMatch(selection: Selection): void {
    // Get the next item from the pool (will be added to all three columns)
    const newItem = this.getNextItems(1)[0]

    if (!newItem) {
      // No more items in pool, just remove matched items
      this.state = {
        ...this.state,
        visibleItems: {
          french: this.state.visibleItems.french.filter(item => item.instanceId !== selection.french!.instanceId!),
          english: this.state.visibleItems.english.filter(item => item.instanceId !== selection.english!.instanceId!),
          type: this.state.visibleItems.type.filter(item => item.instanceId !== selection.type!.instanceId!),
        },
        selection: { french: null, english: null, type: null },
      }
      return
    }

    // Create unique instances for each column
    const frenchInstance = { ...newItem, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
    const englishInstance = { ...newItem, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
    const typeInstance = { ...newItem, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }

    // Remove matched items and add new item to each column, then shuffle
    const newVisibleItems = {
      french: shuffle([
        ...this.state.visibleItems.french.filter(item => item.instanceId !== selection.french!.instanceId!),
        frenchInstance
      ]),
      english: shuffle([
        ...this.state.visibleItems.english.filter(item => item.instanceId !== selection.english!.instanceId!),
        englishInstance
      ]),
      type: shuffle([
        ...this.state.visibleItems.type.filter(item => item.instanceId !== selection.type!.instanceId!),
        typeInstance
      ]),
    }

    this.state = {
      ...this.state,
      visibleItems: newVisibleItems,
      selection: { french: null, english: null, type: null },
    }
  }

  /**
   * Clears current selection
   */
  public clearSelection(): void {
    this.state = {
      ...this.state,
      selection: { french: null, english: null, type: null },
    }
  }

  /**
   * Gets game progress
   */
  public getProgress(): GameProgress {
    return {
      completed: this.state.completed,
      total: this.state.total,
      percentage: Math.round((this.state.completed / this.state.total) * 100),
      streak: this.state.streak,
    }
  }

  /**
   * Checks if game is complete
   */
  public isGameComplete(): boolean {
    return this.state.isComplete
  }

  /**
   * Resets game to initial state
   */
  public reset(): void {
    this.currentIndex = 0
    this.pool = generatePool(
      this.config.items,
      this.config.totalMatches,
      this.config.minRepetitions,
      this.config.maxRepetitions
    )

    this.state = {
      visibleItems: this.generateInitialVisibleItems(),
      selection: { french: null, english: null, type: null },
      completed: 0,
      total: this.config.totalMatches,
      streak: 0,
      isProcessing: false,
      isComplete: false,
    }
  }
}
