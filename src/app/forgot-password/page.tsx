'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error('Reset password error:', err)
      setError('Tidak dapat terhubung ke server. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0C0A] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#D4AF37]">RelicVerse</Link>
          <p className="text-[#B8AFA3] text-sm mt-2">Reset password akunmu</p>
        </div>

        {success ? (
          <div className="bg-[#1F1A15] border border-[#D4AF37]/10 rounded-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-[#1F8A70]/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-[#1F8A70]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#F8F1E7]">Email Terkirim!</h3>
            <p className="text-sm text-[#B8AFA3]">
              Kami sudah mengirim link reset password ke <span className="text-[#F8F1E7]">{email}</span>.
              Cek inbox atau folder spam kamu.
            </p>
            <Link
              href="/login"
              className="inline-block text-sm text-[#D4AF37] hover:underline mt-2"
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="bg-[#1F1A15] border border-[#D4AF37]/10 rounded-xl p-6 space-y-4">
            {error && (
              <div className="bg-[#6B1F1F]/30 border border-[#6B1F1F] text-red-300 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <p className="text-sm text-[#B8AFA3]">
              Masukkan email yang terdaftar. Kami akan mengirim link untuk reset password.
            </p>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#0F0C0A] py-2.5 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors disabled:opacity-50"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[#B8AFA3] mt-4">
          Ingat password?{' '}
          <Link href="/login" className="text-[#D4AF37] hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
