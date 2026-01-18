import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Match Madness
        </h1>
        <p className="text-xl text-neutral-300">
          Master French through engaging match-three gameplay
        </p>

        <div className="grid gap-4 mt-12">
          <Link
            href="/function-words"
            className="block p-6 bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-200"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              Function Words
            </h2>
            <p className="text-neutral-400">
              Articles, prepositions, and conjunctions
            </p>
            <div className="mt-4 text-primary font-semibold">
              Start Learning →
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
