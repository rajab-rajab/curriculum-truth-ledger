import Link from 'next/link'
import {sanityClient} from '@/sanity/client'

export const dynamic = 'force-dynamic'

type Evidence = {
  _id: string
  title: string
  position: string
  excerpt: string
  location?: string
  confidence: string
  analysis?: string
  reviewerName?: string
  reviewedAt?: string
  source?: {
    title: string
    publisher: string
    url?: string
    fileUrl?: string
  }
}

type Claim = {
  _id: string
  slug: string
  title: string
  claim: string
  subject: string
  gradeLevel: string
  jurisdiction: string
  status: string
  explanation?: string
  evidence: Evidence[]
}

type HomeProps = {
  searchParams: Promise<{
    q?: string
    subject?: string
    grade?: string
    status?: string
  }>
}

const claimsQuery = `
  *[_type == "curriculumClaim"] | order(_createdAt desc) {
    _id,
    "slug": slug.current,
    title,
    claim,
    subject,
    gradeLevel,
    jurisdiction,
    status,
    explanation,
    "evidence": *[
      _type == "evidence" &&
      references(^._id)
    ] | order(reviewedAt desc) {
      _id,
      title,
      position,
      excerpt,
      location,
      confidence,
      analysis,
      reviewerName,
      reviewedAt,
      source-> {
        title,
        publisher,
        url,
        "fileUrl": file.asset->url
      }
    }
  }
`

