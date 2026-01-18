'use client'

import { useEffect, useState, useCallback } from 'react'
import { hapticService } from '@/lib/services/HapticService'
import type { HapticType } from '@/types/game'

/**
 * Hook for managing haptic feedback
 * @example
 * const { trigger, isEnabled } = useHaptics()
 * trigger('light')
 */
export function useHaptics() {
  const [isEnabled, setIsEnabled] = useState(hapticService.isEnabled())
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    let mounted = true

    hapticService.initialize().then(() => {
      if (mounted) {
        setIsAvailable(hapticService.isAvailable())
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  const trigger = useCallback((type: HapticType) => {
    hapticService.trigger(type)
  }, [])

  const toggle = useCallback(() => {
    hapticService.toggle()
    setIsEnabled(hapticService.isEnabled())
  }, [])

  return {
    trigger,
    toggle,
    isEnabled,
    isAvailable,
  }
}
