"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type SliderProps = {
    min: number
    max: number
    step?: number
    value: number
    onChange: (value: number) => void
    className?: string
    lines?: number
    minLabel?: string
    maxLabel?: string
    centerLabel?: string
    valueLabelSuffix?: string
    centerLabelSuffix?: string
    variant?: "default" | "gradient"
    shape?: "default" | "cone-incline" | "cone-decline"
    showMajorLines?: boolean
    animated?: boolean
    animationSpeed?: number
}

function formatValue(value: number, suffix?: string) {
    const label = new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
    return suffix ? `${label} ${suffix}` : label
}

export function Slider({
    min,
    max,
    step = 1,
    value,
    onChange,
    className,
    lines = 48,
    minLabel,
    maxLabel,
    centerLabel,
    valueLabelSuffix,
    centerLabelSuffix,
    variant = "default",
    shape = "default",
    showMajorLines = true,
    animated = true,
    animationSpeed = 240,
}: SliderProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    const lineCount = Math.max(2, lines)
    const range = max - min
    const clampedValue = Math.min(max, Math.max(min, value))
    const progress = range > 0 ? (clampedValue - min) / range : 0
    const activeLine = Math.round(progress * (lineCount - 1))
    const [animatedLine, setAnimatedLine] = useState(activeLine)
    const visibleActiveLine = animated ? Math.round(animatedLine) : activeLine
    const majorLines = new Set([0, Math.round((lineCount - 1) / 4), Math.round((lineCount - 1) / 2), Math.round(((lineCount - 1) * 3) / 4), lineCount - 1])
    const resolvedCenterLabel = centerLabel ?? `${formatValue(clampedValue, valueLabelSuffix)}${centerLabelSuffix ? ` ${centerLabelSuffix}` : ""}`

    useEffect(() => {
        if (!animated) return

        const interval = window.setInterval(() => {
            setAnimatedLine((currentLine) => {
                const distance = activeLine - currentLine
                const linesPerFrame = Math.max(animationSpeed, 1) / 60

                if (Math.abs(distance) <= linesPerFrame) {
                    window.clearInterval(interval)
                    return activeLine
                }

                return currentLine + Math.sign(distance) * linesPerFrame
            })
        }, 16)

        return () => window.clearInterval(interval)
    }, [activeLine, animated, animationSpeed])

    const updateValue = useCallback(
        (nextValue: number) => {
            const steppedValue = Math.round((nextValue - min) / step) * step + min
            onChange(Math.min(max, Math.max(min, steppedValue)))
        },
        [max, min, onChange, step]
    )

    const updateFromPointer = useCallback(
        (clientX: number) => {
            const track = trackRef.current
            if (!track || range <= 0) return

            const bounds = track.getBoundingClientRect()
            updateValue(min + ((clientX - bounds.left) / bounds.width) * range)
        },
        [min, range, updateValue]
    )

    return (
        <div className={cn("w-full", className)}>
            <div
                ref={trackRef}
                role="slider"
                tabIndex={0}
                aria-label="Slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={clampedValue}
                aria-valuetext={resolvedCenterLabel}
                className="flex h-16 touch-none cursor-pointer items-center gap-1 select-none outline-none active:cursor-grabbing"
                onPointerDown={(event) => {
                    event.preventDefault()
                    event.currentTarget.setPointerCapture(event.pointerId)
                    updateFromPointer(event.clientX)
                }}
                onPointerMove={(event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event.clientX)
                }}
                onKeyDown={(event) => {
                    const keyValues: Record<string, number> = {
                        ArrowLeft: clampedValue - step,
                        ArrowDown: clampedValue - step,
                        ArrowRight: clampedValue + step,
                        ArrowUp: clampedValue + step,
                        PageDown: clampedValue - step * 10,
                        PageUp: clampedValue + step * 10,
                        Home: min,
                        End: max,
                    }

                    if (keyValues[event.key] !== undefined) {
                        event.preventDefault()
                        updateValue(keyValues[event.key])
                    }
                }}
                onDragStart={(event) => event.preventDefault()}
            >
                {Array.from({ length: lineCount }, (_, index) => {
                    const distanceFromValue = Math.abs(index - visibleActiveLine)
                    const scale = distanceFromValue === 0 ? "scale-y-150" : distanceFromValue === 1 ? "scale-y-125" : distanceFromValue === 2 ? "scale-y-110" : "scale-y-100"
                    const lineProgress = index / (lineCount - 1)
                    const coneProgress = shape === "cone-decline" ? 1 - lineProgress : lineProgress
                    const baseHeight = shape === "default" ? 24 : 8 + coneProgress * 28
                    const isMajorLine = showMajorLines && majorLines.has(index)
                    const lineHeight = isMajorLine ? (shape === "default" ? 32 : Math.min(baseHeight + 4, 40)) : baseHeight

                    return (
                        <span
                            key={index}
                            aria-hidden="true"
                            className={cn(
                                "origin-center flex-1 rounded-full",
                                animated && "transition-[background-color,height,opacity,transform] duration-100 ease-out motion-reduce:transition-none",
                                scale,
                                index > visibleActiveLine ? "bg-muted opacity-40" : "opacity-100",
                                index <= visibleActiveLine && variant === "default" && "bg-foreground"
                            )}
                            style={{
                                height: `${lineHeight}px`,
                                transitionDuration: animated ? undefined : "0ms",
                                transitionProperty: animated ? undefined : "none",
                                ...(variant === "gradient" && index <= visibleActiveLine
                                    ? {
                                          backgroundImage: "linear-gradient(to right, #ff6b6b, #ffb86b, #72f896)",
                                          backgroundPosition: `${(index / (lineCount - 1)) * 100}% center`,
                                          backgroundSize: `${lineCount * 100}% 100%`,
                                      }
                                    : {}),
                            }}
                        />
                    )
                })}
            </div>

            <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
                <span>{minLabel ?? formatValue(min, valueLabelSuffix)}</span>
                <span className="text-center tabular-nums text-foreground">{resolvedCenterLabel}</span>
                <span className="text-right">{maxLabel ?? formatValue(max, valueLabelSuffix)}</span>
            </div>
        </div>
    )
}
