/**
 * Platform detection utilities
 * @remarks Handles SSR gracefully - returns 'web' on server
 */

let _isNative: boolean | undefined
let _isAndroid: boolean | undefined
let _isIOS: boolean | undefined

/**
 * Safely imports Capacitor only on client side
 */
async function getCapacitor() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const { Capacitor } = await import('@capacitor/core')
    return Capacitor
  } catch {
    return null
  }
}

/**
 * Checks if running on native platform
 * @returns True if running in Capacitor native app
 */
export async function isNativePlatform(): Promise<boolean> {
  if (_isNative !== undefined) return _isNative

  const Capacitor = await getCapacitor()
  _isNative = Capacitor?.isNativePlatform() ?? false
  return _isNative
}

/**
 * Checks if running on Android
 */
export async function isAndroid(): Promise<boolean> {
  if (_isAndroid !== undefined) return _isAndroid

  const Capacitor = await getCapacitor()
  _isAndroid = Capacitor?.getPlatform() === 'android'
  return _isAndroid
}

/**
 * Checks if running on iOS
 */
export async function isIOS(): Promise<boolean> {
  if (_isIOS !== undefined) return _isIOS

  const Capacitor = await getCapacitor()
  _isIOS = Capacitor?.getPlatform() === 'ios'
  return _isIOS
}

/**
 * Synchronous check if running on web (SSR-safe)
 */
export function isWeb(): boolean {
  return typeof window !== 'undefined' && !_isNative
}

/**
 * Gets platform name
 */
export async function getPlatformName(): Promise<'web' | 'android' | 'ios'> {
  const Capacitor = await getCapacitor()
  return (Capacitor?.getPlatform() as 'web' | 'android' | 'ios') ?? 'web'
}
