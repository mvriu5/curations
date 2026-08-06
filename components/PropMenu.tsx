"use client"

import { useId, useState } from "react"
import { SlidersHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export type PropMenuValue = string | number | boolean | undefined

type PropMenuFieldBase = {
    key: string
    label: string
}

export type PropMenuField =
    | (PropMenuFieldBase & {
          type: "select"
          options: Array<{ label: string; value: string }>
      })
    | (PropMenuFieldBase & {
          type: "switch"
      })
    | (PropMenuFieldBase & {
          type: "number"
          min?: number
          max?: number
          step?: number
          disabledWhen?: { key: string; value: PropMenuValue }
      })
    | (PropMenuFieldBase & {
          type: "text"
          placeholder?: string
      })

export type PropMenuProps = {
    fields: PropMenuField[]
    values: Record<string, PropMenuValue>
    onValueChange: (key: string, value: PropMenuValue) => void
    title?: string
    description?: string
    defaultOpen?: boolean
}

export function PropMenu({ fields, values, onValueChange, title = "Props", description = "Passe die Component-Props live an.", defaultOpen = true }: PropMenuProps) {
    const [open, setOpen] = useState(defaultOpen)
    const panelId = useId()

    return (
        <>
            <Button
                variant="ghost"
                size="icon-lg"
                className="fixed top-4 right-4 z-30"
                aria-label={open ? "Prop-Menü schließen" : "Prop-Menü öffnen"}
                aria-controls={panelId}
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
            >
                <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={2} aria-hidden="true" />
            </Button>

            <aside
                id={panelId}
                aria-label={title}
                inert={!open}
                className={cn(
                    "fixed top-16 right-4 bottom-4 z-20 flex w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-background shadow-lg transition-[opacity,transform,visibility] duration-200",
                    open ? "visible translate-x-0 opacity-100" : "invisible translate-x-4 opacity-0"
                )}
            >
                <header className="border-b p-5">
                    <h2 className="font-heading text-base font-medium">{title}</h2>
                    {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
                </header>

                <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
                    {fields.map((field) => {
                        const controlId = `${panelId}-${field.key}`
                        const value = values[field.key]

                        if (field.type === "select") {
                            return (
                                <div key={field.key} className="grid gap-2">
                                    <Label htmlFor={controlId}>{field.label}</Label>
                                    <Select value={String(value)} onValueChange={(nextValue) => nextValue !== null && onValueChange(field.key, nextValue)}>
                                        <SelectTrigger id={controlId} className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {field.options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }

                        if (field.type === "switch") {
                            return (
                                <div key={field.key} className="flex items-center justify-between gap-4">
                                    <Label htmlFor={controlId}>{field.label}</Label>
                                    <Switch id={controlId} checked={Boolean(value)} onCheckedChange={(checked) => onValueChange(field.key, checked)} />
                                </div>
                            )
                        }

                        if (field.type === "text") {
                            return (
                                <div key={field.key} className="grid gap-2">
                                    <Label htmlFor={controlId}>{field.label}</Label>
                                    <Input
                                        id={controlId}
                                        value={typeof value === "string" ? value : ""}
                                        placeholder={field.placeholder}
                                        onChange={(event) => onValueChange(field.key, event.target.value || undefined)}
                                    />
                                </div>
                            )
                        }

                        const disabled = field.disabledWhen ? values[field.disabledWhen.key] === field.disabledWhen.value : false

                        return (
                            <div key={field.key} className="grid gap-2">
                                <Label htmlFor={controlId}>{field.label}</Label>
                                <Input
                                    id={controlId}
                                    type="number"
                                    value={Number(value)}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step}
                                    disabled={disabled}
                                    onChange={(event) => onValueChange(field.key, Number(event.target.value))}
                                />
                            </div>
                        )
                    })}
                </div>
            </aside>
        </>
    )
}
