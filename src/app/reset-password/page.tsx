'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Supabase automatically handles the token from the URL hash
    // when the user clicks the reset link in their email.
    // We just need to check if there's a valid session.
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessionReady(true)
      } else {
        // Listen for auth state change (token exchange happens automatically)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'PASSWORD_RECOVERY') {
            setSessionReady(true)
          }
        })
        return () => subscription.unsubscribe()
      }
    }
    checkSession()
  }, [supabase.auth])

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Password tidak cocok.')
      return
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/play'), 2000)
    } catch (err) {
      console.error('Update password error:', err)
      setError('Gagal mengupdate password. Coba lagi.')
      setLoading(false)
    }
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071510] px-4">
        <div className="w-full max-w-sm text-center">
          <Link href="/" className="text-2xl font-bold text-[#D4AF37]">RelicVerse</Link>
          <div className="mt-8 bg-[#0D1F18] border border-[#D4AF37]/10 rounded-xl p-6">
            <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#B8AFA3]">Memverifikasi link reset password...</p>
            <p className="text-xs text-[#B8AFA3]/60 mt-2">
              Jika halaman ini tidak berubah, link mungkin sudah expired.{' '}
              <Link href="/forgot-password" className="text-[#D4AF37] hover:underline">Minta link baru</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071510] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#D4AF37]">RelicVerse</Link>
          <p className="text-[#B8AFA3] text-sm mt-2">Buat password baru</p>
        </div>

        {success ? (
          <div className="bg-[#0D1F18] border border-[#D4AF37]/10 rounded-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-[#1F8A70]/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-[#1F8A70]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#F8F1E7]">Password Berhasil Diubah!</h3>
            <p className="text-sm text-[#B8AFA3]">Mengalihkan ke game...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="bg-[#0D1F18] border border-[#D4AF37]/10 rounded-xl p-6 space-y-4">
            {error && (
              <div className="bg-[#6B1F1F]/30 border border-[#6B1F1F] text-red-300 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-[#B8AFA3] mb-1">Password Baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#071510] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F8F1E7] placeholder-[#B8AFA3]/50 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div>
              <label className="block text-sm text-[#B8AFA3] mb-1">Konfirmasi Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#071510] border border-[#D4AF37]/20 rounded-lg px-4 py-2.5 text-[#F8F1E7] placeholder-[#B8AFA3]/50 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
                placeholder="Ulangi password baru"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#071510] py-2.5 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
