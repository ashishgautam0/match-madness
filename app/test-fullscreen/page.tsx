'use client'

import { functionWords } from '@/data/function-words/articles'

export default function TestFullscreen() {
  const words = functionWords.slice(0, 8)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0f1419',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{
        color: 'white',
        fontSize: '15px',
        fontWeight: '600',
        letterSpacing: '0.3px'
      }}>
        Test: 8 Cards Fullscreen
      </div>

      {/* Columns */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '12px',
        minHeight: 0
      }}>
        {/* French */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: 0
        }}>
          <div style={{
            color: '#6b7280',
            fontSize: '10px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            paddingLeft: '2px',
            marginBottom: '6px'
          }}>
            FRANÇAIS
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minHeight: 0
          }}>
            {words.map((word, i) => (
              <button
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: '#1e2530',
                  border: '2px solid #2d3748',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 0,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  padding: '0 8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#252d3d'
                  e.currentTarget.style.borderColor = '#4299e1'
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(66,153,225,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e2530'
                  e.currentTarget.style.borderColor = '#2d3748'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)'
                }}
              >
                {word.french}
              </button>
            ))}
          </div>
        </div>

        {/* English */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: 0
        }}>
          <div style={{
            color: '#6b7280',
            fontSize: '10px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            paddingLeft: '2px',
            marginBottom: '6px'
          }}>
            ENGLISH
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minHeight: 0
          }}>
            {words.map((word, i) => (
              <button
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: '#1e2530',
                  border: '2px solid #2d3748',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 0,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  padding: '0 8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#252d3d'
                  e.currentTarget.style.borderColor = '#4299e1'
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(66,153,225,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e2530'
                  e.currentTarget.style.borderColor = '#2d3748'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)'
                }}
              >
                {word.english}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
