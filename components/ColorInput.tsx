"use client"

import { useEffect, useRef, useState } from "react"

import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i
const SHORT_HEX_COLOR_PATTERN = /^#[0-9a-f]{3}$/i

function normalizeHexColor(value: string) {
    const trimmedValue = value.trim()

    if (HEX_COLOR_PATTERN.test(trimmedValue)) return trimmedValue.toUpperCase()
    if (!SHORT_HEX_COLOR_PATTERN.test(trimmedValue)) return null

    const [red, green, blue] = trimmedValue.slice(1)
    return `#${red}${red}${green}${green}${blue}${blue}`.toUpperCase()
}

function hexToHsv(hex: string) {
    const red = Number.parseInt(hex.slice(1, 3), 16) / 255
    const green = Number.parseInt(hex.slice(3, 5), 16) / 255
    const blue = Number.parseInt(hex.slice(5, 7), 16) / 255
    const maximum = Math.max(red, green, blue)
    const minimum = Math.min(red, green, blue)
    const delta = maximum - minimum
    let hue = 0

    if (delta !== 0) {
        if (maximum === red) hue = 60 * (((green - blue) / delta) % 6)
        if (maximum === green) hue = 60 * ((blue - red) / delta + 2)
        if (maximum === blue) hue = 60 * ((red - green) / delta + 4)
    }

    return {
        hue: hue < 0 ? hue + 360 : hue,
        saturation: maximum === 0 ? 0 : delta / maximum,
        brightness: maximum,
    }
}

function hsvToHex(hue: number, saturation: number, brightness: number) {
    const chroma = brightness * saturation
    const hueSection = hue / 60
    const intermediate = chroma * (1 - Math.abs((hueSection % 2) - 1))
    const offset = brightness - chroma
    const [red, green, blue] =
        hueSection < 1
            ? [chroma, intermediate, 0]
            : hueSection < 2
              ? [intermediate, chroma, 0]
              : hueSection < 3
                ? [0, chroma, intermediate]
                : hueSection < 4
                  ? [0, intermediate, chroma]
                  : hueSection < 5
                    ? [intermediate, 0, chroma]
                    : [chroma, 0, intermediate]

    return `#${[red, green, blue]
        .map((channel) =>
            Math.round((channel + offset) * 255)
                .toString(16)
                .padStart(2, "0")
        )
        .join("")}`.toUpperCase()
}

export type ColorInputProps = {
    id?: string
    label?: string
    value: string
    disabled?: boolean
    className?: string
    onValueChangeAction: (value: string) => void
}

