import type { Metadata } from 'next'
import { Barlow_Condensed, Montserrat, Inter } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SpinBetter — Bonus powitalny do 6350 PLN + 150 Free Spinów',
  description:
    'Ekskluzywny pakiet powitalny SpinBetter. Odbierz do 6350 PLN bonusu i 150 darmowych spinów. Rejestracja w 2 minuty, bez kodu promocyjnego.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pl"
      className={`${barlow.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
