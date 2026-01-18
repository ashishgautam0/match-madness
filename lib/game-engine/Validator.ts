import type { Selection, GameItem } from '@/types/game'
import { isSelectionComplete } from '@/types/game'

/**
 * Validates if a selection represents a correct match
 * @remarks A match is correct when all three selections reference the same GameItem
 */

/**
 * Checks if selection is a valid match
 * @param selection - Current user selection
 * @returns True if all three items match
 */
export function validateMatch(selection: Selection): boolean {
  // Must have all three selections
  if (!isSelectionComplete(selection)) {
    return false
  }

  // TypeScript knows these are non-null now due to type guard
  const { french, english, type } = selection as {
    french: GameItem
    english: GameItem
    type: GameItem
  }

  // Debug logging
  console.log('🔍 VALIDATION CHECK:')
  console.log('  Selected French word:', french.french)
  console.log('    - English translation:', french.english)
  console.log('    - Grammatical type:', french.type)
  console.log('  Selected English card:', english.english)
  console.log('  Selected Type card:', type.type)

  // Check if the selected English matches the French word's translation
  const englishMatches = french.english === english.english
  console.log('  English matches?', englishMatches, `(${french.english} === ${english.english})`)

  // Check if the selected Type matches the French word's type
  const typeMatches = french.type === type.type
  console.log('  Type matches?', typeMatches, `(${french.type} === ${type.type})`)

  const isValid = englishMatches && typeMatches
  console.log('  ✅ Match Result:', isValid ? 'VALID' : '❌ INVALID')

  // Match is valid if the English and Type selections match the French word's properties
  return isValid
}

/**
 * Validates if a potential selection would create a match
 * @param current - Current selection
 * @param newItem - Item about to be added
 * @param column - Column where item will be added
 * @returns True if adding this item would complete a valid match
 * @internal Used for UI feedback (show green border before click)
 */
export function wouldCompleteMatch(
  current: Selection,
  newItem: GameItem,
  column: 'french' | 'english' | 'type'
): boolean {
  // Create hypothetical selection
  const hypothetical: Selection = {
    ...current,
    [column]: newItem,
  }

  return validateMatch(hypothetical)
}

/**
 * Gets the item ID from a selection if all match, null otherwise
 * @param selection - Selection to check
 * @returns Item ID if valid match, null otherwise
 */
export function getMatchedItemId(selection: Selection): string | null {
  return validateMatch(selection) ? selection.french!.id : null
}

/**
 * Validates which pairs in the selection match
 * @param selection - Current user selection
 * @returns Object indicating which pairs match (french-english, french-type, english-type)
 */
export function validatePartialMatches(selection: Selection): {
  frenchEnglishMatch: boolean
  frenchTypeMatch: boolean
  englishTypeMatch: boolean
  perfectMatch: boolean
  anyMatch: boolean
} {
  // Must have all three selections
  if (!isSelectionComplete(selection)) {
    return {
      frenchEnglishMatch: false,
      frenchTypeMatch: false,
      englishTypeMatch: false,
      perfectMatch: false,
      anyMatch: false,
    }
  }

  const { french, english, type } = selection as {
    french: GameItem
    english: GameItem
    type: GameItem
  }

  // Check each pair
  const frenchEnglishMatch = french.english === english.english
  const frenchTypeMatch = french.type === type.type
  // English and Type match if they both belong to the same source word
  const englishTypeMatch = english.english === french.english && type.type === french.type

  const perfectMatch = frenchEnglishMatch && frenchTypeMatch
  const anyMatch = frenchEnglishMatch || frenchTypeMatch

  console.log('🔍 PARTIAL MATCH VALIDATION:')
  console.log('  French-English match:', frenchEnglishMatch)
  console.log('  French-Type match:', frenchTypeMatch)
  console.log('  English-Type match:', englishTypeMatch)
  console.log('  Perfect match:', perfectMatch)
  console.log('  Any match:', anyMatch)

  return {
    frenchEnglishMatch,
    frenchTypeMatch,
    englishTypeMatch,
    perfectMatch,
    anyMatch,
  }
}
