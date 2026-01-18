'use client'

import type { GameItem } from '@/types/game'
import { usePronunciation } from '@/lib/hooks/usePronunciation'

interface StudyTableProps {
  words: readonly GameItem[]
  batchNumber: number
  totalBatches: number
}

/**
 * Colorful table displaying words for study phase
 * @remarks Reusable atomic component for displaying vocabulary
 */
export function StudyTable({ words, batchNumber, totalBatches }: StudyTableProps) {
  const { speak } = usePronunciation()

  // Color palette for alternating rows
  const rowColors = [
    'bg-blue-500/10 hover:bg-blue-500/20',
    'bg-purple-500/10 hover:bg-purple-500/20',
    'bg-pink-500/10 hover:bg-pink-500/20',
    'bg-green-500/10 hover:bg-green-500/20',
    'bg-yellow-500/10 hover:bg-yellow-500/20',
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Batch {batchNumber} of {totalBatches}
        </h2>
        <p className="text-neutral-400">
          Study these {words.length} words, then test yourself!
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800">
        <table className="w-full">
          <thead className="bg-neutral-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
                Français
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
                English
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-200">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, index) => (
              <tr
                key={word.id}
                className={`
                  ${rowColors[index % rowColors.length]}
                  transition-colors cursor-pointer
                `}
                onClick={() => speak(word.french)}
              >
                <td className="px-4 py-3 text-sm text-neutral-400">
                  {index + 1}
                </td>
                <td className="px-4 py-3 text-base font-medium text-white">
                  {word.french}
                </td>
                <td className="px-4 py-3 text-base text-neutral-300">
                  {word.english}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-400">
                  {word.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hint */}
      <div className="text-center text-sm text-neutral-500">
        💡 Click on any French word to hear pronunciation
      </div>
    </div>
  )
}
