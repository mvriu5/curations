"use client"

import { useState } from "react"

import { CurationShell } from "@/components/CurationShell"
import { Slider } from "@/curations/Slider"

export default function SliderPage() {
    const [value, setValue] = useState(420_000)

    return (
        <CurationShell title="Slider" description="A tactile range control built from responsive tick marks, with compact value labels and full keyboard support.">
            <section>
                <div className="w-full rounded-[2rem] border border-white/10 bg-stone-100 p-6">
                    <div className="mb-12 flex items-end justify-between gap-6">
                        <div>
                            <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-white/40 uppercase">Monthly reach</p>
                            <p className="mt-2 text-lg text-white/80">Choose your audience size</p>
                        </div>
                        <output className="font-heading text-3xl tabular-nums sm:text-4xl" aria-live="polite">
                            {value.toLocaleString("en-US")}
                        </output>
                    </div>

                    <Slider
                        min={10_000}
                        max={1_000_000}
                        step={10_000}
                        value={value}
                        onChange={setValue}
                        ariaLabel="Monthly reach"
                        valueLabelSuffix="people"
                        variant="gradient"
                        shape="cone-incline"
                        animated
                        animationSpeed={240}
                    />

                    <p className="mt-10 border-t border-white/10 pt-5 text-xs leading-5 text-white/35">Drag across the scale or use the arrow, Page Up, Page Down, Home, and End keys.</p>
                </div>
            </section>
        </CurationShell>
    )
}
