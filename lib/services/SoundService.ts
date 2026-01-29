import { Howl, Howler } from 'howler'
import type { SoundType } from '@/types/game'
import { SOUND_PATHS, AUDIO_CONFIG } from '@/lib/utils/constants'

/**
 * Sound service singleton for managing game audio
 * @remarks Uses Howler.js for cross-browser compatibility
 * @example
 * await soundService.preload()
 * soundService.play('correct')
 */
class SoundService {
  private sounds: Map<SoundType, Howl> = new Map()
  private enabled: boolean = true
  private preloaded: boolean = false
  private volume: number = AUDIO_CONFIG.DEFAULT_VOLUME

  /**
   * Preloads all sound files
   * @returns Promise that resolves when all sounds are loaded
   */
  public async preload(): Promise<void> {
    if (this.preloaded) return

    const loadPromises = Object.entries(SOUND_PATHS).map(([type, path]) => {
      return new Promise<void>((resolve, reject) => {
        // For correct.wav, use sprite to only play first 2 seconds (to cut off echo)
        const isCorrectSound = path.includes('correct.wav')

        // Load real sound files from public/sounds/
        const sound = new Howl({
          src: [path],
          volume: this.volume,
          preload: true,
          // Use sprite for correct sound to limit to 2 seconds
          ...(isCorrectSound && {
            sprite: {
              main: [0, 2000] // Start at 0ms, play for 2000ms (2 seconds)
            }
          }),
          onload: () => {
            console.log(`✓ Loaded sound: ${type} from ${path}`)
            this.sounds.set(type as SoundType, sound)
            resolve()
          },
          onloaderror: (_id, error) => {
            console.warn(`Failed to load sound: ${type} from ${path}`, error)
            // Fallback to beep sound if file not found
            const beepSound = new Howl({
              src: [this.generateBeep(type as SoundType)],
              volume: this.volume,
            })
            this.sounds.set(type as SoundType, beepSound)
            resolve() // Don't reject - fail gracefully
          },
        })
      })
    })

    try {
      await Promise.race([
        Promise.all(loadPromises),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Preload timeout')),
          AUDIO_CONFIG.PRELOAD_TIMEOUT)
        ),
      ])
      this.preloaded = true
    } catch (error) {
      console.warn('Sound preload failed or timed out', error)
      this.preloaded = true // Continue anyway
    }
  }

  /**
   * Generates a beep sound based on type (placeholder)
   * @param type - Sound type
   * @returns Data URL of generated audio
   */
  private generateBeep(type: SoundType): string {
    // Different frequencies for different sounds
    const frequencies: Record<SoundType, number> = {
      correct: 800,
      wrong: 200,
      complete: 1000,
      'streak-10': 600,
      'streak-25': 700,
      select: 400,
    }

    const frequency = frequencies[type]
    const duration = type === 'complete' ? 0.5 : 0.15

    return this.createBeepDataURL(frequency, duration)
  }

  /**
   * Creates a beep using Web Audio API
   */
  private createBeepDataURL(frequency: number, duration: number): string {
    const sampleRate = 44100
    const numSamples = Math.floor(sampleRate * duration)
    const buffer = new Float32Array(numSamples)

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      // Simple sine wave with envelope
      const envelope = Math.exp(-3 * t)
      buffer[i] = Math.sin(2 * Math.PI * frequency * t) * envelope
    }

    // Convert to WAV data URL (simplified)
    // In production, use a proper WAV encoder
    return 'data:audio/wav;base64,' + this.floatArrayToBase64(buffer)
  }

  /**
   * Simplified Float32Array to base64 (placeholder)
   */
  private floatArrayToBase64(buffer: Float32Array): string {
    // This is a simplified version - in production use proper WAV encoding
    const bytes = new Uint8Array(buffer.length)
    for (let i = 0; i < buffer.length; i++) {
      bytes[i] = Math.floor((buffer[i] + 1) * 127.5)
    }
    return btoa(String.fromCharCode(...bytes))
  }

  /**
   * Generates silence
   */
  private generateSilence(): string {
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
  }

  /**
   * Plays a sound
   * @param type - Sound type to play
   * @param volumeOverride - Optional volume override (0-1)
   */
  public play(type: SoundType, volumeOverride?: number): void {
    if (!this.enabled) return

    let sound = this.sounds.get(type)

    // If sound not loaded yet, try to load it on-demand
    if (!sound) {
      const path = SOUND_PATHS[type]
      if (path) {
        sound = new Howl({
          src: [path],
          volume: volumeOverride ?? this.volume,
          preload: true,
          onload: () => {
            this.sounds.set(type, sound!)
            sound!.play()
          },
          onloaderror: (_id, error) => {
            console.warn(`Failed to load sound on-demand: ${type}`, error)
          },
        })
        return // Will play in onload callback
      } else {
        console.warn(`Sound not loaded and no path found: ${type}`)
        return
      }
    }

    const volume = volumeOverride ?? this.volume
    sound.volume(volume)

    // For sounds with sprites, play the 'main' sprite
    const path = SOUND_PATHS[type]
    if (path && path.includes('correct.wav')) {
      sound.play('main')
    } else {
      sound.play()
    }
  }

  /**
   * Sets global volume
   * @param volume - Volume level (0-1)
   */
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    Howler.volume(this.volume)
  }

  /**
   * Toggles sound on/off
   */
  public toggle(): void {
    this.enabled = !this.enabled
    if (!this.enabled) {
      Howler.mute(true)
    } else {
      Howler.mute(false)
    }
  }

  /**
   * Gets current enabled state
   */
  public isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Gets current volume
   */
  public getVolume(): number {
    return this.volume
  }

  /**
   * Stops all playing sounds
   */
  public stopAll(): void {
    Howler.stop()
  }

  /**
   * Cleans up resources
   */
  public dispose(): void {
    this.stopAll()
    this.sounds.forEach(sound => sound.unload())
    this.sounds.clear()
    this.preloaded = false
  }
}

// Export singleton instance
export const soundService = new SoundService()
