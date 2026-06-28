'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/wrong-password':
      return 'Invalid email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    default:
      return 'Sign in failed. Please try again.'
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
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
          <h1 className="font-heading font-bold text-3xl text-onyx mt-4 mb-2">Welcome Back</h1>
          <p className="text-onyx/50 text-sm">Sign in to your GOLDEN HONEY account</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-8 text-onyx/30 hover:text-onyx/60 transition-colors"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-honey-dark hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-onyx/50 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-honey-dark font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
