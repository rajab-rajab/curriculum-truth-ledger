# Curriculum Truth Ledger

An evidence-first web application for recording curriculum claims, connecting them to official sources, and presenting precise human-reviewed evidence.

Curriculum Truth Ledger was created for the **Sanity DEV Challenge**, following **Path Two: Vibe-Code Something Strange**.

## Live project

* **Web application:** https://curriculum-truth-ledger.vercel.app
* **Sanity Studio:** https://curriculum-truth-ledger.sanity.studio
* **GitHub repository:** https://github.com/rajab-rajab/curriculum-truth-ledger
* **Sanity project ID:** `dxnjdo5l`

## Project purpose

Curriculum information is often presented as an unsupported statement. Curriculum Truth Ledger provides a transparent alternative by preserving the complete verification chain:

```text
Curriculum claim
    ↓
Official source
    ↓
Exact evidence excerpt
    ↓
Human review and analysis
    ↓
Verification status
```

Every conclusion remains connected to its evidence and official source document.

## Current verified claim

**Programming is included in Grade 10 Computer Science education**

The claim is supported by two learning outcomes from the official Punjab Grade 10 Computer Science textbook:

1. **Introduction to Python programming**

   * “Understand basic programming concepts and set up a Python development environment.”
   * Unit 3, *Introduction to Python Programming*, Student Learning Outcomes, printed page 40

2. **Python control structures**

   * “Implement control structures such as decision-making statements and loops in Python.”
   * Unit 4, *Control Structures in Python*, Student Learning Outcomes, printed page 55

Both evidence records were reviewed by **Rajab Baig** and reference the official textbook published by the **Punjab Education Curriculum Training and Assessment Authority (PECTAA)**.

## Main features

* Structured curriculum claims
* Official source records
* Uploaded source-document support
* Precise evidence excerpts and locations
* Human reviewer analysis
* Verification status tracking
* Evidence confidence levels
* Search across claims and evidence
* Subject, grade, and verification-status filters
* Published-record summary statistics
* Individual claim-detail pages
* Responsive navigation and layout
* Accessibility support
* Search-engine and social metadata
* Direct links to official websites and source documents

## Content model

The Sanity Studio contains three main document types:

### Curriculum Claim

Stores the statement being evaluated, including:

* Claim title
* Claim statement
* Subject
* Grade level
* Jurisdiction
* Verification status
* Explanation
* Slug
* Last verification date

### Official Source

Stores information about the authoritative source, including:

* Source title
* Publisher or authority
* Jurisdiction
* Official website
* Uploaded source document

### Evidence Record

Connects a claim to an official source and stores:

* Evidence title
* Exact excerpt
* Location in the source
* Position: supports, contradicts, or contextual
* Confidence level
* Reviewer analysis
* Reviewer name
* Review date

## Technology stack

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Sanity](https://www.sanity.io/)
* [GROQ](https://www.sanity.io/docs/groq)
* [Vercel](https://vercel.com/)

## System architecture

```text
Sanity Studio
    ↓
Structured curriculum content
    ↓
Sanity production dataset
    ↓
GROQ queries
    ↓
Next.js application
    ↓
Published claims, evidence, and official documents
```

## Project structure

```text
curriculum-truth-ledger-web/
├── app/
│   ├── claims/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SiteFooter.tsx
│   └── SiteHeader.tsx
├── public/
├── sanity/
│   └── client.ts
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── vercel.json
```

## Local development

### Prerequisites

* Node.js 22 or later
* npm
* Access to the configured public Sanity dataset

### Installation

Clone the repository:

```bash
git clone https://github.com/rajab-rajab/curriculum-truth-ledger.git
cd curriculum-truth-ledger
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=dxnjdo5l
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-09-21
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in a browser.

## Available commands

```bash
npm run dev
```

Starts the local development server.

```bash
npm run lint
```

Runs ESLint checks.

```bash
npm run build
```

Creates an optimized production build.

```bash
npm run start
```

Runs the production build locally.

## Verification status

The application currently supports these verification states:

* Unverified
* Under review
* Verified
* Disputed
* Outdated

## Quality checks

The project has successfully passed:

* ESLint validation
* TypeScript validation
* Next.js production compilation
* Static and dynamic route generation
* Local browser testing
* Production deployment testing

Current routes:

```text
/
└── /claims/[slug]
```

## Deployment

The frontend is deployed on Vercel:

https://curriculum-truth-ledger.vercel.app

The content-management interface is deployed through Sanity:

https://curriculum-truth-ledger.sanity.studio

## Future development

Potential extensions include:

* Additional curriculum subjects and grade levels
* Multiple jurisdictions and curriculum boards
* Evidence comparison tools
* Claim revision history
* Reviewer profiles
* Structured citation export
* Public contribution and moderation workflows
* More detailed verification analytics

## Challenge information

* **Challenge:** Sanity DEV Challenge
* **Path:** Path Two — Vibe-Code Something Strange
* **Sanity project ID:** `dxnjdo5l`
* **Creator:** Rajab Baig
* **Location:** Punjab, Pakistan

## Author

**Rajab Baig**

Information Technology Teacher and developer interested in education, curriculum transparency, artificial intelligence, and evidence-based systems.

* GitHub: https://github.com/rajab-rajab
* LinkedIn: https://www.linkedin.com/in/rajab-baig-1a84b0432/
