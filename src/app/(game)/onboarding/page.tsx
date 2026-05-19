'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Compass, Shield, Search, BookOpen } from 'lucide-react'

const ROLES = [
  { id: 'penjelajah_sejarah', name: 'Penjelajah Sejarah', icon: Compass, desc: 'Menjelajahi setiap sudut museum' },
  { id: 'penjaga_museum', name: 'Penjaga Museum', icon: Shield, desc: 'Melindungi dan merawat artefak' },
  { id: 'pemburu_artefak', name: 'Pemburu Artefak', icon: Search, desc: 'Mencari artefak tersembunyi' },
  { id: 'ahli_budaya', name: 'Ahli Budaya Muda', icon: BookOpen, desc: 'Mendalami makna budaya' },
]

const AVATARS = ['avatar_1', 'avatar_2', 'avatar_3', 'avatar_4']
const AVATAR_COLORS = ['#D4AF37', '#1F8A70', '#A97142', '#6B1F1F']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleComplete() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({
        selected_game_role: selectedRole,
        avatar_key: selectedAvatar,
      }).eq('id', user.id)
    }
    router.push('/play')
  }

  return (
    <div className="min-h-screen bg-[#0F0C0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i <= step ? 'bg-[#D4AF37]' : 'bg-[#1F1A15]'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#F8F1E7]">Pilih Peranmu</h2>
                <p className="text-sm text-[#B8AFA3] mt-1">Siapa kamu di museum ini?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedRole === role.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-[#D4AF37]/10 bg-[#1F1A15] hover:border-[#D4AF37]/30'
                    }`}
                  >
                    <role.icon className={`w-6 h-6 mb-2 ${selectedRole === role.id ? 'text-[#D4AF37]' : 'text-[#B8AFA3]'}`} />
                    <p className="text-sm font-medium text-[#F8F1E7]">{role.name}</p>
                    <p className="text-xs text-[#B8AFA3] mt-0.5">{role.desc}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!selectedRole}
                className="w-full bg-[#D4AF37] text-[#0F0C0A] py-2.5 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors disabled:opacity-30"
              >
                Lanjut
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#F8F1E7]">Pilih Avatar</h2>
                <p className="text-sm text-[#B8AFA3] mt-1">Wujudmu di dalam museum</p>
              </div>
              <div className="flex justify-center gap-4">
                {AVATARS.map((av, i) => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedAvatar === av
                        ? 'border-[#D4AF37] scale-110'
                        : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                    }`}
                    style={{ backgroundColor: AVATAR_COLORS[i] + '30' }}
                  >
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: AVATAR_COLORS[i] }} />
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 border border-[#D4AF37]/20 text-[#D4AF37] py-2.5 rounded-lg font-medium hover:bg-[#D4AF37]/10 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedAvatar}
                  className="flex-1 bg-[#D4AF37] text-[#0F0C0A] py-2.5 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors disabled:opacity-30"
                >
                  Lanjut
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#F8F1E7]">Nara Menyambutmu</h2>
              </div>
              <div className="bg-[#1F1A15] border border-[#D4AF37]/20 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#D4AF37] text-sm font-bold">N</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#D4AF37] font-medium mb-1">Nara — Museum Guide</p>
                    <p className="text-sm text-[#F8F1E7] leading-relaxed">
                      &ldquo;Selamat datang, Relic Keeper! Museum ini sudah lama menunggumu.
                      Gunakan WASD untuk bergerak. Dekati artefak yang bercahaya, lalu tekan E untuk berbicara dengannya.
                      Mulailah dari Keris Jawa di Ruang Kerajaan.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#15110E] border border-[#1F8A70]/30 rounded-lg p-3">
                <p className="text-xs text-[#1F8A70] font-medium mb-1">Quest Pertama</p>
                <p className="text-sm text-[#F8F1E7]">Temui Keris Jawa dan tanyakan asal-usulnya.</p>
              </div>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#0F0C0A] py-3 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors disabled:opacity-50 text-lg"
              >
                {loading ? 'Memuat...' : 'Mulai Petualangan'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
