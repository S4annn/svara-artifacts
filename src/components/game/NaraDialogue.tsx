'use client'

import { motion } from 'framer-motion'

interface NaraDialogueProps {
  message: string
  onClose: () => void
}

export default function NaraDialogue({ message, onClose }: NaraDialogueProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0D1F18] border border-[#1F8A70]/30 rounded-2xl p-5 mb-4 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          {/* Nara avatar */}
          <div className="shrink-0 w-12 h-12 bg-[#1F8A70]/20 rounded-full flex items-center justify-center border border-[#1F8A70]/40">
            <span className="text-[#1F8A70] font-bold text-lg">N</span>
          </div>

          <div className="flex-1">
            <p className="text-xs text-[#1F8A70] font-bold mb-1.5">Nara — Museum Guide</p>
            <p className="text-sm text-[#F8F1E7] leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="text-xs bg-[#1F8A70]/20 border border-[#1F8A70]/30 text-[#1F8A70] px-4 py-1.5 rounded-full hover:bg-[#1F8A70]/30 transition-colors"
          >
            Mengerti
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
