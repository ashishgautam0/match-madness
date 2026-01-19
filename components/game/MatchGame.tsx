'use client'

import { useEffect, useState } from 'react'
import { useMatchGame } from '@/lib/hooks/useMatchGame'
import { GameBoard } from './GameBoard'
import { GameContainer } from './GameContainer'
import { CompletionScreen } from './CompletionScreen'
import type { GameConfig } from '@/types/game'

interface MatchGameProps {
  config: GameConfig
  onComplete?: () => void
  showNavbar?: boolean
}

/**
 * Main game component - orchestrates entire game flow
 */
export function MatchGame({ config, onComplete, showNavbar = false }: MatchGameProps) {
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

  // Call onComplete when game finishes
  useEffect(() => {
    if (game.isComplete && onComplete) {
      onComplete()
    }
  }, [game.isComplete, onComplete])

  // Show loading state during SSR/initial hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-900 py-8 flex items-center justify-center">
        <div className="text-lg text-neutral-400">Loading game...</div>
      </div>
    )
  }

  if (game.isComplete && !onComplete) {
    // Only show completion screen if no onComplete callback (practice mode)
    return <CompletionScreen stats={game.stats} onPlayAgain={game.reset} />
  }

  return (
    <GameContainer showNavbar={showNavbar}>
      <GameBoard
        state={game.state}
        progress={game.progress}
        onSelectItem={game.selectItem}
        animatingSelection={game.animatingSelection}
        animationType={game.animationType}
        checkMode={game.checkMode}
        onToggleCheckMode={game.toggleCheckMode}
        hiddenColumn={config.hiddenColumn}
      />
    </GameContainer>
  )
}