function statusStyle(status: string) {
  switch (status) {
    case 'verified':
      return 'bg-emerald-100 text-emerald-800'
    case 'disputed':
      return 'bg-red-100 text-red-800'
    case 'outdated':
      return 'bg-amber-100 text-amber-800'
    case 'under-review':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function formatLabel(value: string) {
  return value
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function cleanExcerpt(excerpt: string) {
  return excerpt
    .trim()
    .replace(/^["“”]+/, '')
    .replace(/["“”]+$/, '')
}

export default async function Home({searchParams}: HomeProps) {
  const claims = await sanityClient.fetch<Claim[]>(claimsQuery)

  const {
    q = '',
    subject = '',
    grade = '',
    status = '',
  } = await searchParams

  const searchTerm = q.trim().toLowerCase()
  const hasActiveFilters = Boolean(searchTerm || subject || grade || status)

  const subjects = [...new Set(claims.map((claim) => claim.subject))]
    .filter(Boolean)
    .sort()

  const grades = [...new Set(claims.map((claim) => claim.gradeLevel))]
    .filter(Boolean)
    .sort()

  const statuses = [...new Set(claims.map((claim) => claim.status))]
    .filter(Boolean)
    .sort()

  const filteredClaims = claims.filter((claim) => {
    const searchableContent = [
      claim.title,
      claim.claim,
      claim.subject,
      formatLabel(claim.subject),
      claim.gradeLevel,
      claim.jurisdiction,
      claim.status,
      formatLabel(claim.status),
      claim.explanation,
      ...claim.evidence.flatMap((item) => [
        item.title,
        item.position,
        item.excerpt,
        item.location,
        item.confidence,
        item.analysis,
        item.reviewerName,
        item.source?.title,
        item.source?.publisher,
      ]),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      !searchTerm || searchableContent.includes(searchTerm)

    const matchesSubject =
      !subject || claim.subject === subject

    const matchesGrade =
      !grade || claim.gradeLevel === grade

    const matchesStatus =
      !status || claim.status === status

    return (
      matchesSearch &&
      matchesSubject &&
      matchesGrade &&
      matchesStatus
    )
  })

  const totalClaims = claims.length

  const verifiedClaims = claims.filter(
    (claim) => claim.status === 'verified',
  ).length

  const totalEvidence = claims.reduce(
    (total, claim) => total + claim.evidence.length,
    0,
  )

  const totalSubjects = new Set(
    claims.map((claim) => claim.subject).filter(Boolean),
  ).size

  return (
    <main
      id="main-content"
      className="bg-slate-50 text-slate-950"
    >
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-blue-700">
            Evidence before assertion
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Curriculum Truth Ledger
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            A transparent record of curriculum claims, official sources and
            human-reviewed evidence.
          </p>
        </div>
      </header>

      <section
        id="claims"
        aria-labelledby="claims-heading"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 py-10"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="claims-heading"
              className="text-2xl font-bold"
            >
              Published claims
            </h2>

            <p className="mt-1 text-slate-600">
              Every conclusion remains connected to its evidence.
            </p>
          </div>

          <div className="w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            {totalClaims} {totalClaims === 1 ? 'claim' : 'claims'}
          </div>
        </div>

        <form
          action="/"
          method="get"
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div>
            <label
              htmlFor="claim-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search claims and evidence
            </label>

            <input
              id="claim-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search by subject, grade, claim, excerpt or source…"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="subject-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Subject
              </label>

              <select
                id="subject-filter"
                name="subject"
                defaultValue={subject}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All subjects</option>

                {subjects.map((subjectOption) => (
                  <option key={subjectOption} value={subjectOption}>
                    {formatLabel(subjectOption)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="grade-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Grade
              </label>

              <select
                id="grade-filter"
                name="grade"
                defaultValue={grade}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All grades</option>

                {grades.map((gradeOption) => (
                  <option key={gradeOption} value={gradeOption}>
                    {gradeOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Verification status
              </label>

              <select
                id="status-filter"
                name="status"
                defaultValue={status}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All statuses</option>

                {statuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {formatLabel(statusOption)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Apply search and filters
            </button>

            {hasActiveFilters && (
              <Link
                href="/"
                className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear all
              </Link>
            )}
          </div>

          {hasActiveFilters && (
            <p
              className="mt-4 text-sm text-slate-600"
              aria-live="polite"
            >
              Showing {filteredClaims.length} of {totalClaims}{' '}
              {totalClaims === 1 ? 'claim' : 'claims'}
            </p>
          )}
        </form>

        <section
          aria-labelledby="summary-heading"
          className="mb-8"
        >
          <div className="mb-4">
            <h2
              id="summary-heading"
              className="text-xl font-bold text-slate-900"
            >
              Ledger summary
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Current totals from the published curriculum records.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Published claims
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {totalClaims}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-emerald-700">
                Verified claims
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-900">
                {verifiedClaims}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-blue-700">
                Evidence records
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-950">
                {totalEvidence}
              </p>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-violet-700">
                Subject areas
              </p>

              <p className="mt-2 text-3xl font-bold text-violet-950">
                {totalSubjects}
              </p>
            </div>
          </div>
        </section>

        {claims.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-semibold">
              No published claims found
            </h3>

            <p className="mt-2 text-slate-600">
              Publish a Curriculum Claim in Sanity Studio and refresh this
              page.
            </p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-semibold">
              No matching claims found
            </h3>

            <p className="mt-2 text-slate-600">
              Try changing the search text or selecting different filters.
            </p>

            <Link
              href="/"
              className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
            >
              Clear search and filters
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredClaims.map((claim) => (
              <article
                key={claim._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="p-6 md:p-8">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusStyle(
                        claim.status,
                      )}`}
                    >
                      {formatLabel(claim.status)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {formatLabel(claim.subject)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {claim.gradeLevel}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold">
                    <Link
                      href={`/claims/${claim.slug}`}
                      className="transition hover:text-blue-700 hover:underline"
                    >
                      {claim.title}
                    </Link>
                  </h3>

                  <p className="mt-4 text-lg leading-8 text-slate-700">
                    {claim.claim}
                  </p>

                  {claim.explanation && (
                    <p className="mt-4 leading-7 text-slate-600">
                      {claim.explanation}
                    </p>
                  )}

                  <p className="mt-4 text-sm text-slate-500">
                    Jurisdiction: {claim.jurisdiction}
                  </p>

                  <Link
                    href={`/claims/${claim.slug}`}
                    className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    View complete claim
                  </Link>
                </div>

                <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-8">
                  <h4 className="font-bold">
                    Evidence ({claim.evidence.length})
                  </h4>

                  {claim.evidence.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-600">
                      No published evidence is connected to this claim.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {claim.evidence.map((item) => (
                        <article
                          key={item._id}
                          className="rounded-xl border border-slate-200 bg-white p-5"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="font-bold">
                              {item.title}
                            </h5>

                            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold uppercase text-blue-700">
                              {formatLabel(item.position)}
                            </span>

                            <span className="text-xs text-slate-500">
                              {formatLabel(item.confidence)} confidence
                            </span>
                          </div>

                          <blockquote className="mt-4 border-l-4 border-blue-600 pl-4 italic leading-7 text-slate-700">
                            “{cleanExcerpt(item.excerpt)}”
                          </blockquote>

                          {item.location && (
                            <p className="mt-2 text-sm text-slate-500">
                              Location: {item.location}
                            </p>
                          )}

                          {item.analysis && (
                            <p className="mt-4 leading-7 text-slate-700">
                              {item.analysis}
                            </p>
                          )}

                          {item.reviewerName && (
                            <p className="mt-4 text-sm text-slate-500">
                              Reviewed by: {item.reviewerName}
                            </p>
                          )}

                          {item.source && (
                            <div className="mt-4 border-t border-slate-100 pt-4 text-sm">
                              <p className="font-semibold">
                                {item.source.title}
                              </p>

                              <p className="text-slate-500">
                                {item.source.publisher}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-4">
                                {item.source.url && (
                                  <a
                                    href={item.source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-blue-700 hover:underline"
                                  >
                                    Official website
                                  </a>
                                )}

                                {item.source.fileUrl && (
                                  <a
                                    href={item.source.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-blue-700 hover:underline"
                                  >
                                    Open source document
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}