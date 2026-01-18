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
    <div className="flex items-center gap-4 flex-1">
      {/* Unique Words with bar */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm text-neutral-400 whitespace-nowrap">Words</span>
        <div className="w-full h-4 bg-neutral-800 rounded-full overflow-hidden border-2 border-neutral-700">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress.uniqueWordsPercentage}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-primary whitespace-nowrap">
          {progress.uniqueWordsLearned}/{progress.totalUniqueWords}
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-neutral-700" />

      {/* Total Matches with bar */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm text-neutral-400 whitespace-nowrap">Matches</span>
        <div className="w-full h-4 bg-neutral-800 rounded-full overflow-hidden border-2 border-neutral-700">
          <div
            className="h-full bg-success transition-all duration-300 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-success whitespace-nowrap">
          {progress.completed}/{progress.total}
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-neutral-700" />

      {/* Streak - always reserve space to prevent layout shift */}
      <div className="flex items-center gap-2 min-w-[90px]">
        {progress.streak > 0 ? (
          <>
            <span className="text-sm text-neutral-400">Streak:</span>
            <span className="text-sm font-bold text-primary">{progress.streak} 🔥</span>
          </>
        ) : (
          <span className="invisible text-sm">Streak: 0 🔥</span>
        )}
      </div>
    </div>
  )
}
