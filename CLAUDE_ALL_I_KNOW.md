# Claude's Knowledge Base - Match Madness

**Last Updated:** 2026-01-18
**Project:** French Vocabulary Matching Game

---

## Project Overview

Match Madness is a Next.js-based French vocabulary learning game. Users match French words with their English translations and grammatical types through an interactive three-column matching interface.

### Tech Stack
- **Framework:** Next.js 16.1.1 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Audio:** Howler.js
- **Speech:** Web Speech API
- **Deployment:** Vercel (auto-deploy from GitHub)

### Repository
- **GitHub:** ashishgautam0/match-madness
- **Branch:** master
- **Vercel:** Connected for automatic deployments

---

## Project Architecture

### Directory Structure
```
match-madness/
├── app/
│   ├── (game)/
│   │   └── learning/
│   │       └── page.tsx          # Learning mode with study/test phases
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page with mode selection
├── components/
│   ├── game/
│   │   ├── GameBoard.tsx         # Main game board (3 columns)
│   │   ├── GameColumn.tsx        # Single column container
│   │   ├── GameItem.tsx          # Individual card with animations
│   │   ├── ProgressBar.tsx       # Dual progress tracking
│   │   └── MatchGame.tsx         # Game orchestrator
│   └── learning/
│       ├── StudyTable.tsx        # Vocabulary study table
│       └── ModeSelector.tsx      # Mode selection UI
├── lib/
│   ├── game-engine/
│   │   ├── MatchGameEngine.ts    # Core game logic
│   │   ├── RepetitionManager.ts  # Spaced repetition system
│   │   ├── Shuffler.ts           # Fisher-Yates shuffle
│   │   └── Validator.ts          # Match validation (NEW: partial matching)
│   ├── batch/
│   │   └── BatchManager.ts       # Learning mode batch management
│   ├── hooks/
│   │   ├── useMatchGame.ts       # Main game hook (MODIFIED: per-column animations)
│   │   ├── useSound.ts           # Sound management (FIXED: removed preload check)
│   │   ├── usePronunciation.ts   # TTS pronunciation
│   │   └── useHaptics.ts         # Vibration feedback
│   └── services/
│       └── SoundService.ts       # Audio service (FIXED: on-demand loading)
├── data/
│   └── function-words/
│       └── articles.ts           # 297 French function words
├── types/
│   └── game.ts                   # TypeScript type definitions
└── tailwind.config.ts            # FIXED: Neutral color palette
```

---

## Recent Session Summary (2026-01-18)

### Major Features Implemented

#### 1. Atomized Matching System
**Problem:** All-or-nothing matching wasn't educational
**Solution:** Show green on matching pairs, red on non-matching columns

**Files Modified:**
- `lib/game-engine/Validator.ts` - Added `validatePartialMatches()` function
- `lib/hooks/useMatchGame.ts` - Per-column animation states
- `components/game/GameBoard.tsx` - Updated interface for per-column animations
- `components/game/GameColumn.tsx` - Passes column-specific animation types

**Logic:**
```typescript
// Validator.ts:86-133
export function validatePartialMatches(selection: Selection): {
  frenchEnglishMatch: boolean    // French word matches English translation
  frenchTypeMatch: boolean        // French word matches Type
  englishTypeMatch: boolean       // English and Type both belong to French
  perfectMatch: boolean           // All 3 match (only then advance)
  anyMatch: boolean              // At least 1 pair matches
}

// Game only advances on perfectMatch
// Partial matches show feedback: green on correct pairs, red on wrong
```

**Animation States Changed:**
```typescript
// OLD: Single animation type for all columns
animationType: 'correct' | 'wrong' | null

// NEW: Per-column animation types
animationType: {
  french: 'correct' | 'wrong' | null
  english: 'correct' | 'wrong' | null
  type: 'correct' | 'wrong' | null
}
```

#### 2. Learning Mode Improvements
**Problem:** Page loaded last visited batch, causing confusion
**Solution:** Always start at batch 1 with direct navigation input

**Files Modified:**
- `app/(game)/learning/page.tsx`

**Changes:**
- Removed localStorage progress loading on mount
- Added `batchInput` state for navigation
- Added input field: `<input type="number" />` for direct batch jumping
- Previous/Next buttons sync with input field
- Always starts at batch 1 (index 0)

**Batch System:**
- 297 words total
- 15 words per batch = 20 batches total
- Batch 1: words[0-14], Batch 2: words[15-29], etc.
- Sequential, non-shuffled from JSON

