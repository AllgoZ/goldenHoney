'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdmin } from '@/hooks/useAdmin'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!admin && pathname !== '/admin/login') router.replace('/admin/login')
    if (admin && pathname === '/admin/login') router.replace('/admin')
  }, [admin, loading, pathname, router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-parchment">
        <div className="w-8 h-8 border-2 border-honey border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!admin && pathname !== '/admin/login') return null

  return <>{children}</>
}
