/**
 * Game configuration constants
 * @remarks All values are frozen to prevent mutation
 */

/**
 * Number of items visible in each column at any time
 */
export const ITEMS_PER_COLUMN = 6 as const

/**
 * Total number of matches required to complete a game session
 * @remarks With 297 words × 4-10 repetitions = variable length game
 * Each word appears 4-10 times for strong learning reinforcement
 */
export const TOTAL_MATCHES = 2970 as const // 297 words × 10 repetitions

/**
 * Minimum times an item must appear in a session
 * @remarks Set to 4 to ensure strong exposure to each word
 */
export const MIN_REPETITIONS = 4 as const

/**
 * Maximum times an item can appear in a session
 * @remarks Set to 10 to allow variable repetition for challenging words
 */
export const MAX_REPETITIONS = 10 as const

/**
 * Audio configuration
 */
export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 0.7,
  FADE_DURATION: 100, // ms
  PRELOAD_TIMEOUT: 5000, // ms
} as const

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  SLIDE_IN: 300,
  POP: 200,
  SHAKE: 400,
  FADE: 150,
} as const

/**
 * Streak milestones that trigger special sounds/effects
 */
export const STREAK_MILESTONES = [10, 25, 50, 100] as const

/**
 * Haptic feedback configuration
 */
export const HAPTIC_CONFIG = {
  ENABLED_BY_DEFAULT: true,
  COOLDOWN_MS: 50, // Prevent haptic spam
} as const

/**
 * Sound file paths
 * @remarks Paths relative to /public directory
 */
export const SOUND_PATHS = {
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.mp3',
  complete: '/sounds/correct.wav', // Reuse correct sound for now
  'streak-10': '/sounds/correct.wav', // Reuse correct sound for now
  'streak-25': '/sounds/correct.wav', // Reuse correct sound for now
  select: '/sounds/correct.wav', // Reuse correct sound for now
} as const

/**
 * Color palette matching Tailwind config
 */
export const COLORS = {
  primary: '#58CC02',
  error: '#FF4B4B',
  success: '#58CC02',
  neutral: '#F7F7F7',
} as const

/**
 * Responsive breakpoints (matches Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const
