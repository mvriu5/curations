import type { PropMenuField } from "@/components/PropMenu"

export type SliderShowcaseProps = {
    min: number
    max: number
    step: number
    name?: string
    disabled: boolean
    size: "sm" | "md" | "lg"
    lines: number
    variant: "default" | "gradient"
    activeColor: string
    inactiveColor: string
    shape: "default" | "cone-incline" | "cone-decline"
    showMajorLines: boolean
    majorLines: number[]
    animationSpeed: number
}

export const curationPropConfigs = {
    slider: {
        defaults: {
            min: 10_000,
            max: 1_000_000,
            step: 10_000,
            name: undefined,
            disabled: false,
            size: "md",
            lines: 48,
            variant: "gradient",
            activeColor: "#1c1917",
            inactiveColor: "#d6d3d1",
            shape: "cone-incline",
            showMajorLines: true,
            majorLines: [0, 12, 24, 35, 47],
            animationSpeed: 240,
        } as SliderShowcaseProps,
        fields: [
            { key: "min", label: "Minimum", type: "number" },
            { key: "max", label: "Maximum", type: "number" },
            { key: "step", label: "Step", type: "number", min: 1 },
            { key: "name", label: "Form name", type: "text", placeholder: "Optional" },
            { key: "disabled", label: "Disabled", type: "switch" },
            {
                key: "size",
                label: "Size",
                type: "select",
                options: [
                    { label: "Small", value: "sm" },
                    { label: "Medium", value: "md" },
                    { label: "Large", value: "lg" },
                ],
            },
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
            { key: "activeColor", label: "Active color", type: "color", disabledWhen: { key: "variant", value: "gradient" } },
            { key: "inactiveColor", label: "Inactive color", type: "color" },
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
            {
                key: "majorLines",
                label: "Major line indexes",
                type: "number-array",
                placeholder: "0, 12, 24, 35, 47",
                disabledWhen: { key: "showMajorLines", value: false },
            },
            {
                key: "animationSpeed",
                label: "Animation speed",
                type: "number",
                min: 1,
                max: 1200,
                step: 30,
            },
        ] satisfies PropMenuField[],
    },
}
