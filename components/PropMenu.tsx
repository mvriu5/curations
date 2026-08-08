"use client"

import { type ReactNode, useEffect, useId, useRef, useState } from "react"
import { SlidersHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { ColorInput } from "@/components/ColorInput"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export type PropMenuValue = string | number | boolean | number[] | undefined

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
          type: "number-array"
          placeholder?: string
          disabledWhen?: { key: string; value: PropMenuValue }
      })
    | (PropMenuFieldBase & {
          type: "text"
          placeholder?: string
      })
    | (PropMenuFieldBase & {
          type: "color"
          disabledWhen?: { key: string; value: PropMenuValue }
      })

export type PropMenuProps = {
    fields: PropMenuField[]
    values: Record<string, PropMenuValue>
    onValueChangeAction: (key: string, value: PropMenuValue) => void
    title?: string
    description?: string
    defaultOpen?: boolean
}

type PropFieldsProps = Pick<PropMenuProps, "fields" | "values" | "onValueChangeAction"> & {
    idPrefix: string
}

function NumberArrayInput({
    id,
    value,
    disabled,
    placeholder,
    onValueChangeAction,
}: {
    id: string
    value: PropMenuValue
    disabled: boolean
    placeholder?: string
    onValueChangeAction: (value: number[]) => void
}) {
    const serializedValue = Array.isArray(value) ? value.join(", ") : ""
    const [draftValue, setDraftValue] = useState(serializedValue)
    const parsedValue = parseNumberArray(draftValue)

    useEffect(() => setDraftValue(serializedValue), [serializedValue])

    return (
        <Input
            id={id}
            value={draftValue}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={parsedValue === null}
            onChange={(event) => {
                const nextValue = event.currentTarget.value
                const nextParsedValue = parseNumberArray(nextValue)
                setDraftValue(nextValue)
                if (nextParsedValue) onValueChangeAction(nextParsedValue)
            }}
            onBlur={() => setDraftValue(parsedValue ? parsedValue.join(", ") : serializedValue)}
        />
    )
}

function parseNumberArray(value: string) {
    if (!value.trim()) return []

    const entries = value.split(",").map((entry) => entry.trim())
    if (entries.some((entry) => !entry)) return null

    const values = entries.map(Number)
    return values.every(Number.isFinite) ? values : null
}

function FadedScrollArea({ children }: { children: ReactNode }) {
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const [showBottomFade, setShowBottomFade] = useState(false)

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector<HTMLElement>("[data-slot='scroll-area-viewport']")
        if (!viewport) return

        const updateFade = () => {
            const remainingScroll = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop
            setShowBottomFade(remainingScroll > 1)
        }

        const resizeObserver = new ResizeObserver(updateFade)
        resizeObserver.observe(viewport)
        if (viewport.firstElementChild) resizeObserver.observe(viewport.firstElementChild)
        viewport.addEventListener("scroll", updateFade, { passive: true })
        updateFade()

        return () => {
            resizeObserver.disconnect()
            viewport.removeEventListener("scroll", updateFade)
        }
    }, [])

    return (
        <div className="relative min-h-0 flex-1 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="size-full">
                {children}
            </ScrollArea>
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-stone-100 backdrop-blur-sm transition-opacity duration-200 [-webkit-mask-image:linear-gradient(to_top,black_0%,transparent_100%)] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]",
                    showBottomFade ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    )
}

