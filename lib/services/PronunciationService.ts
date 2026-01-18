/**
 * Service for pronouncing French words using Web Speech API
 */
class PronunciationService {
  private synthesis: SpeechSynthesis | null = null
  private frenchVoice: SpeechSynthesisVoice | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis
      this.loadFrenchVoice()
    }
  }

  /**
   * Load French voice from available voices
   */
  private loadFrenchVoice(): void {
    if (!this.synthesis) return

    const loadVoices = () => {
      const voices = this.synthesis!.getVoices()
      // Try to find a French voice (fr-FR, fr-CA, etc.)
      this.frenchVoice = voices.find(voice => voice.lang.startsWith('fr')) || null

      if (this.frenchVoice) {
        console.log('✓ French voice loaded:', this.frenchVoice.name)
      } else {
        console.warn('⚠ No French voice found, using default voice')
      }
    }

    // Load voices immediately if available
    loadVoices()

    // Also listen for voiceschanged event (Chrome requires this)
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices
    }
  }

  /**
   * Pronounce a French word
   * @param text - French text to pronounce
   */
  public speak(text: string): void {
    if (!this.enabled || !this.synthesis) return

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Use French voice if available
    if (this.frenchVoice) {
      utterance.voice = this.frenchVoice
      utterance.lang = this.frenchVoice.lang
    } else {
      utterance.lang = 'fr-FR' // Fallback to French locale
    }

    utterance.rate = 0.9 // Slightly slower for clarity
    utterance.pitch = 1.0
    utterance.volume = 1.0

    this.synthesis.speak(utterance)
  }

  /**
   * Toggle pronunciation on/off
   */
  public toggle(): void {
    this.enabled = !this.enabled
    if (!this.enabled && this.synthesis) {
      this.synthesis.cancel() // Stop any ongoing speech
    }
  }

  /**
   * Get current enabled state
   */
  public isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Stop any ongoing speech
   */
  public stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }
}

// Export singleton instance
export const pronunciationService = new PronunciationService()
