'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import DialogueModal from '@/components/dialogue/DialogueModal'
import GameOverlay from '@/components/game/GameOverlay'
import RewardPopup from '@/components/game/RewardPopup'
import VirtualJoystick from '@/components/game/VirtualJoystick'

const PhaserGame = dynamic(() => import('@/game/PhaserGame'), { ssr: false })

export default function PlayPage() {
  const [dialogueOpen, setDialogueOpen] = useState(false)
  const [currentArtifactId] = useState('keris-jawa')
  const [reward, setReward] = useState<{ type: string; value: string } | null>(null)

  const handleArtifactInteract = useCallback(() => {
    setDialogueOpen(true)
  }, [])

  const handleCloseDialogue = () => {
    setDialogueOpen(false)
  }

  const handleReward = (type: string, value: string) => {
    setReward({ type, value })
    setTimeout(() => setReward(null), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0F0C0A] flex flex-col">
      {/* Game Overlay UI */}
      <GameOverlay />

      {/* Phaser Game Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 game-container">
        <PhaserGame onArtifactInteract={handleArtifactInteract} />
      </div>

      {/* Mobile Controls */}
      <VirtualJoystick />
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={handleArtifactInteract}
          className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#0F0C0A] font-bold text-lg shadow-lg shadow-[#D4AF37]/30 active:scale-90 transition-transform"
        >
          E
        </button>
      </div>

      {/* Dialogue Modal */}
      {dialogueOpen && (
        <DialogueModal
          artifactId={currentArtifactId}
          onClose={handleCloseDialogue}
          onReward={handleReward}
        />
      )}

      {/* Reward Popup */}
      {reward && <RewardPopup type={reward.type} value={reward.value} />}
    </div>
  )
}
