'use client'

import type { GameStats } from '@/types/game'

interface CompletionScreenProps {
  stats: GameStats
  onPlayAgain: () => void
}

/**
 * Game completion screen with statistics
 */
export function CompletionScreen({ stats, onPlayAgain }: CompletionScreenProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-8 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8 space-y-6">
        {/* Celebration */}
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pop">🎉</div>
          <h2 className="text-3xl font-bold text-white">
            Félicitations!
          </h2>
          <p className="text-neutral-300">
            You&apos;ve completed all {stats.totalMatches} matches!
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-neutral-700 pb-2">
            Your Stats
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-success/20 border border-success/30 rounded-lg">
              <div className="text-3xl font-bold text-success">
                {stats.accuracy}%
              </div>
              <div className="text-sm text-neutral-400">Accuracy</div>
            </div>

            <div className="text-center p-4 bg-primary/20 border border-primary/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {formatTime(stats.timeSpent)}
              </div>
              <div className="text-sm text-neutral-400">Time</div>
            </div>

            <div className="text-center p-4 bg-neutral-700 border border-neutral-600 rounded-lg">
              <div className="text-2xl font-bold text-neutral-200">
                {stats.correctMatches}
              </div>
              <div className="text-sm text-neutral-400">Correct</div>
            </div>

            <div className="text-center p-4 bg-neutral-700 border border-neutral-600 rounded-lg">
              <div className="text-2xl font-bold text-neutral-200">
                {stats.wrongAttempts}
              </div>
              <div className="text-sm text-neutral-400">Errors</div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-700">
            <div className="text-center">
              <div className="text-lg font-medium text-neutral-300">
                Avg. per match
              </div>
              <div className="text-2xl font-bold text-primary">
                {stats.averageTimePerMatch.toFixed(1)}s
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
