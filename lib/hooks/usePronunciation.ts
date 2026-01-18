'use client'

import { useState, useCallback } from 'react'
import { pronunciationService } from '@/lib/services/PronunciationService'

/**
 * Hook for managing French pronunciation
 */
export function usePronunciation() {
  const [isEnabled, setIsEnabled] = useState(pronunciationService.isEnabled())

  const speak = useCallback((text: string) => {
    pronunciationService.speak(text)
  }, [])

  const toggle = useCallback(() => {
    pronunciationService.toggle()
    setIsEnabled(pronunciationService.isEnabled())
  }, [])

  const stop = useCallback(() => {
    pronunciationService.stop()
  }, [])

  return {
    speak,
    toggle,
    stop,
    isEnabled,
  }
}
