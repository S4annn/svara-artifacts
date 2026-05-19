'use client'

import { Trophy, Backpack, User, Scroll, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useGameStore } from '@/stores/gameStore'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const LEVEL_NAMES: Record<number, string> = {
  1: 'Relic Novice',
  2: 'Artifact Listener',
  3: 'Museum Explorer',
  4: 'History Seeker',
  5: 'Relic Keeper',
  6: 'Guardian of Nusantara',
}

export default function GameOverlay() {
  const { playerName, level, totalXp, xpForNextLevel, questActive, questProgress, questMax } = useGameStore()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const xpPercent = xpForNextLevel > 0 ? (totalXp / xpForNextLevel) * 100 : 0

  return (
    <>
      {/* Top-left: Player info + XP bar */}
      <div className="fixed top-3 left-3 z-40">
        <div className="bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-lg shadow-black/20">
          <div className="w-8 h-8 bg-[#1F8A70]/20 rounded-full flex items-center justify-center border border-[#1F8A70]/30">
            <User className="w-3.5 h-3.5 text-[#1F8A70]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] text-[#F8F1E7] font-semibold">{playerName}</p>
              <span className="text-[9px] text-[#B8AFA3]">• {LEVEL_NAMES[level]}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] text-[#D4AF37] font-bold">Lv.{level}</span>
              <div className="w-16 h-1.5 bg-[#071510] rounded-full overflow-hidden border border-[#1F8A70]/10">
                <div
                  className="h-full bg-gradient-to-r from-[#1F8A70] to-[#D4AF37] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(xpPercent, 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-[#B8AFA3]">{totalXp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top-right: Menu buttons */}
      <div className="fixed top-3 right-3 z-40 flex items-center gap-1">
        <Link href="/passport" className="w-8 h-8 bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-lg flex items-center justify-center hover:border-[#1F8A70]/40 transition-all" title="Inventory">
          <Backpack className="w-3.5 h-3.5 text-[#B8AFA3]" />
        </Link>
        <button className="w-8 h-8 bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/40 transition-all" title="Badges">
          <Trophy className="w-3.5 h-3.5 text-[#B8AFA3]" />
        </button>
        <Link href="/passport" className="w-8 h-8 bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-lg flex items-center justify-center hover:border-[#1F8A70]/40 transition-all" title="Passport">
          <Scroll className="w-3.5 h-3.5 text-[#B8AFA3]" />
        </Link>
        <button className="w-8 h-8 bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-lg flex items-center justify-center hover:border-[#1F8A70]/40 transition-all" title="Settings">
          <Settings className="w-3.5 h-3.5 text-[#B8AFA3]" />
        </button>
        <button onClick={handleLogout} className="w-8 h-8 bg-[#0D1F18]/90 backdrop-blur-md border border-[#6B1F1F]/30 rounded-lg flex items-center justify-center hover:border-[#6B1F1F]/60 transition-all" title="Logout">
          <LogOut className="w-3.5 h-3.5 text-[#6B1F1F]" />
        </button>
      </div>

      {/* Right side: Current quest panel */}
      {questActive && (
        <div className="fixed top-16 right-3 z-40 hidden md:block">
          <div className="bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-xl p-3 w-48 shadow-lg shadow-black/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <p className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-bold">Quest</p>
            </div>
            <p className="text-[11px] text-[#F8F1E7] leading-relaxed">{questActive}</p>
            <div className="mt-2 w-full h-1 bg-[#071510] rounded-full overflow-hidden border border-[#1F8A70]/10">
              <div
                className="h-full bg-gradient-to-r from-[#1F8A70] to-[#1F8A70]/60 rounded-full transition-all duration-500"
                style={{ width: `${questMax > 0 ? (questProgress / questMax) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[9px] text-[#B8AFA3] mt-1">{questProgress}/{questMax}</p>
          </div>
        </div>
      )}
    </>
  )
}
