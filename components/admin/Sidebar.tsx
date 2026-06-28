'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users,
  Star, Ticket, ImageIcon, Settings, X, Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/services/auth.service'
import { useAdmin } from '@/hooks/useAdmin'

const NAV = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/admin/products',   label: 'Products',   icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders',     label: 'Orders',     icon: ShoppingBag },
  { href: '/admin/customers',  label: 'Customers',  icon: Users },
  { href: '/admin/reviews',    label: 'Reviews',    icon: Star },
  { href: '/admin/coupons',    label: 'Coupons',    icon: Ticket },
  { href: '/admin/banners',    label: 'Banners',    icon: ImageIcon },
  { href: '/admin/settings',   label: 'Settings',   icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { admin } = useAdmin()

  const isActive = (item: typeof NAV[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-onyx flex flex-col transition-transform duration-300 ease-out lg:relative lg:translate-x-0 lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-honey" />
            <span className="font-heading font-bold text-white text-sm tracking-wide">
              GOLDEN <span className="text-honey">ADMIN</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = isActive(item)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-[background-color,color] duration-150',
                      active
                        ? 'bg-honey/15 text-honey'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon size={17} className={active ? 'text-honey' : 'text-white/40'} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User + sign out */}
        <div className="border-t border-white/10 p-4 shrink-0">
          {admin && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-honey/20 flex items-center justify-center shrink-0">
                <span className="text-honey text-xs font-bold">
                  {admin.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{admin.name}</p>
                <p className="text-white/40 text-[10px] truncate capitalize">{admin.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="w-full text-left text-xs text-white/40 hover:text-white/70 transition-colors px-1 py-1"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
