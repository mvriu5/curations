import { Geist_Mono, Roboto, Roboto_Slab } from "next/font/google"

import { Container } from "@/components/Container"
import "./globals.css"
import { cn } from "@/lib/utils"

const robotoSlabHeading = Roboto_Slab({ subsets: ["latin"], variable: "--font-heading" })
const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", roboto.variable, robotoSlabHeading.variable)}>
            <body>
                <Container>{children}</Container>
            </body>
        </html>
    )
}