#### 3. Compact Study Table
**Problem:** Table too tall for display
**Solution:** Reduced all spacing and font sizes

**Files Modified:**
- `components/learning/StudyTable.tsx`

**Changes:**
- Padding: `py-3.5` → `py-2`, `px-4` → `px-3`
- Font sizes: `text-base` → `text-sm`, `text-2xl` → `text-xl`
- Spacing: `space-y-6` → `space-y-3`
- Type badges: Added `whitespace-nowrap` for single-line display

#### 4. Sound System Fix
**Problem:** Inconsistent audio - silent on first few matches
**Solution:** Removed preload check, added on-demand loading

**Files Modified:**
- `lib/hooks/useSound.ts`
- `lib/services/SoundService.ts`

**Changes:**
```typescript
// useSound.ts - Removed blocking preload check
const play = useCallback((type: SoundType, volume?: number) => {
  soundService.play(type, volume)  // No more isPreloaded check
}, [])

// SoundService.ts - Added on-demand loading
public play(type: SoundType, volumeOverride?: number): void {
  let sound = this.sounds.get(type)

  if (!sound) {
    // Load on-demand if not preloaded
    sound = new Howl({
      src: [SOUND_PATHS[type]],
      onload: () => sound!.play()  // Play when ready
    })
    return
  }

  sound.play()
}
```

#### 5. UI/UX Polish
**Problem:** Progress bars invisible, layout shifts
**Solution:** Fixed colors, removed artificial minimums, reserved space

**Files Modified:**
- `tailwind.config.ts` - Fixed neutral-800 from white to dark gray
- `components/game/ProgressBar.tsx` - Made bars proportional, reserved streak space

**Before:**
```typescript
neutral: {
  800: '#FFFFFF',  // BUG: Was white!
}
```

**After:**
```typescript
neutral: {
  800: '#252B37',  // Proper dark gray
}
```

---

## Game Mechanics

### Core Gameplay Loop
1. **Display:** 3 columns (French, English, Type) with 6 items each
2. **Selection:** User clicks one item from each column
3. **Validation:** Check matches with `validatePartialMatches()`
4. **Feedback:**
   - Green animation on matching pairs
   - Red animation on non-matching columns
   - Sound effects (correct/wrong)
   - Haptic feedback
5. **Advance:** Only on perfect match (all 3 correct)
6. **Refill:** Replace matched items with new ones from pool
7. **Progress:** Track unique words learned and total matches

### Spaced Repetition
- Min repetitions: 2 times per word
- Max repetitions: 8 times per word
- Ensures all words appear multiple times for retention

### Match Validation Logic
```typescript
// French-English Match: french.english === english.english
// French-Type Match: french.type === type.type
// Perfect Match: Both French-English AND French-Type match
// Only perfect matches advance the game
```

---

## Key Constants

### Learning Mode
```typescript
LEARNING_MODE = {
  BATCH_SIZE: 15,                      // Words per batch
  MIN_REPETITIONS_PER_BATCH: 2,        // Minimum times to see word
  MAX_REPETITIONS_PER_BATCH: 8,        // Maximum times to see word
}
```

### Game Settings
```typescript
ITEMS_PER_COLUMN: 6                    // Items visible per column
STREAK_MILESTONES: [10, 25, 50, 100]  // Bonus sound effects
```

### Audio Config
```typescript
AUDIO_CONFIG = {
  DEFAULT_VOLUME: 0.7,
  PRELOAD_TIMEOUT: 5000,
}

SOUND_PATHS = {
  'correct': '/sounds/correct.mp3',
  'wrong': '/sounds/wrong.mp3',
  'complete': '/sounds/complete.mp3',
  'streak-10': '/sounds/streak-10.mp3',
  'streak-25': '/sounds/streak-25.mp3',
  'select': '/sounds/select.mp3',
}
```

---

## Data Structure

### GameItem
```typescript
interface GameItem {
  id: string              // Unique identifier (e.g., 'art-1')
  french: string          // French word (e.g., 'le')
  english: string         // English translation (e.g., 'the')
  type: string            // Grammatical type (e.g., 'Masculine Singular')
  instanceId?: string     // Unique per card instance (for React keys)
}
```

### Game State
```typescript
interface GameState {
  visibleItems: {
    french: GameItem[]
    english: GameItem[]
    type: GameItem[]
  }
  selection: Selection    // Current user selection
  isComplete: boolean     // All words learned?
}

interface Selection {
  french: GameItem | null
  english: GameItem | null
  type: GameItem | null
}
```

