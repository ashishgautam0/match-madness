'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { MatchGameEngine } from '@/lib/game-engine/MatchGameEngine'
import { useSound } from './useSound'
import { useHaptics } from './useHaptics'
import { usePronunciation } from './usePronunciation'
import type { GameConfig, GameState, GameItem, ColumnType, GameStats } from '@/types/game'
import { isSelectionComplete } from '@/types/game'
import { STREAK_MILESTONES } from '@/lib/utils/constants'
import { validatePartialMatches, validateCheckMode } from '../game-engine/Validator'

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

  // Detect 2-column mode
  const isTwoColumnMode = config.columnMode === 'two-columns'
  const hiddenColumn = config.hiddenColumn

  // State
  const [state, setState] = useState<GameState>(engine.getState())
  const [progress, setProgress] = useState(engine.getProgress())
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [startTime] = useState(Date.now())
  const [endTime, setEndTime] = useState<number | null>(null)
  const [animatingSelection, setAnimatingSelection] = useState<{
    french: GameItem | null
    english: GameItem | null
    type: GameItem | null
  }>({ french: null, english: null, type: null })
  const [animationType, setAnimationType] = useState<{
    french: 'correct' | 'wrong' | null
    english: 'correct' | 'wrong' | null
    type: 'correct' | 'wrong' | null
  }>({ french: null, english: null, type: null })
  const [checkMode, setCheckMode] = useState(false)

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

    // In 2-column mode, validate with 2 selections
    if (isTwoColumnMode) {
      const checkResult = validateCheckMode(newSelection)

      if (checkResult.french !== null || checkResult.english !== null || checkResult.type !== null) {
        // We have 2 selections - show feedback
        setTimeout(() => {
          setAnimatingSelection({
            french: newSelection.french,
            english: newSelection.english,
            type: newSelection.type,
          })
          setAnimationType({
            french: checkResult.french,
            english: checkResult.english,
            type: checkResult.type,
          })

          if (checkResult.hasMatch) {
            // Correct match in 2-column mode - advance the game
            const result = engine.processSelection()

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

            setTimeout(() => {
              // Clear animation
              setAnimationType({ french: null, english: null, type: null })
              setAnimatingSelection({ french: null, english: null, type: null })

              // Call completeMatch to refill columns and clear selection
              const currentSelection = engine.getState().selection
              if (typeof (engine as any).completeMatch === 'function') {
                (engine as any).completeMatch(currentSelection)
              }
              // Update React state to show new items
              setState(engine.getState())
              setProgress(engine.getProgress())
            }, 300)
          } else {
            // Wrong match in 2-column mode
            play('wrong')
            trigger('error')
            setWrongAttempts(prev => prev + 1)

            // Update state to reset streak (but keep selection)
            setState(engine.getState())

            // Clear after animation
            setTimeout(() => {
              setAnimationType({ french: null, english: null, type: null })
              setAnimatingSelection({ french: null, english: null, type: null })
              engine.clearSelection()
              setState(engine.getState())
            }, 400)
          }
        }, 150)
      } else {
        // Just 1 selection, update state
        setState(engine.getState())
      }
      return
    }

    // In Check Mode, validate with 2 selections (practice mode, doesn't advance)
    if (checkMode) {
      const checkResult = validateCheckMode(newSelection)

      if (checkResult.french !== null || checkResult.english !== null || checkResult.type !== null) {
        // We have 2 selections - show feedback
        setTimeout(() => {
          setAnimatingSelection({
            french: newSelection.french,
            english: newSelection.english,
            type: newSelection.type,
          })
          setAnimationType({
            french: checkResult.french,
            english: checkResult.english,
            type: checkResult.type,
          })

          // Play sound
          play(checkResult.hasMatch ? 'correct' : 'wrong')
          trigger(checkResult.hasMatch ? 'light' : 'error')

          // Clear after animation
          setTimeout(() => {
            setAnimationType({ french: null, english: null, type: null })
            setAnimatingSelection({ french: null, english: null, type: null })
            engine.clearSelection()
            setState(engine.getState())
          }, 400)
        }, 150)
      } else {
        // Just 1 selection, update state
        setState(engine.getState())
      }
      return
    }

    // Normal 3-column mode - check if selection is complete (all 3)
    if (isSelectionComplete(newSelection)) {
      // Small delay for UX (let user see selection)
      setTimeout(() => {
        // Check partial matches
        const partialMatches = validatePartialMatches(newSelection)
        const result = engine.processSelection()

        // Capture the items that should animate BEFORE clearing
        const currentSelection = engine.getState().selection

        // Determine animation type for each column based on what matches
        const columnAnimations = {
          french: partialMatches.frenchEnglishMatch || partialMatches.frenchTypeMatch ? 'correct' as const : 'wrong' as const,
          english: partialMatches.frenchEnglishMatch ? 'correct' as const : 'wrong' as const,
          type: partialMatches.frenchTypeMatch ? 'correct' as const : 'wrong' as const,
        }

        // Store items for animation
        setAnimatingSelection({
          french: currentSelection.french,
          english: currentSelection.english,
          type: currentSelection.type,
        })
        setAnimationType(columnAnimations)

        if (partialMatches.perfectMatch) {
          // Perfect match!
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

          setTimeout(() => {
            // Clear animation
            setAnimationType({ french: null, english: null, type: null })
            setAnimatingSelection({ french: null, english: null, type: null })

            // Call completeMatch to refill columns and clear selection
            if (typeof (engine as any).completeMatch === 'function') {
              (engine as any).completeMatch(currentSelection)
            }
            // Update React state to show new items
            setState(engine.getState())
            setProgress(engine.getProgress())
          }, 300)
        } else {
          // Partial or no match - show feedback but don't advance
          play('wrong')
          trigger('error')
          setWrongAttempts(prev => prev + 1)

          // Update state to reset streak (but keep selection)
          setState(engine.getState())

          // Delay clearing selection until after animation completes
          setTimeout(() => {
            // Clear animation
            setAnimationType({ french: null, english: null, type: null })
            setAnimatingSelection({ french: null, english: null, type: null })

            // Clear the selection
            engine.clearSelection()
            setState(engine.getState())
          }, 400)
        }
      }, 150)
    } else {
      // Just update state
      setState(engine.getState())
    }
  }, [engine, play, trigger, speak, checkMode])

  // Clear selection
  const clearSelection = useCallback(() => {
    engine.clearSelection()
    setState(engine.getState())
  }, [engine])

  // Toggle check mode
  const toggleCheckMode = useCallback(() => {
    setCheckMode(prev => !prev)
    // Clear any existing selection when switching modes
    engine.clearSelection()
    setState(engine.getState())
    setAnimationType({ french: null, english: null, type: null })
    setAnimatingSelection({ french: null, english: null, type: null })
  }, [engine])

  // Reset game
  const reset = useCallback(() => {
    engine.reset()
    setState(engine.getState())
    setProgress(engine.getProgress())
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
    progress,
    stats: getStats(),
    isComplete: state.isComplete,
    animatingSelection,
    animationType,
    checkMode,
    toggleCheckMode,
  }
}
