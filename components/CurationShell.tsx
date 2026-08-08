import type { ReactNode } from "react"
import { readFile } from "node:fs/promises"
import { basename, isAbsolute, relative, resolve } from "node:path"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import type { BundledLanguage } from "shiki"

import { CodeBlock } from "@/components/CodeBlock"
import { cn } from "@/lib/utils"

type CurationShellProps = {
    title: string
    description?: string
    componentFile: string
    codeLanguage?: BundledLanguage
    children: ReactNode
    className?: string
}

export async function CurationShell({ title, description, componentFile, codeLanguage = "tsx", children, className }: CurationShellProps) {
    const curationsRoot = resolve(process.cwd(), "curations")
    const resolvedComponentPath = resolve(curationsRoot, componentFile)
    const relativeComponentPath = relative(curationsRoot, resolvedComponentPath)

    if (relativeComponentPath.startsWith("..") || isAbsolute(relativeComponentPath)) {
        throw new Error("Curation component path must stay within the project root.")
    }

    const sourceCode = await readFile(resolvedComponentPath, "utf8")

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
                    <h1 className="text-2xl font-medium tracking-tight font-heading">{title}</h1>
                    {description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p> : null}
                </header>

                <main>{children}</main>

                <CodeBlock code={sourceCode} language={codeLanguage} filename={basename(componentFile)} className="mt-10" />
            </div>
        </>
    )
}
