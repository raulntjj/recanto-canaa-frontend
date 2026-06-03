import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/core/providers/query-provider'
import './globals.css'

// Fonte elegante para títulos (Hotel Boutique Premium)
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

// Fonte moderna para corpo
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Chácara Recanto Canaã | Caratinga MG',
  description:
    'Experimente o melhor do turismo rural na Chácara Recanto Canaã em Caratinga, MG. Hospedagem exclusiva, eventos memoráveis e gastronomia autêntica.',
  keywords: [
    'chácara',
    'recanto canaã',
    'hospedagem',
    'eventos',
    'casamento',
    'turismo rural',
    'caratinga',
  ],
  openGraph: {
    title: 'Chácara Recanto Canaã | Caratinga MG',
    description: 'Sua experiência exclusiva no campo em Caratinga',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport = {
  themeColor: '#1a472a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
