'use client'

import Link from 'next/link'

/**
 * Mode selection screen
 * @remarks Atomic component for choosing game mode
 */
export function ModeSelector() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Match Madness
          </h1>
          <p className="text-neutral-400 text-lg">
            Choose your learning mode
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Learning Mode */}
          <Link href="/learning">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 hover:border-primary/60 transition-all p-8 cursor-pointer hover:scale-105">
              <div className="space-y-4">
                <div className="text-5xl">📚</div>
                <h2 className="text-2xl font-bold text-white">
                  Learning Mode
                </h2>
                <p className="text-neutral-300">
                  Study 15 words at a time, then test yourself. Perfect for beginners!
                </p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span>Start Learning</span>
                  <span>→</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
            </div>
          </Link>

          {/* Practice Mode */}
          <Link href="/practice">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all p-8 cursor-pointer hover:scale-105">
              <div className="space-y-4">
                <div className="text-5xl">🎮</div>
                <h2 className="text-2xl font-bold text-white">
                  Practice Mode
                </h2>
                <p className="text-neutral-300">
                  Test all 297 words in one session. Great for review and mastery!
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-medium">
                  <span>Start Practice</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-neutral-500">
          Your progress is automatically saved in your browser
        </div>
      </div>
    </div>
  )
}
