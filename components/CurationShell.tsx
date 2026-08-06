import type { ReactNode } from "react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type CurationShellProps = {
    title: string
    description?: string
    children: ReactNode
    className?: string
}

export function CurationShell({ title, description, children, className }: CurationShellProps) {
    return (
        <>
            <Link
                href="/"
                aria-label="Zurück zur Startseite"
                className="fixed top-4 left-4 z-10 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
            </Link>

            <div className={cn("pt-16 pb-10 sm:py-14", className)}>
                <header className="mb-6 max-w-xl">
                    <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
                    {description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p> : null}
                </header>

                <main>{children}</main>
            </div>
        </>
    )
}
