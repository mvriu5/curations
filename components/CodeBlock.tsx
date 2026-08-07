import "server-only"

import { codeToHtml, type BundledLanguage } from "shiki"

import { CodeBlockView } from "@/components/CodeBlockView"

type CodeBlockProps = {
    code: string
    language?: BundledLanguage
    filename?: string
    maxHeight?: number
    className?: string
}

export async function CodeBlock({ code, language = "tsx", filename, maxHeight = 384, className }: CodeBlockProps) {
    const html = await codeToHtml(code, {
        lang: language,
        theme: "github-light-default",
    })

    return <CodeBlockView code={code} html={html} filename={filename} maxHeight={maxHeight} className={className} />
}
