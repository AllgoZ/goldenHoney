'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import AuthProvider from '@/components/AuthProvider'

export default function ShopLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return <AuthProvider>{children}</AuthProvider>
  }

  return (
    <AuthProvider>
      <Navbar />
      {/* bottom-16 on mobile = clear of the fixed BottomNav (h-16) */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      {/* WhatsApp sits above the bottom nav on mobile */}
      <a
        href="https://wa.me/919159543104"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="md:hidden fixed bottom-20 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-[#25D366] active:scale-95 transition-transform duration-150"
      >
        <svg viewBox="0 0 32 32" fill="white" className="w-7 h-7" aria-hidden="true">
          <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.773L0 32l8.476-2.003A15.937 15.937 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0Zm0 29.25a13.22 13.22 0 0 1-6.738-1.841l-.483-.287-4.997 1.18 1.243-4.847-.314-.497A13.19 13.19 0 0 1 2.75 16C2.75 8.682 8.682 2.75 16 2.75S29.25 8.682 29.25 16 23.318 29.25 16 29.25Zm7.27-9.874c-.397-.199-2.35-1.16-2.715-1.292-.364-.133-.629-.199-.894.2-.264.397-1.024 1.291-1.256 1.556-.231.264-.463.297-.86.099-.398-.2-1.68-.619-3.2-1.975-1.183-1.055-1.981-2.358-2.213-2.756-.232-.397-.025-.612.174-.81.179-.178.397-.463.596-.695.199-.231.265-.397.398-.661.132-.265.066-.497-.033-.696-.1-.199-.894-2.155-1.225-2.95-.322-.774-.65-.669-.894-.681l-.761-.013c-.265 0-.695.1-1.059.497-.364.397-1.39 1.357-1.39 3.311 0 1.953 1.423 3.84 1.621 4.105.2.264 2.8 4.274 6.783 5.993.948.41 1.688.654 2.265.837.951.302 1.817.26 2.502.158.764-.114 2.35-.96 2.681-1.888.332-.927.332-1.722.232-1.888-.099-.166-.364-.265-.761-.464Z" />
        </svg>
      </a>
    </AuthProvider>
  )
}
