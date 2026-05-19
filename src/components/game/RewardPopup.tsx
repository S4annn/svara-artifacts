'use client'

import { motion } from 'framer-motion'
import { Sparkles, Trophy, Puzzle } from 'lucide-react'

interface RewardPopupProps {
  type: string
  value: string
}

const icons: Record<string, typeof Sparkles> = {
  xp: Sparkles,
  badge: Trophy,
  fragment: Puzzle,
}

export default function RewardPopup({ type, value }: RewardPopupProps) {
  const Icon = icons[type] || Sparkles

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-[#1F1A15] border border-[#D4AF37]/40 rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg shadow-[#D4AF37]/10">
        <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <span className="text-sm font-semibold text-[#D4AF37]">{value}</span>
      </div>
    </motion.div>
  )
}