### Progress Tracking
```typescript
interface GameProgress {
  completed: number              // Matches completed
  total: number                  // Total matches needed
  percentage: number             // Match completion %
  streak: number                 // Current streak
  uniqueWordsLearned: number     // Unique words mastered
  totalUniqueWords: number       // Total unique words
  uniqueWordsPercentage: number  // Unique word completion %
}
```

---

## Common Issues & Solutions

### Issue 1: Colors Not Showing
**Symptom:** White text on white background
**Cause:** Tailwind neutral-800 was set to '#FFFFFF'
**Solution:** Updated neutral palette in tailwind.config.ts

### Issue 2: Progress Bars Invisible
**Symptom:** No progress bars visible
**Cause:** Same as Issue 1 (white background)
**Solution:** Fixed neutral colors, made bars proportional

### Issue 3: Sounds Don't Play
**Symptom:** First few matches are silent
**Cause:** Strict preload check blocked playback
**Solution:** Removed check, added on-demand loading

### Issue 4: Learning Page Shows Wrong Batch
**Symptom:** Always loads last visited batch
**Cause:** localStorage progress loading on mount
**Solution:** Always start at batch 1, added input for navigation

### Issue 5: Type Text Wrapping
**Symptom:** "Feminine Singular" wraps to 2 lines
**Cause:** No whitespace control
**Solution:** Added `whitespace-nowrap` class

---

## Git Workflow

### Commit Message Format
```
Title: Brief description (max 72 chars)

Major Features:
- Feature 1 description
- Feature 2 description

Changes:
- Specific change 1
- Specific change 2

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Recent Commits
1. **26ff721** - Implement atomized matching and learning mode improvements
2. **9ffb07a** - Fix inconsistent sound playback issues

---

## Development Tips

### Running Locally
```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
```

### File Editing Guidelines
1. **Always read file first** before editing (use Read tool)
2. **Use Edit tool** for existing files, never Write
3. **Prefer editing** over creating new files
4. **Match indentation** exactly from Read output
5. **Test changes** after modifications

### Code Style
- Use TypeScript strict mode
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Keep functions under 50 lines when possible
- Add JSDoc comments for public APIs

---

## User Preferences

### Interaction Style
- Direct, concise communication
- No emojis unless requested
- Focus on technical accuracy
- Professional, objective tone
- Always commit to GitHub when requested
- Use markdown for formatting

### Workflow
- Make changes incrementally
- Commit frequently with descriptive messages
- Push to GitHub (auto-deploys to Vercel)
- Test thoroughly before committing

---

## Important Implementation Details

### Per-Column Animation System
The atomized matching system required changing from a single animation state to per-column states. This affected multiple files:

1. **Validator.ts:** Added `validatePartialMatches()` to check each pair independently
2. **useMatchGame.ts:** Changed animation state from single to object with 3 properties
3. **GameBoard.tsx:** Updated props interface to accept per-column animations
4. **GameColumn.tsx:** Receives and passes column-specific animation type

### Sound Loading Strategy
Two-tier approach:
1. **Preload on mount:** Attempts to load all sounds immediately
2. **On-demand fallback:** If preload fails or incomplete, loads on first play

This handles browser autoplay restrictions gracefully.

### Batch Consistency
Batches are **always sequential** from the JSON file:
- Batch 1: items[0-14]
- Batch 2: items[15-29]
- Never shuffled or randomized
- Implemented in `BatchManager.createBatches()` using `items.slice()`

---

## Future Considerations

### Known Limitations
1. Only 297 words currently (function words only)
2. No progress tracking across sessions (removed localStorage)
3. No user accounts or cloud sync
4. Single language pair (French-English only)

### Potential Enhancements
- Add more word categories (verbs, nouns, adjectives)
- Implement spaced repetition scheduling algorithm
- Add difficulty levels
- Multiplayer mode
- Progress analytics and charts
- Multiple language support
- Custom word lists

---

## Contact & Resources

**Repository:** https://github.com/ashishgautam0/match-madness
**Model:** Claude Sonnet 4.5
**Last Session:** 2026-01-18

---

## Quick Reference Commands

### Git
```bash
git status                          # Check changes
git add .                           # Stage all
git commit -m "message"             # Commit
git push origin master              # Push to GitHub
```

### File Operations
```bash
# Use Read tool for reading
# Use Edit tool for modifications
# Use Write tool only for new files
# Use Glob tool for finding files
# Use Grep tool for searching content
```

---

**End of Knowledge Base**
