'use client'

import { useEffect, useState, useCallback } from 'react'
import { soundService } from '@/lib/services/SoundService'
import type { SoundType } from '@/types/game'

/**
 * Hook for managing game sounds
 * @example
 * const { play, isEnabled, toggle } = useSound()
 * play('correct')
 */
export function useSound() {
  const [isEnabled, setIsEnabled] = useState(soundService.isEnabled())
  const [isPreloaded, setIsPreloaded] = useState(false)

  // Preload sounds on mount
  useEffect(() => {
    let mounted = true

    soundService.preload().then(() => {
      if (mounted) {
        setIsPreloaded(true)
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  const play = useCallback((type: SoundType, volume?: number) => {
    // Try to play even if not fully preloaded - let the service handle it
    soundService.play(type, volume)
  }, [])

  const toggle = useCallback(() => {
    soundService.toggle()
    setIsEnabled(soundService.isEnabled())
  }, [])

  const setVolume = useCallback((volume: number) => {
    soundService.setVolume(volume)
  }, [])

  return {
    play,
    toggle,
    setVolume,
    isEnabled,
    isPreloaded,
  }
}
