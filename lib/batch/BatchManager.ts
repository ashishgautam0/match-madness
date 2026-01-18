import type { GameItem } from '@/types/game'
import { LEARNING_MODE } from '@/lib/utils/constants'

const STORAGE_KEY = 'match-madness-learning-progress'

export interface BatchProgress {
  currentBatchIndex: number
  completedBatches: number[]
}

/**
 * Splits items into batches of specified size
 * @param items - All items to split
 * @param batchSize - Size of each batch
 * @returns Array of batches
 */
export function createBatches(items: readonly GameItem[], batchSize: number = LEARNING_MODE.BATCH_SIZE): GameItem[][] {
  const batches: GameItem[][] = []

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize) as GameItem[])
  }

  return batches
}

/**
 * Gets a specific batch by index
 * @param items - All items
 * @param batchIndex - Index of batch to retrieve (0-based)
 * @returns Batch items
 */
export function getBatch(items: readonly GameItem[], batchIndex: number): GameItem[] {
  const batches = createBatches(items)
  return batches[batchIndex] || []
}

/**
 * Gets total number of batches
 * @param items - All items
 * @returns Total batch count
 */
export function getTotalBatches(items: readonly GameItem[]): number {
  return Math.ceil(items.length / LEARNING_MODE.BATCH_SIZE)
}

/**
 * Loads learning progress from localStorage
 * @returns Batch progress or default
 */
export function loadProgress(): BatchProgress {
  if (typeof window === 'undefined') {
    return { currentBatchIndex: 0, completedBatches: [] }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load learning progress:', error)
  }

  return { currentBatchIndex: 0, completedBatches: [] }
}

/**
 * Saves learning progress to localStorage
 * @param progress - Progress to save
 */
export function saveProgress(progress: BatchProgress): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save learning progress:', error)
  }
}

/**
 * Marks a batch as completed
 * @param batchIndex - Index of completed batch
 */
export function completeBatch(batchIndex: number): void {
  const progress = loadProgress()

  if (!progress.completedBatches.includes(batchIndex)) {
    progress.completedBatches.push(batchIndex)
  }

  // Move to next batch
  progress.currentBatchIndex = batchIndex + 1

  saveProgress(progress)
}

/**
 * Resets all learning progress
 */
export function resetProgress(): void {
  saveProgress({ currentBatchIndex: 0, completedBatches: [] })
}

/**
 * Checks if a batch is completed
 * @param batchIndex - Index to check
 * @returns True if completed
 */
export function isBatchCompleted(batchIndex: number): boolean {
  const progress = loadProgress()
  return progress.completedBatches.includes(batchIndex)
}

/**
 * Gets current batch index
 * @returns Current batch index
 */
export function getCurrentBatchIndex(): number {
  return loadProgress().currentBatchIndex
}

/**
 * Sets current batch index (for navigation)
 * @param batchIndex - Batch index to set
 */
export function setCurrentBatchIndex(batchIndex: number): void {
  const progress = loadProgress()
  progress.currentBatchIndex = batchIndex
  saveProgress(progress)
}
