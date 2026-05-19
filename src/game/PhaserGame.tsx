'use client'

import { useEffect, useRef, useState } from 'react'

interface PhaserGameProps {
  onArtifactInteract: () => void
}

export default function PhaserGame({ onArtifactInteract }: PhaserGameProps) {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState('Memuat engine...')
  const callbackRef = useRef(onArtifactInteract)
  callbackRef.current = onArtifactInteract

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
        backgroundColor: '#0f0f23',
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
          scene.scene.restart({ onArtifactInteract: () => callbackRef.current() })
        }
        setLoading(false)
      })
    }

    // Small delay to let the page render first
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f23] rounded-lg z-10 gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          <p className="text-[#B8AFA3] text-sm animate-pulse">{progress}</p>
        </div>
      )}
      <div
        ref={gameRef}
        className="w-full aspect-[8/5] rounded-lg overflow-hidden border border-[#D4AF37]/20"
      />
    </div>
  )
}
