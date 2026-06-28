'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Plus, MapPin, Trash2, Star, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getCustomerAddresses, deleteCustomerAddress, setDefaultCustomerAddress } from '@/lib/services/customer.service'
import type { FSAddress } from '@/types/firebase'

export default function AddressesPage() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<FSAddress[]>([])
  const [loading, setLoading]     = useState(true)
  const [deleting, setDeleting]   = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getCustomerAddresses(user.id)
      .then(setAddresses)
      .finally(() => setLoading(false))
  }, [user?.id])

  async function handleSetDefault(addressId: string) {
    if (!user?.id) return
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === addressId })))
    await setDefaultCustomerAddress(user.id, addressId)
  }

  async function handleDelete(addressId: string) {
    if (!user?.id) return
    setDeleting(addressId)
    try {
      await deleteCustomerAddress(user.id, addressId)
      setAddresses((prev) => prev.filter((a) => a.id !== addressId))
    } finally {
      setDeleting(null)
    }
  }

  if (!user) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <p className="text-onyx/50 mb-6">Please sign in to view your addresses</p>
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
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-onyx/50 hover:text-onyx mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Account
        </Link>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-bold text-3xl text-onyx">Saved Addresses</h1>
          <Link
            href="/account/addresses/new"
            className="flex items-center gap-1.5 text-sm font-semibold text-honey-dark hover:underline"
          >
            <Plus size={16} /> Add New
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-honey" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {addresses.map((addr, i) => (
                <motion.div
                  key={addr.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.06 }}
                  className={`bg-white rounded-xl p-5 border-2 shadow-sm transition-colors ${
                    addr.isDefault ? 'border-honey' : 'border-black/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-honey" />
                      <span className="font-semibold text-sm text-onyx capitalize">{addr.addressLine2 ?? 'Address'}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase bg-honey/10 text-honey-dark px-2 py-0.5 rounded-chip">Default</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-xs text-onyx/40 hover:text-honey-dark transition-colors flex items-center gap-1"
                        >
                          <Star size={12} /> Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(addr.id)}
                        disabled={deleting === addr.id}
                        className="text-onyx/30 hover:text-red-500 transition-colors disabled:opacity-40"
                        aria-label="Delete address"
                      >
                        {deleting === addr.id
                          ? <Loader2 size={15} className="animate-spin" />
                          : <Trash2 size={15} />
                        }
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-onyx/70 leading-relaxed">
                    {addr.fullName}<br />
                    {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                    {addr.city}, {addr.state} — {addr.pincode}<br />
                    {addr.phone}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {addresses.length === 0 && (
              <div className="text-center py-16 text-onyx/40">
                <MapPin size={40} className="mx-auto mb-4 opacity-30" />
                <p>No saved addresses</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
