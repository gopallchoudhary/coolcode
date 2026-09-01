import { Head } from 'nextra/components'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

export const metadata = {
  title: {
    default: 'coolcode',
    template: '%s — coolcode'
  },
  description: 'The open source terminal AI coding agent.'
}

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={jetbrainsMono.variable}
    >
      <Head
        // Primary = {colors.ink} #201d1d -> hsl(0, 5%, 12%)
        color={{ hue: 0, saturation: 5, lightness: 12 }}
        // Background = {colors.canvas} #fdfcfc
        backgroundColor={{ light: 'rgb(253,252,252)', dark: 'rgb(253,252,252)' }}
        faviconGlyph="❯"
      />
      <body>{children}</body>
    </html>
  )
}
