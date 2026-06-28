'use client'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

const TITLES: Record<string, string> = {
  '/admin':            'Dashboard',
  '/admin/products':   'Products',
  '/admin/categories': 'Categories',
  '/admin/orders':     'Orders',
  '/admin/customers':  'Customers',
  '/admin/reviews':    'Reviews',
  '/admin/coupons':    'Coupons',
  '/admin/banners':    'Banners',
  '/admin/settings':   'Settings',
}

interface AdminHeaderProps {
  onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname()
  // Match exact path first, then 3-segment (detail pages), then 2-segment (section pages)
  const seg3 = '/' + pathname.split('/').slice(1, 4).join('/')
  const seg2 = '/' + pathname.split('/').slice(1, 3).join('/')
  const title = TITLES[pathname] ?? TITLES[seg3] ?? TITLES[seg2] ?? 'Admin'

  return (
    <header className="h-16 bg-white border-b border-black/6 flex items-center gap-4 px-5 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg hover:bg-onyx/5 transition-colors text-onyx/60"
      >
        <Menu size={20} />
      </button>
      <h1 className="font-heading font-bold text-onyx text-lg">{title}</h1>
    </header>
  )
}
