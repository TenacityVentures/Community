import type React from "react"
import type { Metadata } from "next"
import { Crimson_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

/*const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})*/

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "10na.city — the city where builders belong.",
  description:
    "An Ecosystem for Ventures, Builders and Stories. Join the movement of founders and builders creating Africa's future.",
  keywords: "venture studio, african tech, startup, software development, AI automation, product development",
  authors: [{ name: "David Paul Conteh" }],
  icons: {
    icon: [
      {
        url: "/tenacitylogosmall.jpeg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/tenacitylogosmall.jpeg",
        media: "(prefers-color-scheme: dark)",
      },
      
    ],
    apple: "/tenacitylogosmall.jpeg",
  },
}

{/* {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
*/}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={` ${crimsonPro.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
