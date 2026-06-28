'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/operation-not-allowed':
      return 'Registration is currently disabled.'
    default:
      return 'Registration failed. Please try again.'
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [errors, setErrors]     = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim())     errs.name = 'Name is required'
    if (!email.trim())    errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!password)        errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Minimum 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      await register(name, email, password)
      router.push('/account')
    } catch (err: any) {
      setError(firebaseErrorMessage(err?.code ?? ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <span className="text-5xl">🍯</span>
          <h1 className="font-heading font-bold text-3xl text-onyx mt-4 mb-2">Create Account</h1>
          <p className="text-onyx/50 text-sm">Join GOLDEN HONEY today</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
              error={errors.name}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
              error={errors.password}
            />

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" size="lg" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-onyx/50 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-honey-dark font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
