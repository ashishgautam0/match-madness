import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Match Madness - Learn French',
  description: 'Master French function words through engaging match-three gameplay',
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {children}
    </div>
  )
}
