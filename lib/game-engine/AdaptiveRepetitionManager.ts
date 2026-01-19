import type { GameItem } from '@/types/game'
import { shuffle } from './Shuffler'

/**
 * Adaptive Repetition Manager
 * Dynamically adjusts word frequency based on mistakes
 * - Words you get wrong appear 5x more
 * - Words you get right appear less frequently
 * - No cap on total matches
 */

export class AdaptiveRepetitionManager {
  private mistakeCount: Map<string, number> = new Map() // sourceId -> mistake count
  private correctCount: Map<string, number> = new Map() // sourceId -> correct count
  private pool: GameItem[] = []
  private readonly baseItems: readonly GameItem[]

  constructor(items: readonly GameItem[]) {
    this.baseItems = items
    this.regeneratePool()
  }

  /**
   * Records a mistake for a word, increasing its future appearances by 5x
   */
  public recordMistake(sourceId: string): void {
    const currentMistakes = this.mistakeCount.get(sourceId) || 0
    this.mistakeCount.set(sourceId, currentMistakes + 1)

    // Add 5 more copies of this word to the pool
    const item = this.baseItems.find(i => i.id === sourceId)
    if (item) {
      for (let i = 0; i < 5; i++) {
        this.pool.push({
          ...item,
          sourceId: item.id,
          instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
      }
      // Shuffle to distribute the new copies
      this.pool = shuffle(this.pool)
    }
  }

  /**
   * Records a correct match for a word
   */
  public recordCorrect(sourceId: string): void {
    const currentCorrect = this.correctCount.get(sourceId) || 0
    this.correctCount.set(sourceId, currentCorrect + 1)

    // Mark word as learned
    this.learnedWordIds.add(sourceId)
  }

  /**
   * Gets the next item from the pool
   * Prioritizes words with more mistakes
   */
  public getNextItem(): GameItem | null {
    if (this.pool.length === 0) {
      // Pool exhausted - regenerate with focus on mistaken words
      this.regeneratePool()
      if (this.pool.length === 0) {
        return null // All words mastered
      }
    }

    return this.pool.shift() || null
  }

  /**
   * Gets multiple next items
   */
  public getNextItems(count: number): GameItem[] {
    const items: GameItem[] = []
    for (let i = 0; i < count; i++) {
      const item = this.getNextItem()
      if (item) {
        items.push(item)
      }
    }
    return items
  }

  /**
   * Regenerates the pool based on performance
   * Words with mistakes appear much more frequently
   */
  private regeneratePool(): void {
    const newPool: GameItem[] = []

    for (const item of this.baseItems) {
      const mistakes = this.mistakeCount.get(item.id) || 0
      const correct = this.correctCount.get(item.id) || 0

      // Calculate repetitions based on performance
      let repetitions = 3 // Base repetitions

      if (mistakes > 0) {
        // Each mistake adds 5 extra repetitions
        repetitions += mistakes * 5
      }

      if (correct > 2) {
        // After 3 correct, reduce by half
        repetitions = Math.max(1, Math.floor(repetitions / 2))
      }

      // Add copies to pool
      for (let i = 0; i < repetitions; i++) {
        newPool.push({
          ...item,
          sourceId: item.id,
          instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
      }
    }

    this.pool = shuffle(newPool)
  }

  /**
   * Gets performance stats
   */
  public getStats() {
    return {
      totalMistakes: Array.from(this.mistakeCount.values()).reduce((a, b) => a + b, 0),
      totalCorrect: Array.from(this.correctCount.values()).reduce((a, b) => a + b, 0),
      remainingInPool: this.pool.length,
    }
  }

  /**
   * Gets remaining pool size
   */
  public getRemainingCount(): number {
    return this.pool.length
  }

  /**
   * Checks if pool is empty and cannot regenerate
   */
  public isExhausted(): boolean {
    return this.pool.length === 0 && this.mistakeCount.size === 0
  }

  // Track learned words
  private learnedWordIds: Set<string> = new Set()

  public getLearnedWordIds(): Set<string> {
    return this.learnedWordIds
  }
}
