'use client'

import { useState } from 'react'
import type { GameItem } from '@/types/game'
import { usePronunciation } from '@/lib/hooks/usePronunciation'

interface StudyTableProps {
  words: readonly GameItem[]
  batchNumber: number
  totalBatches: number
}

/**
 * Professional table displaying vocabulary for study
 * @remarks Clean, scannable design with hover interactions
 */
export function StudyTable({ words, batchNumber, totalBatches }: StudyTableProps) {
  const { speak } = usePronunciation()
  const [activeRow, setActiveRow] = useState<string | null>(null)

  const handleRowClick = (word: GameItem) => {
    setActiveRow(word.id)
    speak(word.french)
    setTimeout(() => setActiveRow(null), 400)
  }

  // Type colors for badges
  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'article': 'bg-blue-500/15 text-blue-400',
      'preposition': 'bg-purple-500/15 text-purple-400',
      'conjunction': 'bg-pink-500/15 text-pink-400',
      'pronoun': 'bg-green-500/15 text-green-400',
      'adverb': 'bg-yellow-500/15 text-yellow-400',
      'determiner': 'bg-indigo-500/15 text-indigo-400',
    }
    return colors[type.toLowerCase()] || 'bg-neutral-500/15 text-neutral-400'
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-3">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700">
          <span className="text-xs font-medium text-neutral-300">Batch {batchNumber} of {totalBatches}</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Study Vocabulary
        </h2>
        <p className="text-xs text-neutral-400">
          Click any row to hear pronunciation
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800/50">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-800 border-b border-neutral-700">
              <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider w-10">
                #
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Français
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                English
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider w-28">
                Type
              </th>
              <th className="px-3 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700/50">
            {words.map((word, index) => (
              <tr
                key={word.id}
                onClick={() => handleRowClick(word)}
                className={`
                  cursor-pointer transition-all duration-150
                  hover:bg-neutral-700/30
                  ${activeRow === word.id ? 'bg-primary/10' : ''}
                `}
              >
                <td className="px-3 py-2 text-sm text-neutral-500 font-medium">
                  {index + 1}
                </td>
                <td className="px-3 py-2">
                  <span className={`
                    text-sm font-semibold transition-colors
                    ${activeRow === word.id ? 'text-primary' : 'text-white'}
                  `}>
                    {word.french}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm text-neutral-300">
                  {word.english}
                </td>
                <td className="px-3 py-2">
                  <span className={`
                    inline-flex px-2 py-0.5 rounded-md
                    text-xs font-medium uppercase tracking-wide whitespace-nowrap
                    ${getTypeBadgeColor(word.type)}
                  `}>
                    {word.type}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <svg
                    className={`
                      w-4 h-4 transition-colors
                      ${activeRow === word.id ? 'text-primary' : 'text-neutral-600'}
                    `}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
