import type { ReactNode } from "react"

import { CurationShell } from "@/components/CurationShell"

export default function SliderLayout({ children }: { children: ReactNode }) {
    return (
        <CurationShell title="Slider" description="A tactile range control built from responsive tick marks, with compact value labels and full keyboard support." componentFile="Slider.tsx">
            {children}
        </CurationShell>
    )
}
