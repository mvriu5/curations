"use client"

import { useEffect, useState } from "react"

import { PropMenu } from "@/components/PropMenu"
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
        <>
            <PropMenu
                title="Slider props"
                fields={sliderConfig.fields}
                values={sliderProps}
                onValueChangeAction={(key, nextValue) => setSliderProps((current) => ({ ...current, [key]: nextValue }) as SliderShowcaseProps)}
            />

            <section>
                <div className="w-full rounded-2xl border bg-stone-100 p-6">
                    <Slider value={value} onChangeAction={setValue} {...sliderProps} />
                </div>
            </section>
        </>
    )
}
