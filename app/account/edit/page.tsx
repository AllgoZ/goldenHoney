'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { updateCustomer } from '@/lib/services/customer.service'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, updateProfile } = useAuth()

  const [name, setName]   = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [saved, setSaved]     = useState(false)

  if (!user) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <p className="text-onyx/50 mb-6">Please sign in to edit your profile</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-honey text-onyx font-semibold px-6 py-3 rounded-xl hover:bg-honey-dark transition-colors">
            Sign In
          </Link>
        </div>
      </main>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!name.trim()) { setError('Name is required'); return }
    setLoading(true)
    setError('')
    try {
      // Update customers collection
      await updateCustomer(user.id, { name: name.trim(), phone: phone.trim() || undefined })
      // Update local Zustand store
      updateProfile({ name: name.trim(), phone: phone.trim() || undefined })
      setSaved(true)
      setTimeout(() => router.push('/account'), 1000)
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-onyx/50 hover:text-onyx mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Account
        </Link>

        <h1 className="font-heading font-bold text-3xl text-onyx mb-8">Edit Profile</h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm"
        >
          {/* Avatar initial */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-honey/20 flex items-center justify-center text-3xl font-bold text-honey">
              {name.charAt(0).toUpperCase() || user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
            />
            <Input
              label="Email Address"
              type="email"
              value={user.email}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            {saved && (
              <p className="text-sm text-green-600 text-center font-medium">Profile updated successfully!</p>
            )}

            <Button type="submit" size="lg" fullWidth loading={loading} disabled={saved}>
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
