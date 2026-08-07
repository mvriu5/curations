"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type SliderProps = {
    min: number
    max: number
    step?: number
    value: number
    onChange: (value: number) => void
    onValueCommitAction?: (value: number) => void
    disabled?: boolean
    size?: "sm" | "md" | "lg"
    className?: string
    lines?: number
    minLabel?: string
    maxLabel?: string
    centerLabel?: string
    variant?: "default" | "gradient"
    activeColor?: string
    inactiveColor?: string
    shape?: "default" | "cone-incline" | "cone-decline"
    showMajorLines?: boolean
    animationSpeed?: number
}

function formatValue(value: number) {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
}

export function Slider({
    min,
    max,
    step = 1,
    value,
    onChange,
    onValueCommitAction,
    disabled = false,
    size = "md",
    className,
    lines = 48,
    minLabel,
    maxLabel,
    centerLabel,
    variant = "default",
    activeColor = "currentColor",
    inactiveColor = "var(--muted)",
    shape = "default",
    showMajorLines = true,
    animationSpeed = 240,
}: SliderProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    const committedValueRef = useRef(value)
    const lineCount = Math.max(2, lines)
    const range = max - min
    const clampedValue = Math.min(max, Math.max(min, value))
    const progress = range > 0 ? (clampedValue - min) / range : 0
    const activeLine = Math.round(progress * (lineCount - 1))
    const [animatedLine, setAnimatedLine] = useState(activeLine)
    const [isDragging, setIsDragging] = useState(false)
    const shouldAnimate = !isDragging
    const visibleActiveLine = shouldAnimate ? Math.round(animatedLine) : activeLine
    const sizeStyles = {
        sm: { track: "h-12", label: "text-[0.6875rem]", baseHeight: 18, coneMinHeight: 6, coneHeightRange: 20, majorHeight: 24, coneMajorMax: 30 },
        md: { track: "h-16", label: "text-xs", baseHeight: 24, coneMinHeight: 8, coneHeightRange: 28, majorHeight: 32, coneMajorMax: 40 },
        lg: { track: "h-20", label: "text-sm", baseHeight: 30, coneMinHeight: 10, coneHeightRange: 36, majorHeight: 40, coneMajorMax: 50 },
    }[size]
    const majorLines = new Set([0, Math.round((lineCount - 1) / 4), Math.round((lineCount - 1) / 2), Math.round(((lineCount - 1) * 3) / 4), lineCount - 1])
    const resolvedCenterLabel = centerLabel ?? formatValue(clampedValue)

    useEffect(() => {
        if (!shouldAnimate) {
            setAnimatedLine(activeLine)
            return
        }

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
    }, [activeLine, animationSpeed, shouldAnimate])

    const updateValue = useCallback(
        (nextValue: number) => {
            const steppedValue = Math.round((nextValue - min) / step) * step + min
            const resolvedValue = Math.min(max, Math.max(min, steppedValue))
            committedValueRef.current = resolvedValue
            onChange(resolvedValue)
            return resolvedValue
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
                aria-label="Slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={clampedValue}
                aria-valuetext={resolvedCenterLabel}
                aria-disabled={disabled || undefined}
                className={cn("flex touch-none items-center gap-1 select-none outline-none", sizeStyles.track, disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer active:cursor-grabbing")}
                tabIndex={disabled ? -1 : 0}
                onPointerDown={(event) => {
                    if (disabled) return
                    event.preventDefault()
                    setIsDragging(false)
                    event.currentTarget.setPointerCapture(event.pointerId)
                    updateFromPointer(event.clientX)
                }}
                onPointerMove={(event) => {
                    if (disabled) return
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                        setIsDragging(true)
                        updateFromPointer(event.clientX)
                    }
                }}
                onPointerUp={(event) => {
                    setIsDragging(false)
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
                    onValueCommitAction?.(committedValueRef.current)
                }}
                onPointerCancel={(event) => {
                    setIsDragging(false)
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
                }}
                onKeyDown={(event) => {
                    if (disabled) return
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
                        onValueCommitAction?.(updateValue(keyValues[event.key]))
                    }
                }}
                onDragStart={(event) => event.preventDefault()}
            >
                {Array.from({ length: lineCount }, (_, index) => {
                    const distanceFromValue = Math.abs(index - visibleActiveLine)
                    const scale = distanceFromValue === 0 ? "scale-y-150" : distanceFromValue === 1 ? "scale-y-125" : distanceFromValue === 2 ? "scale-y-110" : "scale-y-100"
                    const lineProgress = index / (lineCount - 1)
                    const coneProgress = shape === "cone-decline" ? 1 - lineProgress : lineProgress
                    const baseHeight = shape === "default" ? sizeStyles.baseHeight : sizeStyles.coneMinHeight + coneProgress * sizeStyles.coneHeightRange
                    const isMajorLine = showMajorLines && majorLines.has(index)
                    const lineHeight = isMajorLine ? (shape === "default" ? sizeStyles.majorHeight : Math.min(baseHeight + 4, sizeStyles.coneMajorMax)) : baseHeight

                    return (
                        <span
                            key={index}
                            aria-hidden="true"
                            className={cn(
                                "origin-center flex-1 rounded-full",
                                shouldAnimate && "transition-[background-color,height,opacity,transform] duration-100 ease-out motion-reduce:transition-none",
                                scale,
                                index > visibleActiveLine ? "opacity-40" : "opacity-100"
                            )}
                            style={{
                                height: `${lineHeight}px`,
                                backgroundColor: index > visibleActiveLine ? inactiveColor : variant === "default" ? activeColor : undefined,
                                transitionDuration: shouldAnimate ? undefined : "0ms",
                                transitionProperty: shouldAnimate ? undefined : "none",
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

            <div className={cn("mt-2 grid grid-cols-3 text-muted-foreground", sizeStyles.label)}>
                <span>{minLabel ?? formatValue(min)}</span>
                <span className="text-center tabular-nums text-foreground">{resolvedCenterLabel}</span>
                <span className="text-right">{maxLabel ?? formatValue(max)}</span>
            </div>
        </div>
    )
}
