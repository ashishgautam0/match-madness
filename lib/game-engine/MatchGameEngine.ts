import type {
  GameItem,
  GameState,
  GameConfig,
  Selection,
  ColumnType,
  GameProgress
} from '@/types/game'
import { generatePool } from './RepetitionManager'
import { AdaptiveRepetitionManager } from './AdaptiveRepetitionManager'
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
  private adaptiveManager: AdaptiveRepetitionManager | null = null
  private useAdaptiveMode: boolean = false

  constructor(config: GameConfig, useAdaptiveRepetition: boolean = false) {
    this.config = config
    // Disable adaptive mode for now - causes mismatched words between columns
    this.useAdaptiveMode = false

    // Use static pool system
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

    if (this.useAdaptiveMode && this.adaptiveManager) {
      // Use adaptive manager
      while (uniqueItems.length < count) {
        const item = this.adaptiveManager.getNextItem()
        if (!item) break

        const sourceId = item.sourceId || item.id
        if (!seenSourceIds.has(sourceId)) {
          uniqueItems.push(item)
          seenSourceIds.add(sourceId)
        }
      }
    } else {
      // Use static pool
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
    if (this.useAdaptiveMode && this.adaptiveManager) {
      return this.adaptiveManager.getNextItems(count)
    }

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

    // Get sourceId from whichever item is available (french, english, or type)
    const selectedItem = this.state.selection.french || this.state.selection.english || this.state.selection.type
    if (!selectedItem) {
      console.error('❌ No item selected in processSelection!')
      return { isValid: false, isComplete: false, streak: 0 }
    }
    const sourceId = selectedItem.sourceId || selectedItem.id

    if (!isValid) {
      // Record mistake in adaptive system
      if (this.useAdaptiveMode && this.adaptiveManager) {
        this.adaptiveManager.recordMistake(sourceId)
        const newTotal = this.state.total + 5
        console.log('❌ Mistake recorded for:', sourceId, '- will appear 5x more')
        console.log('   Total before:', this.state.total, '→ after:', newTotal)

        // Increase total matches by 5 (since we added 5 more copies)
        this.state = {
          ...this.state,
          total: newTotal,
          streak: 0,
        }
      } else {
        // Just reset streak in non-adaptive mode
        this.state = {
          ...this.state,
          streak: 0,
        }
      }

      return { isValid: false, isComplete: false, streak: 0 }
    }

    // Valid match - DON'T refill columns yet, let hook handle it for animation
    const matchedId = selectedItem.id

    // Record correct match in adaptive system
    if (this.useAdaptiveMode && this.adaptiveManager) {
      this.adaptiveManager.recordCorrect(sourceId)
      console.log('✅ Correct match for:', sourceId)
    }

    // Track this unique word as learned
    this.learnedWordIds.add(sourceId)

    const newCompleted = this.state.completed + 1
    const newStreak = this.state.streak + 1
    const isComplete = this.useAdaptiveMode ? false : (newCompleted >= this.state.total) // Never complete in adaptive mode

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
    // Get the matched item from whichever column has a selection
    const matchedItem = selection.french || selection.english || selection.type
    if (!matchedItem) {
      console.error('❌ No matched item in completeMatch!')
      return
    }
    const matchedSourceId = matchedItem.sourceId || matchedItem.id

    // Collect all visible sourceIds except the one being replaced
    const visibleSourceIds = new Set<string>()
    this.state.visibleItems.french.forEach(item => {
      const sourceId = item.sourceId || item.id
      if (sourceId !== matchedSourceId) {
        visibleSourceIds.add(sourceId)
      }
    })

    // Find next item that doesn't duplicate any visible word
    let newItem: GameItem | undefined

    if (this.useAdaptiveMode && this.adaptiveManager) {
      // Use adaptive manager to get next item
      let attempts = 0
      const maxAttempts = 100
      while (attempts < maxAttempts) {
        const candidate = this.adaptiveManager.getNextItem()
        if (!candidate) break

        const candidateSourceId = candidate.sourceId || candidate.id
        if (!visibleSourceIds.has(candidateSourceId)) {
          newItem = candidate
          break
        }
        attempts++
      }
    } else {
      // Use static pool
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
    }

    if (!newItem) {
      // No suitable item found, just remove matched items from ALL columns
      // In 2-column mode, we need to find the corresponding item in the hidden column by sourceId
      console.warn('⚠️ No new item available - removing matched items without replacement')
      this.state = {
        ...this.state,
        visibleItems: {
          french: this.state.visibleItems.french.filter(item => {
            const sourceId = item.sourceId || item.id
            return sourceId !== matchedSourceId
          }),
          english: this.state.visibleItems.english.filter(item => {
            const sourceId = item.sourceId || item.id
            return sourceId !== matchedSourceId
          }),
          type: this.state.visibleItems.type.filter(item => {
            const sourceId = item.sourceId || item.id
            return sourceId !== matchedSourceId
          }),
        },
        selection: { french: null, english: null, type: null },
      }
      return
    }

    // Create unique instances for each column
    const frenchInstance = { ...newItem, sourceId: newItem.sourceId || newItem.id, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
    const englishInstance = { ...newItem, sourceId: newItem.sourceId || newItem.id, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
    const typeInstance = { ...newItem, sourceId: newItem.sourceId || newItem.id, instanceId: `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }

    // Replace the matched item in ALL columns by sourceId (not just the selected ones)
    // This ensures all 3 columns stay in sync, even in 2-column mode
    const newVisibleItems = {
      french: this.state.visibleItems.french.map(item => {
        const sourceId = item.sourceId || item.id
        return sourceId === matchedSourceId ? frenchInstance : item
      }),
      english: this.state.visibleItems.english.map(item => {
        const sourceId = item.sourceId || item.id
        return sourceId === matchedSourceId ? englishInstance : item
      }),
      type: this.state.visibleItems.type.map(item => {
        const sourceId = item.sourceId || item.id
        return sourceId === matchedSourceId ? typeInstance : item
      }),
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
   * Resets the streak to 0 (called on wrong matches)
   */
  public resetStreak(): void {
    this.state = {
      ...this.state,
      streak: 0,
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
