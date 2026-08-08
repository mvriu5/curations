import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

const curations = [
    {
        title: "Slider",
        description: "A tactile range control with responsive tick marks and full keyboard support.",
        href: "/slider",
    },
]

export default function Page() {
    return (
        <main className="min-h-svh py-16 sm:py-24">
            <header className="max-w-2xl">
                <h1 className="font-heading text-[clamp(4rem,15vw,8rem)] leading-[0.82] font-medium tracking-[-0.065em]">Curations</h1>
                <p className="mt-7 max-w-md text-sm leading-6 text-muted-foreground">A growing collection of focused, reusable interface components and interaction experiments.</p>
            </header>

            <section aria-labelledby="components-heading" className="mt-24 sm:mt-32">
                <h2 id="components-heading" className="mb-4 font-mono text-[0.6875rem] tracking-[0.2em] text-muted-foreground uppercase">
                    Components
                </h2>

                <div className="border-t">
                    {curations.map((curation, index) => (
                        <Link
                            key={curation.href}
                            href={curation.href}
                            className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b py-6 transition-colors hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none sm:grid-cols-[3rem_1fr_auto] sm:py-8"
                        >
                            <span className="font-mono text-[0.6875rem] tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                            <span className="min-w-0">
                                <span className="block text-xl font-medium tracking-tight text-foreground sm:text-2xl">{curation.title}</span>
                                <span className="mt-1 block max-w-lg text-sm leading-5 text-muted-foreground">{curation.description}</span>
                            </span>
                            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.75} aria-hidden="true" className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    )
}