function PropFields({ fields, values, onValueChangeAction, idPrefix }: PropFieldsProps) {
    return (
        <div className="flex flex-col gap-5 p-5">
            {fields.map((field) => {
                const controlId = `${idPrefix}-${field.key}`
                const value = values[field.key]
                const disabled = "disabledWhen" in field && field.disabledWhen ? values[field.disabledWhen.key] === field.disabledWhen.value : false

                if (field.type === "select") {
                    return (
                        <div key={field.key} className="grid gap-2">
                            <Label htmlFor={controlId}>{field.label}</Label>
                            <Select value={String(value)} onValueChange={(nextValue) => nextValue !== null && onValueChangeAction(field.key, nextValue)}>
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
                            <Switch id={controlId} checked={Boolean(value)} onCheckedChange={(checked) => onValueChangeAction(field.key, checked)} />
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
                                onChange={(event) => onValueChangeAction(field.key, event.target.value || undefined)}
                            />
                        </div>
                    )
                }

                if (field.type === "color") {
                    return (
                        <div key={field.key} className="grid gap-2">
                            <Label htmlFor={controlId}>{field.label}</Label>
                            <ColorInput
                                id={controlId}
                                label={field.label}
                                value={typeof value === "string" ? value : "#000000"}
                                disabled={disabled}
                                onValueChangeAction={(nextValue) => onValueChangeAction(field.key, nextValue)}
                            />
                        </div>
                    )
                }

                if (field.type === "number-array") {
                    return (
                        <div key={field.key} className="grid gap-2">
                            <Label htmlFor={controlId}>{field.label}</Label>
                            <NumberArrayInput
                                id={controlId}
                                value={value}
                                disabled={disabled}
                                placeholder={field.placeholder}
                                onValueChangeAction={(nextValue) => onValueChangeAction(field.key, nextValue)}
                            />
                        </div>
                    )
                }

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
                            onChange={(event) => {
                                const nextValue = event.currentTarget.valueAsNumber
                                if (Number.isFinite(nextValue)) onValueChangeAction(field.key, nextValue)
                            }}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export function PropMenu({ fields, values, onValueChangeAction, title = "Props", description = "Passe die Component-Props live an.", defaultOpen = true }: PropMenuProps) {
    const isMobile = useIsMobile()
    const [desktopOpen, setDesktopOpen] = useState(defaultOpen)
    const [mobileOpen, setMobileOpen] = useState(false)
    const panelId = useId()
    const open = isMobile ? mobileOpen : desktopOpen

    function toggleMenu() {
        if (isMobile) {
            setMobileOpen((current) => !current)
            return
        }

        setDesktopOpen((current) => !current)
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon-lg"
                className="fixed top-4 right-4 z-60"
                aria-label={open ? "Prop-Menü schließen" : "Prop-Menü öffnen"}
                aria-controls={`${panelId}-${isMobile ? "mobile" : "desktop"}`}
                aria-expanded={open}
                onClick={toggleMenu}
            >
                <HugeiconsIcon icon={SlidersHorizontalIcon} strokeWidth={2} aria-hidden="true" />
            </Button>

            <aside
                id={`${panelId}-desktop`}
                aria-label={title}
                inert={!desktopOpen || isMobile}
                className={cn(
                    "fixed top-16 right-4 bottom-4 z-20 hidden w-[min(20rem,calc(100vw-2rem))] transform-gpu flex-col overflow-hidden rounded-2xl border bg-stone-100 shadow-lg transition-transform duration-150 ease-out will-change-transform md:flex",
                    desktopOpen ? "translate-x-0" : "pointer-events-none translate-x-[calc(100%+1rem)]"
                )}
            >
                <FadedScrollArea>
                    <PropFields idPrefix={`${panelId}-desktop`} fields={fields} values={values} onValueChangeAction={onValueChangeAction} />
                </FadedScrollArea>
            </aside>

            {isMobile ? (
                <Drawer open={mobileOpen} onOpenChange={setMobileOpen} showSwipeHandle>
                    <DrawerContent id={`${panelId}-mobile`} className="h-[min(80dvh,40rem)] bg-stone-100">
                        <DrawerHeader hidden>
                            <DrawerTitle>{title}</DrawerTitle>
                            <DrawerDescription>{description}</DrawerDescription>
                        </DrawerHeader>
                        <FadedScrollArea>
                            <PropFields idPrefix={`${panelId}-mobile`} fields={fields} values={values} onValueChangeAction={onValueChangeAction} />
                        </FadedScrollArea>
                    </DrawerContent>
                </Drawer>
            ) : null}
        </>
    )
}
