import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
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
  sourceUrl?: string
  lastVerifiedAt?: string
  evidence: Evidence[]
}

type ClaimPageProps = {
  params: Promise<{
    slug: string
  }>
}

const claimQuery = `
  *[
    _type == "curriculumClaim" &&
    slug.current == $slug
  ][0] {
    _id,
    "slug": slug.current,
    title,
    claim,
    subject,
    gradeLevel,
    jurisdiction,
    status,
    explanation,
    sourceUrl,
    lastVerifiedAt,
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

function formatDate(value?: string) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export async function generateMetadata({
  params,
}: ClaimPageProps): Promise<Metadata> {
  const {slug} = await params

  const claim = await sanityClient.fetch<{
    title?: string
    claim?: string
  } | null>(
    `
      *[
        _type == "curriculumClaim" &&
        slug.current == $slug
      ][0] {
        title,
        claim
      }
    `,
    {slug},
  )

  if (!claim) {
    return {
      title: 'Claim not found',
      description: 'The requested curriculum claim could not be found.',
    }
  }

  return {
    title: claim.title,
    description: claim.claim,
  }
}

export default async function ClaimPage({
  params,
}: ClaimPageProps) {
  const {slug} = await params

  const claim = await sanityClient.fetch<Claim | null>(
    claimQuery,
    {slug},
  )

  if (!claim) {
    notFound()
  }

  const lastVerifiedDate = formatDate(claim.lastVerifiedAt)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link
            href="/"
            className="font-semibold text-blue-700 hover:underline"
          >
            ← Back to all claims
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 md:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-2">
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

            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              {claim.title}
            </h1>

            <p className="mt-6 text-xl leading-9 text-slate-700">
              {claim.claim}
            </p>

            {claim.explanation && (
              <section className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
                <h2 className="font-bold text-blue-950">
                  Verification explanation
                </h2>

                <p className="mt-2 leading-7 text-blue-900">
                  {claim.explanation}
                </p>
              </section>
            )}

            <dl className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-slate-500">
                  Jurisdiction
                </dt>

                <dd className="mt-1 font-medium">
                  {claim.jurisdiction}
                </dd>
              </div>

              {lastVerifiedDate && (
                <div>
                  <dt className="text-sm font-semibold text-slate-500">
                    Last verified
                  </dt>

                  <dd className="mt-1 font-medium">
                    {lastVerifiedDate}
                  </dd>
                </div>
              )}
            </dl>

            {claim.sourceUrl && (
              <a
                href={claim.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex font-semibold text-blue-700 hover:underline"
              >
                Open primary source
              </a>
            )}
          </div>

          <section
            aria-labelledby="evidence-heading"
            className="border-t border-slate-200 bg-slate-50 p-6 md:p-10"
          >
            <h2
              id="evidence-heading"
              className="text-2xl font-bold"
            >
              Supporting evidence ({claim.evidence.length})
            </h2>

            {claim.evidence.length === 0 ? (
              <p className="mt-4 text-slate-600">
                No published evidence is connected to this claim.
              </p>
            ) : (
              <div className="mt-6 space-y-5">
                {claim.evidence.map((item) => (
                  <article
                    key={item._id}
                    className="rounded-xl border border-slate-200 bg-white p-5 md:p-6"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">
                        {item.title}
                      </h3>

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
                      <p className="mt-3 text-sm text-slate-500">
                        Location: {item.location}
                      </p>
                    )}

                    {item.analysis && (
                      <p className="mt-5 leading-7 text-slate-700">
                        {item.analysis}
                      </p>
                    )}

                    {item.reviewerName && (
                      <p className="mt-4 text-sm text-slate-500">
                        Reviewed by: {item.reviewerName}
                      </p>
                    )}

                    {item.source && (
                      <div className="mt-5 border-t border-slate-100 pt-5 text-sm">
                        <p className="font-semibold">
                          {item.source.title}
                        </p>

                        <p className="mt-1 text-slate-500">
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
          </section>
        </div>
      </article>
    </main>
  )
}