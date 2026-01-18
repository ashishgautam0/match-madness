'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { MatchGameEngine } from '@/lib/game-engine/MatchGameEngine'
import { useSound } from './useSound'
import { useHaptics } from './useHaptics'
import { usePronunciation } from './usePronunciation'
import type { GameConfig, GameState, GameItem, ColumnType, GameStats } from '@/types/game'
import { isSelectionComplete } from '@/types/game'
import { STREAK_MILESTONES } from '@/lib/utils/constants'

/**
 * Main game hook - orchestrates game engine with React
 * @param config - Game configuration
 * @example
 * const game = useMatchGame(config)
 * game.selectItem(item, 'french')
 */
export function useMatchGame(config: GameConfig) {
  // Initialize engine (only once)
  const engineRef = useRef<MatchGameEngine | null>(null)
  if (!engineRef.current) {
    engineRef.current = new MatchGameEngine(config)
  }
  const engine = engineRef.current

  // State
  const [state, setState] = useState<GameState>(engine.getState())
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [startTime] = useState(Date.now())
  const [endTime, setEndTime] = useState<number | null>(null)
  const [animatingSelection, setAnimatingSelection] = useState<{
    french: GameItem | null
    english: GameItem | null
    type: GameItem | null
  }>({ french: null, english: null, type: null })
  const [animationType, setAnimationType] = useState<'correct' | 'wrong' | null>(null)

  // Services
  const { play } = useSound()
  const { trigger } = useHaptics()
  const { speak } = usePronunciation()

  // Handle selection
  const selectItem = useCallback((item: GameItem, column: ColumnType) => {
    // Auto-pronounce French words IMMEDIATELY when clicked (before any state updates)
    if (column === 'french') {
      speak(item.french)
    }

    // Haptic feedback for selection
    trigger('light')

    // Update selection in engine
    const newSelection = engine.selectItem(item, column)

    // Check if selection is complete
    if (isSelectionComplete(newSelection)) {
      // Small delay for UX (let user see selection)
      setTimeout(() => {
        const result = engine.processSelection()

        if (result.isValid) {
          // Correct match!
          play('correct')
          trigger('medium')

          // Check for streak milestones
          if (STREAK_MILESTONES.includes(result.streak as 10 | 25 | 50 | 100)) {
            const milestoneIndex = STREAK_MILESTONES.indexOf(result.streak as 10 | 25 | 50 | 100)
            if (milestoneIndex === 0) play('streak-10')
            else if (milestoneIndex === 1) play('streak-25')
          }

          // Check for completion
          if (result.isComplete) {
            play('complete')
            trigger('heavy')
            setEndTime(Date.now())
          }

          // Capture the items that should animate BEFORE clearing
          const currentSelection = engine.getState().selection
          console.log('About to show green animation, current selection:', currentSelection)

          // Store items for animation and set animation type
          setAnimatingSelection({
            french: currentSelection.french,
            english: currentSelection.english,
            type: currentSelection.type,
          })
          setAnimationType('correct')

          setTimeout(() => {
            console.log('Green animation timeout, clearing selection')
            // Clear animation
            setAnimationType(null)
            setAnimatingSelection({ french: null, english: null, type: null })

            // Call completeMatch to refill columns and clear selection
            // Pass the full selection so we can remove specific instances by instanceId
            if (typeof (engine as any).completeMatch === 'function') {
              (engine as any).completeMatch(currentSelection)
            }
            // Update React state to show new items
            setState(engine.getState())
          }, 300) // Shorter duration for correct matches
        } else {
          // Wrong match - capture items for animation
          play('wrong')
          trigger('error')
          setWrongAttempts(prev => prev + 1)

          // Capture the items that should animate BEFORE clearing
          const currentSelection = engine.getState().selection

          // Store items for animation and set animation type
          setAnimatingSelection({
            french: currentSelection.french,
            english: currentSelection.english,
            type: currentSelection.type,
          })
          setAnimationType('wrong')

          // Update state to reset streak (but keep selection)
          setState(engine.getState())

          // Delay clearing selection until after animation completes
          setTimeout(() => {
            // Clear animation
            setAnimationType(null)
            setAnimatingSelection({ french: null, english: null, type: null })

            // NOW manually clear the selection
            engine.clearSelection()
            setState(engine.getState())
          }, 400) // Match shake animation duration
        }
      }, 150)
    } else {
      // Just update state
      setState(engine.getState())
    }
  }, [engine, play, trigger, speak])

  // Clear selection
  const clearSelection = useCallback(() => {
    engine.clearSelection()
    setState(engine.getState())
  }, [engine])

  // Reset game
  const reset = useCallback(() => {
    engine.reset()
    setState(engine.getState())
    setWrongAttempts(0)
    setEndTime(null)
  }, [engine])

  // Get statistics
  const getStats = useCallback((): GameStats => {
    const progress = engine.getProgress()
    const timeSpent = endTime
      ? Math.floor((endTime - startTime) / 1000)
      : Math.floor((Date.now() - startTime) / 1000)

    const totalAttempts = progress.completed + wrongAttempts
    const accuracy = totalAttempts > 0
      ? (progress.completed / totalAttempts) * 100
      : 0

    return {
      totalMatches: progress.total,
      correctMatches: progress.completed,
      wrongAttempts,
      accuracy: Math.round(accuracy),
      timeSpent,
      averageTimePerMatch: progress.completed > 0
        ? timeSpent / progress.completed
        : 0,
    }
  }, [engine, wrongAttempts, startTime, endTime])

  return {
    state,
    selectItem,
    clearSelection,
    reset,
    progress: engine.getProgress(),
    stats: getStats(),
    isComplete: state.isComplete,
    animatingSelection,
    animationType,
  }
}
