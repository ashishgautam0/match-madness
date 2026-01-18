# Match Madness - Setup Instructions

This guide will help you install dependencies and run the application.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

Run the following command in your terminal:

```bash
npm install howler @capacitor/core @capacitor/cli @capacitor/haptics @types/howler
```

Or if you prefer yarn:

```bash
yarn add howler @capacitor/core @capacitor/cli @capacitor/haptics @types/howler
```

### 2. Development Server

Start the development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

To create a production build:

```bash
npm run build
```

This will generate a static export in the `out/` directory.

## Project Structure

```
match-madness/
├── app/                          # Next.js app directory
│   ├── (game)/                   # Game routes
│   │   ├── function-words/       # Function words game
│   │   └── layout.tsx            # Game layout
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   └── game/                     # Game components
│       ├── CompletionScreen.tsx  # Post-game screen
│       ├── GameBoard.tsx         # Main game board
│       ├── GameColumn.tsx        # Column component
│       ├── GameItem.tsx          # Individual item
│       ├── MatchGame.tsx         # Game orchestrator
│       └── ProgressBar.tsx       # Progress indicator
├── data/                         # Game data
│   └── function-words/
│       └── articles.ts           # French function words
├── lib/                          # Core logic
│   ├── game-engine/              # Pure game logic
│   │   ├── MatchGameEngine.ts    # Main engine
│   │   ├── RepetitionManager.ts  # Item repetition
│   │   ├── Shuffler.ts           # Shuffle algorithm
│   │   └── Validator.ts          # Match validation
│   ├── hooks/                    # React hooks
│   │   ├── useHaptics.ts         # Haptic feedback
│   │   ├── useMatchGame.ts       # Main game hook
│   │   └── useSound.ts           # Sound effects
│   ├── services/                 # Services
│   │   ├── HapticService.ts      # Haptic service
│   │   └── SoundService.ts       # Audio service
│   └── utils/                    # Utilities
│       ├── constants.ts          # Constants
│       └── platform.ts           # Platform detection
└── types/                        # TypeScript types
    └── game.ts                   # Game types

```

## Features

- **Match-Three Gameplay**: Match French words, English translations, and grammatical types
- **Spaced Repetition**: Items repeat intelligently throughout the session
- **Audio Feedback**: Sound effects for correct/incorrect matches (with beep placeholders)
- **Haptic Feedback**: Native haptic feedback on mobile devices
- **Progress Tracking**: Real-time progress and streak tracking
- **Statistics**: Post-game statistics including accuracy and time
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Type-Safe**: 100% TypeScript with strict mode enabled
- **Production-Ready**: Static export for easy deployment

## Game Configuration

Edit constants in `lib/utils/constants.ts`:

```typescript
ITEMS_PER_COLUMN = 6      // Items visible per column
TOTAL_MATCHES = 200       // Total matches to complete
MIN_REPETITIONS = 2       // Minimum item repetitions
MAX_REPETITIONS = 10      // Maximum item repetitions
```

## Adding More Words

To add more French words, edit `data/function-words/articles.ts`:

```typescript
{
  id: 'unique-id',
  french: 'le mot',
  english: 'the word',
  type: 'Masculine Singular',
}
```

## Troubleshooting

### TypeScript Errors

If you encounter TypeScript errors, try:

```bash
npm run build
```

This will show detailed error messages.

### Port Already in Use

If port 3000 is in use, specify a different port:

```bash
npm run dev -- -p 3001
```

## Next Steps

1. **Add Sound Files**: Replace beep placeholders with real audio files in `/public/sounds/`
2. **Capacitor Setup**: For native mobile apps, run `npx cap init` and `npx cap add [platform]`
3. **Testing**: Add unit tests using the included test examples
4. **More Content**: Add additional word categories in the `data/` folder

## Architecture Highlights

- **Pure Functional Core**: Game engine has zero React dependencies
- **Immutable State**: All state transitions are pure functions
- **Type Safety**: Exhaustive TypeScript types with strict mode
- **Service Pattern**: Singleton services for audio and haptics
- **Hook Pattern**: React hooks wrap pure logic
- **Component Composition**: Small, focused components

## Performance

- Lazy loading for Capacitor imports (SSR-safe)
- Optimized shuffling algorithm (Fisher-Yates)
- Efficient re-rendering with React keys
- Minimal bundle size with tree-shaking

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
