export function SiteFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
            <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-2">
                <div>
                    <p className="font-bold text-white">
                        Curriculum Truth Ledger
                    </p>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                        A transparent record connecting curriculum claims with official
                        sources and human-reviewed evidence.
                    </p>
                </div>

                <div className="md:text-right">
                    <p className="text-sm font-semibold text-white">
                        Evidence before assertion
                    </p>

                    <p className="mt-3 text-sm text-slate-400">
                        Sanity project ID: dxnjdo5l
                    </p>
                </div>
            </div>

            <div className="border-t border-slate-800">
                <div className="mx-auto max-w-6xl px-6 py-5 text-sm text-slate-500">
                    © {currentYear} Rajab Baig. Curriculum evidence project.
                </div>
            </div>
        </footer>
    )
}