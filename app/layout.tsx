import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import './globals.css'
import ShopLayoutWrapper from '@/components/layout/ShopLayoutWrapper'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GOLDEN HONEY — Organic Honey & Handmade Wooden Toys',
    template: '%s | GOLDEN HONEY',
  },
  description:
    'Rare organic honey sourced from pristine forests and handcrafted wooden toys for families who value purity, wellness, and authenticity.',
  keywords: ['organic honey', 'raw honey', 'wooden toys', 'natural products', 'India'],
  openGraph: {
    title: 'GOLDEN HONEY',
    description: 'Organic Honey & Handmade Wooden Toys',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#F6C453',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${interTight.variable}`}>
      <body className="min-h-screen flex flex-col font-body antialiased bg-parchment" suppressHydrationWarning>
        <ShopLayoutWrapper>{children}</ShopLayoutWrapper>
      </body>
    </html>
  )
}
