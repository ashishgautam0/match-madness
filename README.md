# 🎮 Match Madness - French Language Learning Game

A production-grade, type-safe language learning game built with Next.js 14, TypeScript, and Tailwind CSS. Master French through engaging match-three gameplay with Duolingo-style mechanics.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🎯 Match-Three Gameplay**: Match French words, English translations, and grammatical types
- **🔄 Spaced Repetition**: Intelligent item repetition for better learning retention
- **🔊 Audio Feedback**: Sound effects for matches and milestones
- **📱 Haptic Feedback**: Native haptic feedback on mobile devices
- **📊 Progress Tracking**: Real-time progress bars and streak tracking
- **📈 Statistics**: Detailed post-game statistics (accuracy, time, averages)
- **🎨 Responsive Design**: Optimized for desktop, tablet, and mobile
- **⚡ Type-Safe**: 100% TypeScript with strict mode enabled
- **🚀 Production-Ready**: Static export for easy deployment

## 🏗️ Architecture

This project follows a **layered architecture** for maximum testability and maintainability:

```
Layer 1: Types & Constants (Zero dependencies)
Layer 2: Pure Logic (Game Engine - Framework agnostic)
Layer 3: Data (Content definitions)
Layer 4: Services (Side effects: Audio, Haptics)
Layer 5: React Hooks (React integration layer)
Layer 6: Components (UI components)
Layer 7: Pages (Routes)
Layer 8: Configuration (TypeScript, Tailwind, Next.js)
```

### Key Design Principles

- **Pure Functional Core**: Game engine has zero React dependencies
- **Immutable State**: All state transitions use pure functions
- **Type Safety**: Exhaustive TypeScript types with literal unions
- **Service Pattern**: Singleton services for platform features
- **Testable**: Every layer can be tested independently

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

**Option 1: Using the install script (Windows)**
```bash
install.bat
```

**Option 2: Using the install script (Mac/Linux)**
```bash
chmod +x install.sh
./install.sh
```

**Option 3: Manual installation**
```bash
# Dependencies are already installed!
# Just start the dev server:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎮 How to Play

1. **Select Items**: Click one item from each column (French, English, Type)
2. **Make Matches**: Match the same word across all three columns
3. **Track Progress**: Watch your progress bar and streak counter
4. **Complete**: Finish all 200 matches to see your statistics

## 📁 Project Structure

```
match-madness/
├── app/                          # Next.js app directory
│   ├── (game)/function-words/    # Function words game route
│   ├── globals.css               # Global styles + animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/game/              # Game UI components
│   ├── CompletionScreen.tsx      # Post-game statistics
│   ├── GameBoard.tsx             # Main game board orchestrator
│   ├── GameColumn.tsx            # Single column with items
│   ├── GameItem.tsx              # Individual clickable item
│   ├── MatchGame.tsx             # Top-level game component
│   └── ProgressBar.tsx           # Progress indicator
│
├── data/function-words/          # Game content
│   └── articles.ts               # 12 French function words
│
├── lib/
│   ├── game-engine/              # Pure game logic (framework-agnostic)
│   │   ├── MatchGameEngine.ts    # Core game state machine
│   │   ├── RepetitionManager.ts  # Spaced repetition logic
│   │   ├── Shuffler.ts           # Fisher-Yates shuffle
│   │   └── Validator.ts          # Match validation
│   │
│   ├── hooks/                    # React hooks
│   │   ├── useHaptics.ts         # Haptic feedback hook
│   │   ├── useMatchGame.ts       # Main game logic hook
│   │   └── useSound.ts           # Audio management hook
│   │
│   ├── services/                 # Singleton services
│   │   ├── HapticService.ts      # Haptic feedback service
│   │   └── SoundService.ts       # Audio playback service
│   │
│   └── utils/                    # Utilities
│       ├── constants.ts          # Game constants
│       └── platform.ts           # Platform detection (SSR-safe)
│
└── types/                        # TypeScript definitions
    └── game.ts                   # Game type definitions
```

## ⚙️ Configuration

### Game Settings

Edit [lib/utils/constants.ts](lib/utils/constants.ts) to customize gameplay:

```typescript
export const ITEMS_PER_COLUMN = 6      // Items visible per column
export const TOTAL_MATCHES = 200       // Total matches to win
export const MIN_REPETITIONS = 2       // Min item appearances
export const MAX_REPETITIONS = 10      // Max item appearances
```

### Adding Content

Add new words in [data/function-words/articles.ts](data/function-words/articles.ts):

```typescript
{
  id: 'unique-id',
  french: 'le mot',
  english: 'the word',
  type: 'Masculine Singular',
}
```

Supported grammatical types:
- `'Masculine Singular'`
- `'Feminine Singular'`
- `'Plural'`
- `'Both Genders'`

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production (static export)
npm run start    # Start production server
npm run lint     # Run ESLint
```

### TypeScript Configuration

The project uses **strict TypeScript mode** with all strict options enabled:
- `strictNullChecks`
- `noUnusedLocals`
- `noUnusedParameters`
- `noImplicitReturns`
- `noFallthroughCasesInSwitch`

## 🚀 Deployment

### Static Export (Recommended)

The app is configured for static export:

```bash
npm run build
```

Deploy the `out/` directory to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Capacitor (Mobile Apps)

For native iOS/Android apps:

```bash
npx cap init
npx cap add ios
npx cap add android
npm run build
npx cap sync
```

See [SETUP.md](SETUP.md) for detailed instructions.

## 🎨 Customization

### Colors

Edit [tailwind.config.ts](tailwind.config.ts) to change the color scheme:

```typescript
colors: {
  primary: {
    DEFAULT: '#58CC02',  // Duolingo green
    dark: '#4CAE00',
    light: '#6FE012',
  },
}
```

### Animations

Durations configured in [lib/utils/constants.ts](lib/utils/constants.ts):

```typescript
export const ANIMATION_DURATION = {
  SLIDE_IN: 300,
  POP: 200,
  SHAKE: 400,
}
```

## 📊 Performance

- **Bundle Size**: Optimized with tree-shaking
- **Rendering**: Efficient React keys prevent unnecessary re-renders
- **Algorithm**: O(n) Fisher-Yates shuffle
- **SSR-Safe**: All platform-specific code lazy-loads

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

MIT License - feel free to use this for your own language learning projects!

## 🙏 Acknowledgments

- Inspired by Duolingo's gamification approach
- Uses Google L8 Principal Engineer architecture patterns
- Built with production-grade practices and zero technical debt

---

**Built with ❤️ for language learners everywhere**
