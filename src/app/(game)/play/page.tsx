'use client'

import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import DialogueModal from '@/components/dialogue/DialogueModal'
import GameOverlay from '@/components/game/GameOverlay'
import RewardPopup from '@/components/game/RewardPopup'
import VirtualJoystick from '@/components/game/VirtualJoystick'
import NaraDialogue from '@/components/game/NaraDialogue'
import { useGameStore } from '@/stores/gameStore'
import { gameEvents, GAME_EVENTS } from '@/game/events'

const PhaserGame = dynamic(() => import('@/game/PhaserGame'), { ssr: false })

export default function PlayPage() {
  const {
    dialogueOpen, currentArtifactId, notifications,
    naraDialogueOpen, naraMessage,
    openDialogue, closeDialogue, showNara, hideNara, pushNotification,
  } = useGameStore()

  const handleArtifactInteract = useCallback((artifactId: string) => {
    openDialogue(artifactId)
  }, [openDialogue])

  const handleNaraInteract = useCallback(() => {
    showNara('Halo, Relic Keeper! Museum ini menyimpan banyak artefak yang menunggu untuk menceritakan kisahnya. Dekati artefak yang bercahaya dan tekan E untuk berbicara dengannya. Selesaikan quest untuk membuka ruangan baru!')
  }, [showNara])

  const handleCloseDialogue = () => {
    closeDialogue()
    gameEvents.emit(GAME_EVENTS.CLOSE_DIALOG)
  }

  const handleCloseNara = () => {
    hideNara()
    gameEvents.emit(GAME_EVENTS.CLOSE_DIALOG)
  }

  const handleReward = (type: string, value: string) => {
    pushNotification(type as 'xp' | 'badge' | 'fragment', value)
  }

  return (
    <div className="min-h-screen bg-[#071510] flex flex-col">
      {/* Game Overlay UI */}
      <GameOverlay />

      {/* Phaser Game Canvas */}
      <div className="flex-1 flex items-center justify-center p-2 md:p-4 game-container">
        <PhaserGame
          onArtifactInteract={handleArtifactInteract}
          onNaraInteract={handleNaraInteract}
        />
      </div>

      {/* Mobile Controls */}
      <VirtualJoystick />
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => handleArtifactInteract('keris-jawa')}
          className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#071510] font-bold text-lg shadow-lg shadow-[#D4AF37]/30 active:scale-90 transition-transform border-2 border-[#D4AF37]/60"
        >
          E
        </button>
      </div>

      {/* Dialogue Modal */}
      {dialogueOpen && currentArtifactId && (
        <DialogueModal
          artifactId={currentArtifactId}
          onClose={handleCloseDialogue}
          onReward={handleReward}
        />
      )}

      {/* Nara Dialogue */}
      {naraDialogueOpen && naraMessage && (
        <NaraDialogue message={naraMessage} onClose={handleCloseNara} />
      )}

      {/* Reward Notifications */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {notifications.map((n) => (
          <RewardPopup key={n.id} type={n.type} value={n.value} />
        ))}
      </div>
    </div>
  )
}
