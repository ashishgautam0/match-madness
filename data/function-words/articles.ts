import type { GameItem } from '@/types/game'

/**
 * French function words dataset - Articles and common words
 * @remarks 12 items for initial testing, easily expandable
 */
export const functionWords: readonly GameItem[] = [
  // Definite Articles
  {
    id: 'def-m-sing',
    french: 'le',
    english: 'the',
    type: 'Masculine Singular',
  },
  {
    id: 'def-f-sing',
    french: 'la',
    english: 'the',
    type: 'Feminine Singular',
  },
  {
    id: 'def-plural',
    french: 'les',
    english: 'the',
    type: 'Plural',
  },
  {
    id: 'def-vowel',
    french: "l'",
    english: 'the',
    type: 'Both Genders',
  },

  // Indefinite Articles
  {
    id: 'indef-m-sing',
    french: 'un',
    english: 'a/an',
    type: 'Masculine Singular',
  },
  {
    id: 'indef-f-sing',
    french: 'une',
    english: 'a/an',
    type: 'Feminine Singular',
  },
  {
    id: 'indef-plural',
    french: 'des',
    english: 'some',
    type: 'Plural',
  },

  // Prepositions
  {
    id: 'prep-de',
    french: 'de',
    english: 'of/from',
    type: 'Both Genders',
  },
  {
    id: 'prep-a',
    french: 'à',
    english: 'to/at',
    type: 'Both Genders',
  },

  // Conjunctions
  {
    id: 'conj-et',
    french: 'et',
    english: 'and',
    type: 'Both Genders',
  },
  {
    id: 'conj-ou',
    french: 'ou',
    english: 'or',
    type: 'Both Genders',
  },
  {
    id: 'conj-mais',
    french: 'mais',
    english: 'but',
    type: 'Both Genders',
  },
] as const
