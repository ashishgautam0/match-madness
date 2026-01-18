/**
 * Fisher-Yates (Knuth) Shuffle Algorithm
 * @remarks Provides uniform random distribution
 * Time Complexity: O(n)
 * Space Complexity: O(n) - creates new array
 */

/**
 * Shuffles an array without mutating the original
 * @param array - Array to shuffle
 * @returns New shuffled array
 * @example
 * const original = [1, 2, 3, 4, 5]
 * const shuffled = shuffle(original)
 * // original is unchanged, shuffled has same elements in random order
 */
export function shuffle<T>(array: readonly T[]): T[] {
  // Handle edge cases
  if (array.length === 0) return []
  if (array.length === 1) return [...array]

  // Create mutable copy
  const result = [...array]

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

/**
 * Shuffles array with a seeded random function (for testing)
 * @param array - Array to shuffle
 * @param seed - Random seed for deterministic results
 * @returns Shuffled array
 * @internal Used for unit testing
 */
export function shuffleWithSeed<T>(
  array: readonly T[],
  seed: number
): T[] {
  // Mulberry32 PRNG - simple and fast
  let state = seed
  const random = (): number => {
    state = (state + 0x6D2B79F5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

/**
 * Validates that shuffle doesn't lose or duplicate elements
 * @param original - Original array
 * @param shuffled - Shuffled array
 * @returns True if arrays contain same elements
 * @internal Used for validation
 */
export function validateShuffle<T>(
  original: readonly T[],
  shuffled: readonly T[]
): boolean {
  if (original.length !== shuffled.length) return false

  const originalSorted = [...original].sort()
  const shuffledSorted = [...shuffled].sort()

  return originalSorted.every((item, index) => item === shuffledSorted[index])
}
