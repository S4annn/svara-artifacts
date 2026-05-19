'use client'

import { useEffect, useRef, useState } from 'react'

interface PhaserGameProps {
  onArtifactInteract: (artifactId: string) => void
  onNaraInteract?: () => void
}

export default function PhaserGame({ onArtifactInteract, onNaraInteract }: PhaserGameProps) {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState('Memuat engine...')
  const callbacksRef = useRef({ onArtifactInteract, onNaraInteract })
  callbacksRef.current = { onArtifactInteract, onNaraInteract }

  useEffect(() => {
    let destroyed = false

    async function initPhaser() {
      setProgress('Memuat Phaser engine...')
      const Phaser = (await import('phaser')).default

      if (destroyed) return
      setProgress('Memuat museum scene...')
      const { MuseumScene } = await import('./MuseumScene')

      if (destroyed || !gameRef.current || phaserGameRef.current) return
      setProgress('Membangun museum...')

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameRef.current,
        width: 800,
        height: 500,
        backgroundColor: '#071510',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: MuseumScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        render: {
          pixelArt: false,
          antialias: true,
        },
      }

      const game = new Phaser.Game(config)
      phaserGameRef.current = game

      game.events.on('ready', () => {
        if (destroyed) return
        const scene = game.scene.getScene('MuseumScene')
        if (scene) {
          scene.scene.restart({
            onArtifactInteract: (id: string) => callbacksRef.current.onArtifactInteract(id),
            onNaraInteract: () => callbacksRef.current.onNaraInteract?.(),
          })
        }
        setLoading(false)
      })
    }

    const timer = setTimeout(initPhaser, 100)

    return () => {
      destroyed = true
      clearTimeout(timer)
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#071510] rounded-2xl z-10 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#1F8A70]/20 border-t-[#1F8A70] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-[#D4AF37]/40 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[#F8F1E7] text-sm font-medium">{progress}</p>
            <p className="text-[#B8AFA3] text-xs mt-1">Museum sedang disiapkan...</p>
          </div>
        </div>
      )}
      <div
        ref={gameRef}
        className="w-full aspect-[8/5] rounded-2xl overflow-hidden border border-[#1F8A70]/20 shadow-xl shadow-black/30"
      />
    </div>
  )
}
