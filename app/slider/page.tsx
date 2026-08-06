"use client"

import { useEffect, useState } from "react"

import { CurationShell } from "@/components/CurationShell"
import { Slider } from "@/curations/Slider"
import { curationPropConfigs, type SliderShowcaseProps } from "@/curations/prop-configs"

const sliderConfig = curationPropConfigs.slider

export default function SliderPage() {
    const [value, setValue] = useState(420_000)
    const [sliderProps, setSliderProps] = useState<SliderShowcaseProps>(sliderConfig.defaults)

    useEffect(() => {
        setValue((current) => Math.min(sliderProps.max, Math.max(sliderProps.min, current)))
    }, [sliderProps.max, sliderProps.min])

    return (
        <CurationShell
            title="Slider"
            description="A tactile range control built from responsive tick marks, with compact value labels and full keyboard support."
            propMenu={{
                fields: sliderConfig.fields,
                values: sliderProps,
                onValueChange: (key, nextValue) => setSliderProps((current) => ({ ...current, [key]: nextValue }) as SliderShowcaseProps),
            }}
        >
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

                    <Slider value={value} onChange={setValue} {...sliderProps} />

                    <p className="mt-10 border-t border-white/10 pt-5 text-xs leading-5 text-white/35">Drag across the scale or use the arrow, Page Up, Page Down, Home, and End keys.</p>
                </div>
            </section>
        </CurationShell>
    )
}
