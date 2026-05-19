'use client'

import { motion } from 'framer-motion'
import { Sparkles, Trophy, Puzzle, Star, DoorOpen } from 'lucide-react'

interface RewardPopupProps {
  type: string
  value: string
}

const config: Record<string, { icon: typeof Sparkles; color: string; glow: string }> = {
  xp: { icon: Sparkles, color: '#D4AF37', glow: 'shadow-[#D4AF37]/30' },
  badge: { icon: Trophy, color: '#D4AF37', glow: 'shadow-[#D4AF37]/30' },
  fragment: { icon: Puzzle, color: '#1F8A70', glow: 'shadow-[#1F8A70]/30' },
  level: { icon: Star, color: '#D4AF37', glow: 'shadow-[#D4AF37]/40' },
  room: { icon: DoorOpen, color: '#1F8A70', glow: 'shadow-[#1F8A70]/30' },
}

export default function RewardPopup({ type, value }: RewardPopupProps) {
  const { icon: Icon, color, glow } = config[type] || config.xp

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.8 }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50"
    >
      <div className={`bg-[#0D1F18] border border-opacity-40 rounded-2xl px-6 py-3.5 flex items-center gap-3 shadow-xl ${glow}`} style={{ borderColor: color }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </motion.div>
        <span className="text-sm font-bold" style={{ color }}>{value}</span>
      </div>
    </motion.div>
  )
}
