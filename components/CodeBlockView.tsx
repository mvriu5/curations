"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown01Icon, ArrowUp01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type CodeBlockViewProps = {
    code: string
    html: string
    filename?: string
    maxHeight: number
    className?: string
}

export function CodeBlockView({ code, html, filename, maxHeight, className }: CodeBlockViewProps) {
    const [expanded, setExpanded] = useState(false)
    const [copied, setCopied] = useState(false)
    const copyTimeout = useRef<number | undefined>(undefined)

    useEffect(() => {
        return () => window.clearTimeout(copyTimeout.current)
    }, [])

    async function copyCode() {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        window.clearTimeout(copyTimeout.current)
        copyTimeout.current = window.setTimeout(() => setCopied(false), 1600)
    }

    return (
        <figure className={cn("overflow-hidden rounded-2xl border bg-stone-100 text-zinc-950", className)}>
            <figcaption className="flex min-h-11 items-center justify-between gap-3 border-b border-zinc-200 pr-2 pl-4">
                <span className="truncate font-mono text-xs text-zinc-500">{filename ?? "Code"}</span>
                <Button variant="ghost" size="sm" className="text-zinc-600 hover:bg-stone-200! py-1! px-1.5! rounded-xl! hover:text-zinc-950" onClick={copyCode}>
                    <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} strokeWidth={2} />
                </Button>
            </figcaption>

            <div className="relative">
                <ScrollArea scrollbars="both" className={cn("w-full bg-white", expanded && "h-auto")} style={expanded ? undefined : { height: maxHeight }}>
                    <div
                        className="text-sm [&_.line-number]:sticky [&_.line-number]:left-0 [&_.line-number]:inline-block [&_.line-number]:w-6 [&_.line-number]:border-r [&_.line-number]:border-zinc-200/70 [&_.line-number]:bg-stone-100 [&_.line-number]:pr-3 [&_.line-number]:text-right [&_.line-number]:text-zinc-400 [&_.line-number]:select-none [&_.line]:min-h-lh [&_code]:font-mono [&_pre]:w-max [&_pre]:min-w-full [&_pre]:bg-stone-100! [&_pre]:px-4 [&_pre]:pb-16 [&_pre]:leading-6"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </ScrollArea>

                <Button
                    variant="ghost"
                    className="absolute inset-x-0 bottom-0 z-10 h-12 w-full rounded-none border-t border-b-0 border-x-0 border-zinc-200 bg-white/70 text-zinc-600 backdrop-blur-md hover:bg-white/85 hover:text-zinc-950"
                    onClick={() => setExpanded((current) => !current)}
                    aria-expanded={expanded}
                >
                    <HugeiconsIcon icon={expanded ? ArrowUp01Icon : ArrowDown01Icon} strokeWidth={2} />
                    {expanded ? "Collapse" : "Show full"}
                </Button>
            </div>
        </figure>
    )
}
