'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Menu, X, User, Search } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/shop',    label: 'Shop' },
  { href: '/about',   label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq',     label: 'FAQ' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount   = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const wishCount   = useWishlistStore((s) => s.items.length)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,border-color] duration-500',
          scrolled
            ? 'glass shadow-sm backdrop-blur-xl border-b border-white/20'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl" aria-hidden="true">🍯</span>
            <span className="font-heading font-bold text-lg text-onyx tracking-tight">
              GOLDEN <span className="text-gradient-honey">HONEY</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'text-sm font-medium transition-[color] duration-150 ease-out hover:text-honey-dark',
                    pathname.startsWith(l.href)
                      ? 'text-honey-dark font-semibold'
                      : 'text-onyx/70'
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link href="/account" aria-label="Account" className="p-2 rounded-full hover:bg-honey/10 transition-colors hidden sm:flex">
              <User size={20} className="text-onyx/70" />
            </Link>

            <Link href="/wishlist" aria-label={`Wishlist (${wishCount})`} className="p-2 rounded-full hover:bg-honey/10 transition-colors relative">
              <Heart size={20} className="text-onyx/70" />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishCount > 9 ? '9+' : wishCount}
                </span>
              )}
            </Link>

            <Link href="/cart" aria-label={`Cart (${cartCount})`} className="p-2 rounded-full hover:bg-honey/10 transition-colors relative">
              <ShoppingCart size={20} className="text-onyx/70" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-honey-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-full hover:bg-honey/10 transition-colors ml-1"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="fixed inset-x-0 top-16 z-40 glass-dark border-b border-white/10 px-6 py-4 flex flex-col gap-3 md:hidden"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'py-2 text-base font-medium border-b border-white/10 last:border-0 transition-colors',
                  pathname.startsWith(l.href) ? 'text-honey' : 'text-white/80'
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/account" className="py-2 text-base font-medium text-white/80">Account</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
