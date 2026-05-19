'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      router.push('/play')
    } catch (err) {
      console.error('Login error:', err)
      setError('Tidak dapat terhubung ke server. Pastikan koneksi internet aktif dan Supabase project tidak dalam keadaan paused.')
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setGoogleLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setGoogleLoading(false)
      }
      // If successful, user is redirected to Google — no need to do anything else
    } catch (err) {
      console.error('Google login error:', err)
      setError('Gagal terhubung ke Google. Coba lagi.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071510] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#D4AF37]">RelicVerse</Link>
          <p className="text-[#B8AFA3] text-sm mt-2">Masuk untuk melanjutkan petualangan</p>
        </div>

        <div className="bg-[#0D1F18] border border-[#D4AF37]/10 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-[#6B1F1F]/30 border border-[#6B1F1F] text-red-300 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-[#071510] border border-[#D4AF37]/20 py-2.5 rounded-lg text-[#F8F1E7] hover:border-[#D4AF37]/40 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#D4AF37]/10" />
            <span className="text-xs text-[#B8AFA3]">atau</span>
            <div className="flex-1 h-px bg-[#D4AF37]/10" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[#B8AFA3] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#071510] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F8F1E7] placeholder-[#B8AFA3]/50 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm text-[#B8AFA3]">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#D4AF37] hover:underline">
                  Lupa password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#071510] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F8F1E7] placeholder-[#B8AFA3]/50 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#D4AF37] text-[#071510] py-2.5 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors disabled:opacity-50"
            >
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#B8AFA3] mt-4">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#D4AF37] hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  )
}