export function ColorInput({ id, label = "Farbe", value, disabled = false, className, onValueChangeAction }: ColorInputProps) {
    const colorAreaRef = useRef<HTMLDivElement>(null)
    const resolvedValue = normalizeHexColor(value)
    const pickerValue = resolvedValue ?? "#000000"
    const [draftValue, setDraftValue] = useState(pickerValue)
    const draftColor = normalizeHexColor(draftValue)
    const selectedColor = draftColor ?? pickerValue
    const parsedHsv = hexToHsv(selectedColor)
    const [hue, setHue] = useState(parsedHsv.hue)
    const hsv = { ...parsedHsv, hue }

    useEffect(() => {
        if (resolvedValue) setDraftValue(resolvedValue)
    }, [resolvedValue])

    useEffect(() => {
        if (parsedHsv.saturation > 0) setHue(parsedHsv.hue)
    }, [parsedHsv.hue, parsedHsv.saturation])

    function commitColor(nextValue: string) {
        const normalizedValue = normalizeHexColor(nextValue)
        if (!normalizedValue) return

        setDraftValue(normalizedValue)
        onValueChangeAction(normalizedValue)
    }

    function updateSaturationAndBrightness(clientX: number, clientY: number) {
        const colorArea = colorAreaRef.current
        if (!colorArea) return

        const bounds = colorArea.getBoundingClientRect()
        if (bounds.width <= 0 || bounds.height <= 0) return

        const saturation = Math.min(1, Math.max(0, (clientX - bounds.left) / bounds.width))
        const brightness = 1 - Math.min(1, Math.max(0, (clientY - bounds.top) / bounds.height))
        commitColor(hsvToHex(hsv.hue, saturation, brightness))
    }

    return (
        <div
            className={cn(
                "flex h-9 items-center gap-1 rounded-2xl border border-transparent bg-input/50 p-1 transition-[border-color,box-shadow,opacity] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
                !draftColor && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
                disabled && "pointer-events-none cursor-not-allowed opacity-50",
                className
            )}
        >
            <Popover>
                <PopoverTrigger
                    id={id}
                    disabled={disabled}
                    aria-label={`${label} auswählen`}
                    className="relative size-7 shrink-0 cursor-pointer rounded-xl border border-black/10 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    style={{ backgroundColor: selectedColor }}
                >
                    <span aria-hidden="true" className="absolute inset-0 rounded-[inherit] ring-1 ring-white/25 ring-inset" />
                </PopoverTrigger>

                <PopoverContent side="bottom" align="end" sideOffset={8} className="w-64 gap-3 rounded-2xl bg-stone-50 p-3">
                    <div className="flex items-center justify-between gap-3 px-0.5">
                        <PopoverTitle className="text-sm">{label}</PopoverTitle>
                        <span className="font-mono text-xs text-muted-foreground">{selectedColor}</span>
                    </div>

                    <div
                        ref={colorAreaRef}
                        role="slider"
                        tabIndex={0}
                        aria-label={`${label}: Sättigung und Helligkeit`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(hsv.saturation * 100)}
                        aria-valuetext={`${Math.round(hsv.saturation * 100)} Prozent Sättigung, ${Math.round(hsv.brightness * 100)} Prozent Helligkeit`}
                        className="relative h-36 touch-none overflow-hidden rounded-xl outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
                        style={{
                            backgroundColor: `hsl(${hsv.hue} 100% 50%)`,
                            backgroundImage: "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
                        }}
                        onPointerDown={(event) => {
                            event.preventDefault()
                            event.currentTarget.setPointerCapture(event.pointerId)
                            updateSaturationAndBrightness(event.clientX, event.clientY)
                        }}
                        onPointerMove={(event) => {
                            if (event.currentTarget.hasPointerCapture(event.pointerId)) updateSaturationAndBrightness(event.clientX, event.clientY)
                        }}
                        onPointerUp={(event) => {
                            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
                        }}
                        onPointerCancel={(event) => {
                            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
                        }}
                        onKeyDown={(event) => {
                            const increment = event.shiftKey ? 0.1 : 0.02
                            const nextValues: Record<string, [number, number]> = {
                                ArrowLeft: [hsv.saturation - increment, hsv.brightness],
                                ArrowRight: [hsv.saturation + increment, hsv.brightness],
                                ArrowDown: [hsv.saturation, hsv.brightness - increment],
                                ArrowUp: [hsv.saturation, hsv.brightness + increment],
                            }
                            const nextValue = nextValues[event.key]

                            if (nextValue) {
                                event.preventDefault()
                                commitColor(hsvToHex(hsv.hue, Math.min(1, Math.max(0, nextValue[0])), Math.min(1, Math.max(0, nextValue[1]))))
                            }
                        }}
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
                            style={{ left: `${hsv.saturation * 100}%`, top: `${(1 - hsv.brightness) * 100}%` }}
                        />
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={359}
                        value={Math.round(hsv.hue)}
                        aria-label={`${label}: Farbton`}
                        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)] outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.25)] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
                        onChange={(event) => {
                            const nextHue = event.currentTarget.valueAsNumber
                            setHue(nextHue)
                            commitColor(hsvToHex(nextHue, hsv.saturation, hsv.brightness))
                        }}
                    />
                </PopoverContent>
            </Popover>

            <input
                value={draftValue}
                disabled={disabled}
                aria-label={`${label} als Hex-Wert`}
                aria-invalid={!draftColor}
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent px-2 font-mono text-xs tracking-wide uppercase outline-none"
                onChange={(event) => {
                    const nextValue = event.currentTarget.value.toUpperCase()
                    setDraftValue(nextValue)

                    const normalizedValue = normalizeHexColor(nextValue)
                    if (normalizedValue) onValueChangeAction(normalizedValue)
                }}
                onBlur={() => setDraftValue(draftColor ?? pickerValue)}
            />
        </div>
    )
}
