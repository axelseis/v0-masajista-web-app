import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const _cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Sylvie Le Roux | Masaje Terapéutico en Barcelona',
  description:
    'Terapias corporales enfocadas en la reconexión y el bienestar. Masaje Californiano, Deep Tissue, Neurosedante y Acompañamiento Corporal en Sant Andreu, Barcelona.',
  keywords: ['masaje', 'Barcelona', 'terapia corporal', 'bienestar', 'relajación', 'deep tissue', 'masaje californiano'],
  icons: {
    icon: '/blau_logo.svg',
    apple: '/blau_logo.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#2f6c80',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_cormorant.variable} ${_inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
