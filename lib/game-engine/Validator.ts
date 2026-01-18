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
  console.log('  French:', french.french, '| ID:', french.id, '| InstanceID:', french.instanceId)
  console.log('  English:', english.english, '| ID:', english.id, '| InstanceID:', english.instanceId)
  console.log('  Type:', type.type, '| ID:', type.id, '| InstanceID:', type.instanceId)

  const isValid = french.id === english.id && english.id === type.id
  console.log('  ✅ Match Result:', isValid ? 'VALID' : '❌ INVALID')
  console.log('  ID Comparison:', `${french.id} === ${english.id} === ${type.id}`)

  // All three must have the same ID (they're the same item)
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
