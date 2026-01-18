import type { HapticType } from '@/types/game'
import { HAPTIC_CONFIG } from '@/lib/utils/constants'

/**
 * Haptic feedback service
 * @remarks Only works on native platforms, no-op on web
 */
class HapticService {
  private enabled: boolean = HAPTIC_CONFIG.ENABLED_BY_DEFAULT
  private lastTriggerTime: number = 0
  private isNative: boolean = false
  private Haptics: any = null

  /**
   * Initialize haptic service
   * @remarks Must be called before use (async Capacitor import)
   */
  public async initialize(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      const { Capacitor } = await import('@capacitor/core')
      this.isNative = Capacitor.isNativePlatform()

      if (this.isNative) {
        const haptics = await import('@capacitor/haptics')
        this.Haptics = haptics.Haptics
      }
    } catch (error) {
      console.warn('Haptics initialization failed', error)
      this.isNative = false
    }
  }

  /**
   * Triggers haptic feedback
   * @param type - Haptic intensity type
   */
  public async trigger(type: HapticType): Promise<void> {
    if (!this.enabled || !this.isNative || !this.Haptics) return

    // Throttle to prevent spam
    const now = Date.now()
    if (now - this.lastTriggerTime < HAPTIC_CONFIG.COOLDOWN_MS) {
      return
    }
    this.lastTriggerTime = now

    try {
      switch (type) {
        case 'light':
          await this.Haptics.impact({
            style: 'LIGHT' as any // ImpactStyle.Light
          })
          break
        case 'medium':
          await this.Haptics.impact({
            style: 'MEDIUM' as any
          })
          break
        case 'heavy':
          await this.Haptics.impact({
            style: 'HEAVY' as any
          })
          break
        case 'error':
          await this.Haptics.notification({
            type: 'ERROR' as any // NotificationType.ERROR
          })
          break
      }
    } catch (error) {
      console.warn('Haptic feedback failed', error)
    }
  }

  /**
   * Toggles haptic feedback
   */
  public toggle(): void {
    this.enabled = !this.enabled
  }

  /**
   * Sets haptic enabled state
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Gets enabled state
   */
  public isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Checks if haptics are available
   */
  public isAvailable(): boolean {
    return this.isNative && this.Haptics !== null
  }
}

// Export singleton instance
export const hapticService = new HapticService()
