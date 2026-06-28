'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, MapPin, Heart, Pencil, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const MENU_ITEMS = [
  { href: '/account/orders',    icon: <Package size={20} />,  label: 'My Orders',    desc: 'Track and manage your orders' },
  { href: '/account/addresses', icon: <MapPin size={20} />,   label: 'Addresses',    desc: 'Manage delivery addresses' },
  { href: '/wishlist',          icon: <Heart size={20} />,    label: 'Wishlist',     desc: 'Products you\'ve saved' },
]

export default function AccountPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <p className="text-onyx/50 mb-6">Please sign in to view your account</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-honey text-onyx font-semibold px-6 py-3 rounded-xl hover:bg-honey-dark transition-colors">
            Sign In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-heading font-bold text-3xl text-onyx mb-8">My Account</h1>

        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm mb-6 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-honey/20 flex items-center justify-center text-2xl font-bold text-honey">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-heading font-semibold text-lg text-onyx">{user.name}</p>
            <p className="text-sm text-onyx/50">{user.email}</p>
          </div>
          <Link href="/account/edit" className="p-2 rounded-full hover:bg-honey/10 transition-colors text-onyx/40 hover:text-honey-dark" aria-label="Edit profile">
            <Pencil size={16} />
          </Link>
        </motion.div>

        {/* Menu */}
        <div className="flex flex-col gap-3 mb-6">
          {MENU_ITEMS.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-4 bg-white rounded-xl p-5 border border-black/5 shadow-sm hover:border-honey/40 hover:shadow-md transition-all duration-200"
              >
                <span className="text-honey">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-onyx">{item.label}</p>
                  <p className="text-xs text-onyx/40">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-onyx/30" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </main>
  )
}
