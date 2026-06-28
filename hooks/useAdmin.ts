'use client'
import { useState, useEffect } from 'react'
import { onAuthChange } from '@/lib/services/auth.service'
import { getAdminDoc } from '@/lib/services/admin.service'
import type { FSAdmin } from '@/types/firebase'

export function useAdmin() {
  const [admin, setAdmin] = useState<FSAdmin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        setAdmin(null)
        setLoading(false)
        return
      }
      try {
        const data = await getAdminDoc(user.uid)
        setAdmin(data)
      } catch {
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [])

  const hasPermission = (key: keyof FSAdmin['permissions']) =>
    !!admin?.permissions?.[key]

  return { admin, loading, isAdmin: !!admin, hasPermission }
}
