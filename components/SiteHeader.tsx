import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4"
      >
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-950 transition hover:text-blue-700"
        >
          Curriculum Truth Ledger
        </Link>

        <div className="flex items-center gap-5 text-sm font-semibold">
          <Link
            href="/"
            className="text-slate-600 transition hover:text-blue-700"
          >
            Home
          </Link>

          <Link
            href="/#claims"
            className="text-slate-600 transition hover:text-blue-700"
          >
            Browse claims
          </Link>
        </div>
      </nav>
    </header>
  )
}