import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {Geist, Geist_Mono} from 'next/font/google'
import {SiteFooter} from '@/components/SiteFooter'
import {SiteHeader} from '@/components/SiteHeader'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Curriculum Truth Ledger',
    template: '%s | Curriculum Truth Ledger',
  },

  description:
    'A transparent record of curriculum claims, official sources, and human-reviewed evidence.',

  applicationName: 'Curriculum Truth Ledger',
  creator: 'Rajab Baig',
  publisher: 'Curriculum Truth Ledger',

  authors: [
    {
      name: 'Rajab Baig',
    },
  ],

  keywords: [
    'curriculum',
    'education',
    'curriculum evidence',
    'official sources',
    'human review',
    'computer science education',
    'Punjab',
    'Pakistan',
  ],

  category: 'education',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: 'website',
    title: 'Curriculum Truth Ledger',
    description:
      'A transparent record of curriculum claims, official sources, and human-reviewed evidence.',
    siteName: 'Curriculum Truth Ledger',
  },

  twitter: {
    card: 'summary',
    title: 'Curriculum Truth Ledger',
    description:
      'Evidence-backed curriculum claims connected to official sources.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-white px-4 py-2 font-semibold text-blue-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>

        <SiteHeader />

        <div className="flex-1">
          {children}
        </div>

        <SiteFooter />
      </body>
    </html>
  )
}