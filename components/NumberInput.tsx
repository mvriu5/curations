"use client"

import { useEffect, useState } from "react"
import { Add01Icon, MinusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

export type NumberInputProps = {
    id?: string
    value: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    className?: string
    onValueChangeAction: (value: number) => void
}

function getDecimalPlaces(value: number) {
    const [coefficient, exponent = "0"] = String(value).toLowerCase().split("e")
    const decimals = coefficient.split(".")[1]?.length ?? 0
    return Math.max(0, decimals - Number(exponent))
}

export function NumberInput({ id, value, min, max, step = 1, disabled = false, className, onValueChangeAction }: NumberInputProps) {
    const resolvedValue = Number.isFinite(value) ? value : 0
    const resolvedStep = Number.isFinite(step) && step > 0 ? step : 1
    const [draftValue, setDraftValue] = useState(String(resolvedValue))
    const parsedValue = draftValue.trim() ? Number(draftValue) : Number.NaN
    const isWithinRange = Number.isFinite(parsedValue) && (min === undefined || parsedValue >= min) && (max === undefined || parsedValue <= max)
    const canDecrease = !disabled && (min === undefined || resolvedValue > min)
    const canIncrease = !disabled && (max === undefined || resolvedValue < max)

    useEffect(() => setDraftValue(String(resolvedValue)), [resolvedValue])

    function changeBy(direction: -1 | 1) {
        const precision = Math.max(getDecimalPlaces(resolvedValue), getDecimalPlaces(resolvedStep), min === undefined ? 0 : getDecimalPlaces(min))
        const nextValue = Number((resolvedValue + resolvedStep * direction).toFixed(precision))
        const clampedValue = Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min ?? Number.NEGATIVE_INFINITY, nextValue))

        setDraftValue(String(clampedValue))
        onValueChangeAction(clampedValue)
    }

    return (
        <div
            className={cn(
                "flex h-8 items-center rounded-2xl border border-transparent bg-input/50 transition-[border-color,box-shadow,opacity] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
                !isWithinRange && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
                disabled && "opacity-50",
                className
            )}
        >
            <button
                type="button"
                disabled={!canDecrease}
                aria-label="Wert verringern"
                className="flex size-8 shrink-0 items-center justify-center rounded-l-2xl text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-30"
                onClick={() => changeBy(-1)}
            >
                <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} className="size-3.5" />
            </button>

            <input
                id={id}
                type="text"
                role="spinbutton"
                inputMode="decimal"
                value={draftValue}
                disabled={disabled}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={isWithinRange ? parsedValue : undefined}
                aria-invalid={!isWithinRange}
                className="h-full min-w-0 flex-1 bg-transparent px-1 text-center text-sm tabular-nums outline-none disabled:cursor-not-allowed"
                onChange={(event) => {
                    const nextDraftValue = event.currentTarget.value
                    const nextValue = Number(nextDraftValue)
                    const nextValueIsValid = nextDraftValue.trim() !== "" && Number.isFinite(nextValue) && (min === undefined || nextValue >= min) && (max === undefined || nextValue <= max)

                    setDraftValue(nextDraftValue)
                    if (nextValueIsValid) onValueChangeAction(nextValue)
                }}
                onBlur={() => setDraftValue(isWithinRange ? String(parsedValue) : String(resolvedValue))}
                onKeyDown={(event) => {
                    if (event.key === "ArrowDown" && canDecrease) {
                        event.preventDefault()
                        changeBy(-1)
                    }
                    if (event.key === "ArrowUp" && canIncrease) {
                        event.preventDefault()
                        changeBy(1)
                    }
                }}
            />

            <button
                type="button"
                disabled={!canIncrease}
                aria-label="Wert erhöhen"
                className="flex size-8 shrink-0 items-center justify-center rounded-r-2xl text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-30"
                onClick={() => changeBy(1)}
            >
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="size-3.5" />
            </button>
        </div>
    )
}
