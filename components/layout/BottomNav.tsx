'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, Package, User } from 'lucide-react'
import { useCartStore } from '@/store/cart'

const ITEMS = [
  { href: '/',        label: 'Home',    Icon: Home },
  { href: '/cart',    label: 'Cart',    Icon: ShoppingCart },
  { href: '/account', label: 'Orders',  Icon: Package },
  { href: '/account', label: 'Profile', Icon: User },
]

export default function BottomNav() {
  const pathname  = usePathname()
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/8 flex items-stretch h-16">
      {ITEMS.map(({ href, label, Icon }, idx) => {
        const isCart   = label === 'Cart'
        const isActive =
          href === '/'
            ? pathname === '/'
            : pathname.startsWith(href)
        // When two tabs share the same href (/account), only highlight the last one (Profile)
        const suppressActive = label === 'Orders' && pathname.startsWith('/account')

        const active = isActive && !suppressActive

        return (
          <Link
            key={label + idx}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-150 ${
              active ? 'text-honey-dark' : 'text-onyx/35'
            }`}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-honey-dark rounded-full" />
            )}
            <div className="relative">
              <Icon size={22} strokeWidth={active ? 2.4 : 1.7} />
              {isCart && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-honey-dark text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
