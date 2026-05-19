'use client'

import { Trophy, Backpack, User, Scroll } from 'lucide-react'

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
      <div className="fixed top-4 left-4 z-40 flex items-center gap-3">
        <div className="bg-[#1F1A15]/90 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-xs text-[#F8F1E7] font-medium">{playerName}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#D4AF37]">Lv.{level}</span>
              <div className="w-20 h-1.5 bg-[#15110E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                  style={{ width: `${(currentXp / xpForNextLevel) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-[#B8AFA3]">{currentXp}/{xpForNextLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top-right: Menu buttons */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button className="w-9 h-9 bg-[#1F1A15]/90 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/40 transition-colors" title="Inventory">
          <Backpack className="w-4 h-4 text-[#B8AFA3]" />
        </button>
        <button className="w-9 h-9 bg-[#1F1A15]/90 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/40 transition-colors" title="Badges">
          <Trophy className="w-4 h-4 text-[#B8AFA3]" />
        </button>
        <button className="w-9 h-9 bg-[#1F1A15]/90 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg flex items-center justify-center hover:border-[#D4AF37]/40 transition-colors" title="Passport">
          <Scroll className="w-4 h-4 text-[#B8AFA3]" />
        </button>
      </div>

      {/* Right side: Current quest */}
      <div className="fixed top-20 right-4 z-40 hidden md:block">
        <div className="bg-[#1F1A15]/90 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-3 w-52">
          <p className="text-[10px] text-[#D4AF37] uppercase tracking-wider mb-1">Quest Aktif</p>
          <p className="text-xs text-[#F8F1E7]">{currentQuest}</p>
          <div className="mt-2 w-full h-1 bg-[#15110E] rounded-full overflow-hidden">
            <div className="h-full bg-[#1F8A70] rounded-full w-0" />
          </div>
        </div>
      </div>
    </>
  )
}
