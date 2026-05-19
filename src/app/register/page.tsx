'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: fullName },
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      router.push('/play')
    } catch (err) {
      console.error('Register error:', err)
      setError('Tidak dapat terhubung ke server. Pastikan koneksi internet aktif dan Supabase project tidak dalam keadaan paused.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0C0A] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#D4AF37]">RelicVerse</Link>
          <p className="text-[#B8AFA3] text-sm mt-2">Buat akun dan mulai petualanganmu</p>
        </div>

        <form onSubmit={handleRegister} className="bg-[#1F1A15] border border-[#D4AF37]/10 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-[#6B1F1F]/30 border border-[#6B1F1F] text-red-300 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#B8AFA3] mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-[#15110E] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F8F1E7] placeholder-[#B8AFA3]/50 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
              placeholder="Nama kamu"
            />
          </div>

          <div>
            <label className="block text-sm text-[#B8AFA3] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#15110E] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F8F1E7] placeholder-[#B8AFA3]/50 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#B8AFA3] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#15110E] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F8F1E7] placeholder-[#B8AFA3]/50 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] text-[#0F0C0A] py-2.5 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Memuat...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-[#B8AFA3] mt-4">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[#D4AF37] hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
