'use client'

import { Trophy, Backpack, User, Scroll, Settings } from 'lucide-react'
import Link from 'next/link'

export default function GameOverlay() {
  // TODO: Connect to real user data from Supabase
  const playerName = 'Relic Keeper'
  const level = 1
  const currentXp = 0
  const xpForNextLevel = 100
  const currentQuest = 'Bicara dengan Keris Jawa'

  return (
    <>
      {/* Top-left: Player info + XP bar */}
      <div className="fixed top-4 left-4 z-40">
        <div className="bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-lg shadow-black/20">
          <div className="w-9 h-9 bg-[#1F8A70]/20 rounded-full flex items-center justify-center border border-[#1F8A70]/30">
            <User className="w-4 h-4 text-[#1F8A70]" />
          </div>
          <div>
            <p className="text-xs text-[#F8F1E7] font-semibold">{playerName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-[#D4AF37] font-bold">Lv.{level}</span>
              <div className="w-20 h-1.5 bg-[#071510] rounded-full overflow-hidden border border-[#1F8A70]/10">
                <div
                  className="h-full bg-gradient-to-r from-[#1F8A70] to-[#D4AF37] rounded-full transition-all duration-700"
                  style={{ width: `${(currentXp / xpForNextLevel) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-[#B8AFA3]">{currentXp}/{xpForNextLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top-right: Menu buttons */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-1.5">
        <Link href="/passport" className="w-9 h-9 bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-xl flex items-center justify-center hover:border-[#1F8A70]/40 hover:bg-[#0D1F18] transition-all" title="Inventory">
          <Backpack className="w-4 h-4 text-[#B8AFA3]" />
        </Link>
        <button className="w-9 h-9 bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-xl flex items-center justify-center hover:border-[#D4AF37]/40 hover:bg-[#0D1F18] transition-all" title="Badges">
          <Trophy className="w-4 h-4 text-[#B8AFA3]" />
        </button>
        <Link href="/passport" className="w-9 h-9 bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-xl flex items-center justify-center hover:border-[#1F8A70]/40 hover:bg-[#0D1F18] transition-all" title="Passport">
          <Scroll className="w-4 h-4 text-[#B8AFA3]" />
        </Link>
        <button className="w-9 h-9 bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-xl flex items-center justify-center hover:border-[#1F8A70]/40 hover:bg-[#0D1F18] transition-all" title="Settings">
          <Settings className="w-4 h-4 text-[#B8AFA3]" />
        </button>
      </div>

      {/* Right side: Current quest panel */}
      <div className="fixed top-20 right-4 z-40 hidden md:block">
        <div className="bg-[#0D1F18]/90 backdrop-blur-md border border-[#1F8A70]/20 rounded-2xl p-4 w-56 shadow-lg shadow-black/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-bold">Quest Aktif</p>
          </div>
          <p className="text-xs text-[#F8F1E7] leading-relaxed">{currentQuest}</p>
          <div className="mt-3 w-full h-1.5 bg-[#071510] rounded-full overflow-hidden border border-[#1F8A70]/10">
            <div className="h-full bg-gradient-to-r from-[#1F8A70] to-[#1F8A70]/60 rounded-full w-0 transition-all duration-500" />
          </div>
          <p className="text-[10px] text-[#B8AFA3] mt-1.5">0/1 selesai</p>
        </div>
      </div>
    </>
  )
}
