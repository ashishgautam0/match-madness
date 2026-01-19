'use client'

import Link from 'next/link'

interface NavbarProps {
  showBackButton?: boolean
  backHref?: string
  backText?: string
  children?: React.ReactNode
}

/**
 * Atomic navbar component - consistent across all pages
 * Always positioned at top with fixed height
 */
export function Navbar({
  showBackButton = true,
  backHref = '/',
  backText = 'Back to Modes',
  children
}: NavbarProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '57px',
      backgroundColor: 'rgba(23, 23, 23, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #2a2a2a',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1536px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {showBackButton && (
          <Link
            href={backHref}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#9ca3af',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af'
            }}
          >
            <span>←</span>
            <span>{backText}</span>
          </Link>
        )}

        {children}
      </div>
    </div>
  )
}
