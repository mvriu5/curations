import type { PropMenuField } from "@/components/PropMenu"

export type SliderShowcaseProps = {
    min: number
    max: number
    step: number
    lines: number
    variant: "default" | "gradient"
    shape: "default" | "cone-incline" | "cone-decline"
    showMajorLines: boolean
    animated: boolean
    animationSpeed: number
    minLabel?: string
    maxLabel?: string
    centerLabel?: string
    valueLabelSuffix?: string
    centerLabelSuffix?: string
}

export const curationPropConfigs = {
    slider: {
        defaults: {
            min: 10_000,
            max: 1_000_000,
            step: 10_000,
            lines: 48,
            variant: "gradient",
            shape: "cone-incline",
            showMajorLines: true,
            animated: true,
            animationSpeed: 240,
            minLabel: undefined,
            maxLabel: undefined,
            centerLabel: undefined,
            valueLabelSuffix: "people",
            centerLabelSuffix: undefined,
        } as SliderShowcaseProps,
        fields: [
            { key: "min", label: "Minimum", type: "number" },
            { key: "max", label: "Maximum", type: "number" },
            { key: "step", label: "Step", type: "number", min: 1 },
            { key: "lines", label: "Lines", type: "number", min: 2, max: 96 },
            {
                key: "variant",
                label: "Variant",
                type: "select",
                options: [
                    { label: "Default", value: "default" },
                    { label: "Gradient", value: "gradient" },
                ],
            },
            {
                key: "shape",
                label: "Shape",
                type: "select",
                options: [
                    { label: "Default", value: "default" },
                    { label: "Cone incline", value: "cone-incline" },
                    { label: "Cone decline", value: "cone-decline" },
                ],
            },
            { key: "showMajorLines", label: "Major lines", type: "switch" },
            { key: "animated", label: "Animated", type: "switch" },
            {
                key: "animationSpeed",
                label: "Animation speed",
                type: "number",
                min: 1,
                step: 30,
                disabledWhen: { key: "animated", value: false },
            },
            { key: "minLabel", label: "Minimum label", type: "text", placeholder: "Auto" },
            { key: "maxLabel", label: "Maximum label", type: "text", placeholder: "Auto" },
            { key: "centerLabel", label: "Center label", type: "text", placeholder: "Auto" },
            { key: "valueLabelSuffix", label: "Value suffix", type: "text" },
            { key: "centerLabelSuffix", label: "Center suffix", type: "text" },
        ] satisfies PropMenuField[],
    },
}
