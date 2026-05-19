'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Puzzle, Map, Scroll, Star } from 'lucide-react'
import type { Profile } from '@/types'

const LEVEL_NAMES: Record<number, string> = {
  1: 'Relic Novice',
  2: 'Artifact Listener',
  3: 'Museum Explorer',
  4: 'History Seeker',
  5: 'Relic Keeper',
  6: 'Guardian of Nusantara',
}

const XP_THRESHOLDS = [0, 100, 250, 500, 850, 1300]

export default function PassportPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [badgeCount, setBadgeCount] = useState(0)
  const [fragmentCount, setFragmentCount] = useState(0)
  const [questCount, setQuestCount] = useState(0)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data: p }, { count: badges }, { count: fragments }, { count: quests }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_badges').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('user_memory_fragments').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('user_quests').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
    ])

    setProfile(p as unknown as Profile)
    setBadgeCount(badges || 0)
    setFragmentCount(fragments || 0)
    setQuestCount(quests || 0)
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0F0C0A] flex items-center justify-center">
        <p className="text-[#B8AFA3] animate-pulse">Memuat passport...</p>
      </div>
    )
  }

  const nextLevelXp = XP_THRESHOLDS[profile.level] || XP_THRESHOLDS[XP_THRESHOLDS.length - 1]
  const prevLevelXp = XP_THRESHOLDS[profile.level - 1] || 0
  const xpProgress = ((profile.total_xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100

  return (
    <div className="min-h-screen bg-[#0F0C0A] p-4">
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <button onClick={() => router.push('/play')} className="flex items-center gap-2 text-[#B8AFA3] hover:text-[#D4AF37] mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        {/* Passport Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1F1A15] border border-[#D4AF37]/30 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#A97142]/20 p-6 border-b border-[#D4AF37]/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border-2 border-[#D4AF37]/40">
                <span className="text-2xl font-bold text-[#D4AF37]">{profile.level}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F8F1E7]">{profile.full_name || 'Relic Keeper'}</h2>
                <p className="text-sm text-[#D4AF37]">{LEVEL_NAMES[profile.level] || 'Relic Novice'}</p>
                {profile.selected_game_role && (
                  <p className="text-xs text-[#B8AFA3] mt-0.5 capitalize">{profile.selected_game_role.replace('_', ' ')}</p>
                )}
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="px-6 py-4 border-b border-[#D4AF37]/10">
            <div className="flex items-center justify-between text-xs text-[#B8AFA3] mb-1">
              <span>XP</span>
              <span>{profile.total_xp} / {nextLevelXp}</span>
            </div>
            <div className="w-full h-2 bg-[#15110E] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#e6c44a] rounded-full"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-px bg-[#D4AF37]/10 p-px">
            <div className="bg-[#1F1A15] p-4 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <p className="text-lg font-bold text-[#F8F1E7]">{badgeCount}</p>
                <p className="text-xs text-[#B8AFA3]">Badge</p>
              </div>
            </div>
            <div className="bg-[#1F1A15] p-4 flex items-center gap-3">
              <Puzzle className="w-5 h-5 text-[#1F8A70]" />
              <div>
                <p className="text-lg font-bold text-[#F8F1E7]">{fragmentCount}</p>
                <p className="text-xs text-[#B8AFA3]">Fragment</p>
              </div>
            </div>
            <div className="bg-[#1F1A15] p-4 flex items-center gap-3">
              <Scroll className="w-5 h-5 text-[#A97142]" />
              <div>
                <p className="text-lg font-bold text-[#F8F1E7]">{questCount}</p>
                <p className="text-xs text-[#B8AFA3]">Quest</p>
              </div>
            </div>
            <div className="bg-[#1F1A15] p-4 flex items-center gap-3">
              <Star className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <p className="text-lg font-bold text-[#F8F1E7]">{profile.streak_count}</p>
                <p className="text-xs text-[#B8AFA3]">Streak</p>
              </div>
            </div>
          </div>

          {/* Museum Map Progress */}
          <div className="p-6">
            <p className="text-xs text-[#D4AF37] uppercase tracking-wider mb-3">Museum Progress</p>
            <div className="space-y-2">
              {['Hall of Awakening', 'Ruang Kerajaan', 'Ruang Prasasti', 'Ruang Seni', 'Ruang Musik', 'Ruang Misteri'].map((room, i) => (
                <div key={room} className="flex items-center gap-2">
                  <Map className={`w-3 h-3 ${i < 2 ? 'text-[#1F8A70]' : 'text-[#B8AFA3]/30'}`} />
                  <span className={`text-xs ${i < 2 ? 'text-[#F8F1E7]' : 'text-[#B8AFA3]/50'}`}>{room}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
