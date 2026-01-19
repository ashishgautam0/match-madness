import type {
  GameItem,
  GameState,
  GameConfig,
  Selection,
  ColumnType,
  GameProgress
} from '@/types/game'
import { generatePool } from './RepetitionManager'
import { validateMatch, validateTwoColumnMatch } from './Validator'
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
  private readonly learnedWordIds: Set<string> = new Set()

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
   * Ensures no duplicate words appear in the same batch
   */
  private generateInitialVisibleItems(): GameState['visibleItems'] {
    const count = this.config.itemsPerColumn
    const uniqueItems: GameItem[] = []
    const seenSourceIds = new Set<string>()

    // Collect unique words for visible batch
    while (uniqueItems.length < count && this.currentIndex < this.pool.length) {
      const item = this.pool[this.currentIndex]
      const sourceId = item.sourceId || item.id

      if (!seenSourceIds.has(sourceId)) {
        uniqueItems.push(item)
        seenSourceIds.add(sourceId)
        this.currentIndex++
      } else {
        // Skip this item, will use it later
        this.currentIndex++
      }
    }

    // Create unique instances for each column to ensure independent selection
    return {
      french: shuffle(uniqueItems.map(item => ({
        ...item,
        sourceId: item.sourceId || item.id, // Preserve sourceId
        instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))),
      english: shuffle(uniqueItems.map(item => ({
        ...item,
        sourceId: item.sourceId || item.id, // Preserve sourceId
        instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))),
      type: shuffle(uniqueItems.map(item => ({
        ...item,
        sourceId: item.sourceId || item.id, // Preserve sourceId
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
   * @deprecated This method shuffles items. Use completeMatch instead which maintains positions.
   */
  private refillColumn(column: ColumnType, removeInstanceId: string): readonly GameItem[] {
    const currentItems = this.state.visibleItems[column]
    // Remove only the specific instance that was matched
    const filtered = currentItems.filter(item => item.instanceId !== removeInstanceId)

    // Get new items and create unique instances for this column
    const newItems = this.getNextItems(1).map(item => ({
      ...item,
      sourceId: item.sourceId || item.id, // Preserve sourceId
      instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }))

    // DON'T shuffle - maintain positions
    return [...filtered, ...newItems]
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
    // Use appropriate validation based on column mode
    const isTwoColumnMode = this.config.columnMode === 'two-columns'
    const isValid = isTwoColumnMode
      ? validateTwoColumnMatch(this.state.selection)
      : validateMatch(this.state.selection)

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
    const sourceId = this.state.selection.french!.sourceId || matchedId

    // Track this unique word as learned
    this.learnedWordIds.add(sourceId)

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
    // Get current visible sourceIds (excluding the matched item)
    const matchedSourceId = selection.french!.sourceId || selection.french!.id
    const visibleSourceIds = new Set<string>()

    // Collect all visible sourceIds except the one being replaced
    this.state.visibleItems.french.forEach(item => {
      const sourceId = item.sourceId || item.id
      if (sourceId !== matchedSourceId) {
        visibleSourceIds.add(sourceId)
      }
    })

    // Find next item that doesn't duplicate any visible word
    let newItem: GameItem | undefined
    const startIndex = this.currentIndex

    while (this.currentIndex < this.pool.length) {
      const candidate = this.pool[this.currentIndex]
      const candidateSourceId = candidate.sourceId || candidate.id

      if (!visibleSourceIds.has(candidateSourceId)) {
        newItem = candidate
        this.currentIndex++
        break
      }

      this.currentIndex++
    }

    if (!newItem) {
      // No suitable item found, just remove matched items
      // Handle 2-column mode where one selection might be null
      this.state = {
        ...this.state,
        visibleItems: {
          french: this.state.visibleItems.french.filter(item =>
            !selection.french || item.instanceId !== selection.french.instanceId
          ),
          english: this.state.visibleItems.english.filter(item =>
            !selection.english || item.instanceId !== selection.english.instanceId
          ),
          type: this.state.visibleItems.type.filter(item =>
            !selection.type || item.instanceId !== selection.type.instanceId
          ),
        },
        selection: { french: null, english: null, type: null },
      }
      return
    }

    // Create unique instances for each column
    const frenchInstance = { ...newItem, sourceId: newItem.sourceId || newItem.id, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
    const englishInstance = { ...newItem, sourceId: newItem.sourceId || newItem.id, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
    const typeInstance = { ...newItem, sourceId: newItem.sourceId || newItem.id, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }

    // Replace only the matched item in each column, keeping all others in place
    // Handle 2-column mode where one selection might be null
    const newVisibleItems = {
      french: this.state.visibleItems.french.map(item =>
        selection.french && item.instanceId === selection.french.instanceId ? frenchInstance : item
      ),
      english: this.state.visibleItems.english.map(item =>
        selection.english && item.instanceId === selection.english.instanceId ? englishInstance : item
      ),
      type: this.state.visibleItems.type.map(item =>
        selection.type && item.instanceId === selection.type.instanceId ? typeInstance : item
      ),
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
    const totalUniqueWords = this.config.items.length
    const uniqueWordsLearned = this.learnedWordIds.size

    return {
      completed: this.state.completed,
      total: this.state.total,
      percentage: Math.round((this.state.completed / this.state.total) * 100),
      streak: this.state.streak,
      uniqueWordsLearned,
      totalUniqueWords,
      uniqueWordsPercentage: Math.round((uniqueWordsLearned / totalUniqueWords) * 100),
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
    this.learnedWordIds.clear()
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
