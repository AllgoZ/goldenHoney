'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminGuard from '@/components/admin/AdminGuard'
import Sidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  return (
    <AdminGuard>
      {isLogin ? (
        <div className="min-h-screen bg-cream flex items-center justify-center">{children}</div>
      ) : (
        <div className="flex h-screen overflow-hidden bg-parchment">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <AdminHeader onMenuClick={() => setSidebarOpen((v) => !v)} />
            <main className="flex-1 overflow-auto p-5 lg:p-7">{children}</main>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
