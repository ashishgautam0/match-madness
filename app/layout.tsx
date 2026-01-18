import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Match Madness',
  description: 'Language learning through gameplay',
  manifest: '/manifest.json',
  themeColor: '#58CC02',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-neutral-900 text-white antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
