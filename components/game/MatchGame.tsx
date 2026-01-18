'use client'

import { useEffect, useState } from 'react'
import { useMatchGame } from '@/lib/hooks/useMatchGame'
import { GameBoard } from './GameBoard'
import { CompletionScreen } from './CompletionScreen'
import type { GameConfig } from '@/types/game'

interface MatchGameProps {
  config: GameConfig
}

/**
 * Main game component - orchestrates entire game flow
 */
export function MatchGame({ config }: MatchGameProps) {
  const [mounted, setMounted] = useState(false)
  const game = useMatchGame(config)

  // Ensure client-side only rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Log progress for debugging
  useEffect(() => {
    console.log('Game progress:', game.progress)
  }, [game.progress])

  // Show loading state during SSR/initial hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-900 py-8 flex items-center justify-center">
        <div className="text-lg text-neutral-400">Loading game...</div>
      </div>
    )
  }

  if (game.isComplete) {
    return <CompletionScreen stats={game.stats} onPlayAgain={game.reset} />
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-8">
      <GameBoard
        state={game.state}
        progress={game.progress}
        onSelectItem={game.selectItem}
        showWrongAnimation={game.showWrongAnimation}
        showCorrectAnimation={game.showCorrectAnimation}
      />
    </div>
  )
}
