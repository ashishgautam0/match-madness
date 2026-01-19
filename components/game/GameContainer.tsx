'use client'

import type { ReactNode } from 'react'

interface GameContainerProps {
  children: ReactNode
  showNavbar?: boolean
}

/**
 * Atomic fullscreen game container
 * Takes up all available space, optionally leaving room for navbar
 */
export function GameContainer({ children, showNavbar = false }: GameContainerProps) {
  return (
    <div style={{
      position: 'fixed',
      top: showNavbar ? '57px' : 0, // Navbar height
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0a0e14',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {children}
    </div>
  )
}
