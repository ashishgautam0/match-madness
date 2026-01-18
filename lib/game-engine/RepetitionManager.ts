import type { GameItem } from '@/types/game'
import { shuffle } from './Shuffler'

/**
 * Generates a pool of items with controlled repetition
 * @remarks Implements spaced repetition within a single session
 */

/**
 * Calculates how many times each item should appear
 * @param itemCount - Number of unique items
 * @param totalMatches - Target total matches
 * @param minReps - Minimum repetitions per item
 * @param maxReps - Maximum repetitions per item
 * @returns Array of repetition counts per item
 */
function calculateRepetitions(
  itemCount: number,
  totalMatches: number,
  minReps: number,
  maxReps: number
): number[] {
  const repetitions: number[] = []
  let remaining = totalMatches

  // First pass: assign minimum repetitions
  for (let i = 0; i < itemCount; i++) {
    repetitions.push(minReps)
    remaining -= minReps
  }

  // Second pass: distribute remaining matches
  let currentIndex = 0
  while (remaining > 0) {
    // Can this item take more repetitions?
    if (repetitions[currentIndex] < maxReps) {
      repetitions[currentIndex]++
      remaining--
    }

    currentIndex = (currentIndex + 1) % itemCount
  }

  return repetitions
}

/**
 * Generates a pool of items with specified repetitions
 * @param items - Unique items to include
 * @param total - Total number of items in pool (target matches)
 * @param minRepetitions - Minimum times each item appears
 * @param maxRepetitions - Maximum times each item appears
 * @returns Shuffled pool of items
 * @throws Error if impossible to meet constraints
 */
export function generatePool(
  items: readonly GameItem[],
  total: number,
  minRepetitions: number,
  maxRepetitions: number
): GameItem[] {
  // Validation
  if (items.length === 0) {
    throw new Error('Cannot generate pool from empty items array')
  }

  if (total < items.length * minRepetitions) {
    throw new Error(
      `Impossible to meet minimum repetitions: ` +
      `need ${items.length * minRepetitions} but total is ${total}`
    )
  }

  if (total > items.length * maxRepetitions) {
    throw new Error(
      `Impossible to meet maximum repetitions: ` +
      `can only support ${items.length * maxRepetitions} but total is ${total}`
    )
  }

  // Calculate repetitions per item
  const repetitions = calculateRepetitions(
    items.length,
    total,
    minRepetitions,
    maxRepetitions
  )

  // Build pool
  const pool: GameItem[] = []
  items.forEach((item, index) => {
    const count = repetitions[index]
    for (let i = 0; i < count; i++) {
      // Create a new object instance for each repetition with unique instanceId
      // This ensures each card has a unique identifier
      pool.push({
        ...item,
        instanceId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })
    }
  })

  // Shuffle to distribute repetitions
  return shuffle(pool)
}

/**
 * Validates that a pool meets repetition constraints
 * @param pool - Pool to validate
 * @param uniqueItems - Original unique items
 * @param minReps - Minimum repetitions
 * @param maxReps - Maximum repetitions
 * @returns True if valid
 * @internal Used for validation
 */
export function validatePool(
  pool: readonly GameItem[],
  uniqueItems: readonly GameItem[],
  minReps: number,
  maxReps: number
): boolean {
  // Count occurrences of each item
  const counts = new Map<string, number>()

  pool.forEach(item => {
    counts.set(item.id, (counts.get(item.id) || 0) + 1)
  })

  // Verify each unique item
  for (const item of uniqueItems) {
    const count = counts.get(item.id) || 0
    if (count < minReps || count > maxReps) {
      return false
    }
  }

  return true
}
