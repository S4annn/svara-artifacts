'use client'

import { useRef, useCallback } from 'react'
import { gameEvents, GAME_EVENTS } from '@/game/events'

export default function VirtualJoystick() {
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)
  const centerRef = useRef({ x: 0, y: 0 })

  const maxDistance = 30

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current) return
    activeRef.current = true
    const rect = joystickRef.current.getBoundingClientRect()
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
    handleMove(clientX, clientY)
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!activeRef.current || !knobRef.current) return

    let dx = clientX - centerRef.current.x
    let dy = clientY - centerRef.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > maxDistance) {
      dx = (dx / dist) * maxDistance
      dy = (dy / dist) * maxDistance
    }

    knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`

    // Normalize to -1..1
    const nx = dx / maxDistance
    const ny = dy / maxDistance

    gameEvents.emit(GAME_EVENTS.JOYSTICK_MOVE, { x: nx, y: ny })
  }, [])

  const handleEnd = useCallback(() => {
    activeRef.current = false
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)'
    }
    gameEvents.emit(GAME_EVENTS.JOYSTICK_STOP)
  }, [])

  return (
    <div className="md:hidden fixed bottom-6 left-6 z-30">
      <div
        ref={joystickRef}
        className="w-20 h-20 bg-[#1F1A15]/80 border border-[#D4AF37]/30 rounded-full flex items-center justify-center touch-none"
        onTouchStart={(e) => {
          const t = e.touches[0]
          handleStart(t.clientX, t.clientY)
        }}
        onTouchMove={(e) => {
          const t = e.touches[0]
          handleMove(t.clientX, t.clientY)
        }}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <div
          ref={knobRef}
          className="w-8 h-8 bg-[#D4AF37]/60 rounded-full transition-none"
        />
      </div>
    </div>
  )
}
