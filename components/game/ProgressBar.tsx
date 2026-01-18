'use client'

import type { GameProgress } from '@/types/game'

interface ProgressBarProps {
  progress: GameProgress
}

/**
 * Progress bar showing completion status with dual tracking
 */
export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full space-y-3">
      {/* Unique Words Progress */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-300">
            Unique Words Learned
          </span>
          <span className="text-sm font-medium text-primary">
            {progress.uniqueWordsLearned} / {progress.totalUniqueWords} ({progress.uniqueWordsPercentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress.uniqueWordsPercentage}%` }}
          />
        </div>
      </div>

      {/* Total Matches Progress */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-300">
            Total Matches
          </span>
          <span className="text-sm font-medium text-success">
            {progress.completed} / {progress.total} ({progress.percentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
          <div
            className="h-full bg-success transition-all duration-300 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Streak indicator */}
      {progress.streak > 0 && (
        <div className="flex items-center gap-1 text-sm">
          <span className="text-neutral-400">Streak:</span>
          <span className="font-bold text-primary">{progress.streak} 🔥</span>
        </div>
      )}
    </div>
  )
}
