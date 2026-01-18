'use client'

import { useState, useEffect } from 'react'
import { StudyTable } from '@/components/learning/StudyTable'
import { MatchGame } from '@/components/game/MatchGame'
import { functionWords } from '@/data/function-words/articles'
import {
  getBatch,
  getTotalBatches,
  getCurrentBatchIndex,
  completeBatch,
  loadProgress,
} from '@/lib/batch/BatchManager'
import { ITEMS_PER_COLUMN, LEARNING_MODE } from '@/lib/utils/constants'
import type { GameConfig } from '@/types/game'
import Link from 'next/link'

type Phase = 'study' | 'test' | 'results'
type ColumnMode = 'french-english' | 'french-type' | 'all-three'

export default function LearningPage() {
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('study')
  const [gameKey, setGameKey] = useState(0) // Force remount game on batch change
  const [batchInput, setBatchInput] = useState('1')
  const [columnMode, setColumnMode] = useState<ColumnMode>('french-english')

  const totalBatches = getTotalBatches(functionWords)
  const currentBatch = getBatch(functionWords, currentBatchIndex)
  const isLastBatch = currentBatchIndex >= totalBatches - 1

  // Always start at batch 1 (index 0)
  useEffect(() => {
    setCurrentBatchIndex(0)
    setBatchInput('1')
  }, [])

  // Game config for current batch
  const gameConfig: GameConfig = {
    items: currentBatch,
    totalMatches: currentBatch.length * LEARNING_MODE.MAX_REPETITIONS_PER_BATCH,
    itemsPerColumn: ITEMS_PER_COLUMN,
    minRepetitions: LEARNING_MODE.MIN_REPETITIONS_PER_BATCH,
    maxRepetitions: LEARNING_MODE.MAX_REPETITIONS_PER_BATCH,
    columnMode: columnMode === 'all-three' ? 'three-columns' : 'two-columns',
    hiddenColumn: columnMode === 'french-english' ? 'type' : columnMode === 'french-type' ? 'english' : undefined,
  }

  const handleStartTest = () => {
    setPhase('test')
  }

  const handleTestComplete = () => {
    setPhase('results')
  }

  const handleNextBatch = () => {
    completeBatch(currentBatchIndex)
    const nextIndex = currentBatchIndex + 1

    if (nextIndex < totalBatches) {
      setCurrentBatchIndex(nextIndex)
      setBatchInput(String(nextIndex + 1))
      setPhase('study')
      setGameKey(prev => prev + 1) // Force new game instance
    }
  }

  const handleRetryBatch = () => {
    setPhase('study')
    setGameKey(prev => prev + 1) // Force new game instance
  }

  const handlePreviousBatch = () => {
    const prevIndex = currentBatchIndex - 1
    if (prevIndex >= 0) {
      setCurrentBatchIndex(prevIndex)
      setBatchInput(String(prevIndex + 1))
      setPhase('study')
      setGameKey(prev => prev + 1) // Force new game instance
    }
  }

  const handleBatchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBatchInput(value)
  }

  const handleBatchInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const batchNumber = parseInt(batchInput, 10)
    if (!isNaN(batchNumber) && batchNumber >= 1 && batchNumber <= totalBatches) {
      setCurrentBatchIndex(batchNumber - 1)
      setPhase('study')
      setGameKey(prev => prev + 1)
    } else {
      // Reset to current batch if invalid
      setBatchInput(String(currentBatchIndex + 1))
    }
  }

  return (
    <main className="min-h-screen bg-neutral-900">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur border-b border-neutral-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back to Modes</span>
          </Link>

          <div className="flex items-center gap-4">
            {currentBatchIndex > 0 && (
              <button
                onClick={handlePreviousBatch}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                ← Previous
              </button>
            )}

            <form onSubmit={handleBatchInputSubmit} className="flex items-center gap-2">
              <label htmlFor="batch-input" className="text-sm text-neutral-400">
                Batch
              </label>
              <input
                id="batch-input"
                type="number"
                min="1"
                max={totalBatches}
                value={batchInput}
                onChange={handleBatchInputChange}
                onBlur={handleBatchInputSubmit}
                className="w-16 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-neutral-400">of {totalBatches}</span>
            </form>

            {!isLastBatch && (
              <button
                onClick={handleNextBatch}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
              >
                Next Batch →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Study Phase */}
      {phase === 'study' && (
        <div className="py-12 px-4">
          <StudyTable
            words={currentBatch}
            batchNumber={currentBatchIndex + 1}
            totalBatches={totalBatches}
          />

          {/* Column Mode Selector */}
          <div className="mt-8 max-w-2xl mx-auto">
            <h3 className="text-center text-lg font-semibold text-white mb-4">
              Choose Matching Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setColumnMode('french-english')}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${columnMode === 'french-english'
                    ? 'border-primary bg-primary/10 text-white'
                    : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-600'
                  }
                `}
              >
                <div className="font-bold text-sm mb-1">French ↔ English</div>
                <div className="text-xs text-neutral-400">Learn word meanings first (Easiest)</div>
              </button>

              <button
                onClick={() => setColumnMode('french-type')}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${columnMode === 'french-type'
                    ? 'border-primary bg-primary/10 text-white'
                    : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-600'
                  }
                `}
              >
                <div className="font-bold text-sm mb-1">French ↔ Type</div>
                <div className="text-xs text-neutral-400">Learn gender/number (Medium)</div>
              </button>

              <button
                onClick={() => setColumnMode('all-three')}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${columnMode === 'all-three'
                    ? 'border-primary bg-primary/10 text-white'
                    : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-600'
                  }
                `}
              >
                <div className="font-bold text-sm mb-1">All Three Columns</div>
                <div className="text-xs text-neutral-400">Full challenge (Hardest)</div>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleStartTest}
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Ready to Test! →
            </button>
          </div>
        </div>
      )}

      {/* Test Phase */}
      {phase === 'test' && (
        <MatchGame
          key={gameKey}
          config={gameConfig}
          onComplete={handleTestComplete}
        />
      )}

      {/* Results Phase */}
      {phase === 'results' && (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold text-white">
              Batch Complete!
            </h2>
            <p className="text-neutral-300 text-lg">
              You've mastered {currentBatch.length} words from Batch {currentBatchIndex + 1}.
            </p>

            <div className="space-y-3 pt-4">
              {!isLastBatch ? (
                <>
                  <button
                    onClick={handleNextBatch}
                    className="w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
                  >
                    Next Batch ({currentBatch.length} new words) →
                  </button>
                  <button
                    onClick={handleRetryBatch}
                    className="w-full px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Retry This Batch
                  </button>
                </>
              ) : (
                <>
                  <div className="text-xl font-bold text-primary">
                    🏆 All Batches Complete!
                  </div>
                  <p className="text-neutral-400">
                    You've learned all {functionWords.length} function words!
                  </p>
                  <Link
                    href="/"
                    className="block w-full px-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
                  >
                    Back to Menu
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
