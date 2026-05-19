'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles } from 'lucide-react'

interface DialogueModalProps {
  artifactId: string
  onClose: () => void
  onReward: (type: string, value: string) => void
}

interface Message {
  id: string
  sender: 'user' | 'ai'
  content: string
}

const QUICK_CHOICES = [
  'Siapa kamu?',
  'Ceritakan asal-usulmu',
  'Apa fungsi utamamu?',
  'Apa nilai budayamu?',
  'Apa fakta tersembunyimu?',
  'Berikan petunjuk untuk quest ini',
]

// Artifact data for offline/demo mode
const ARTIFACT_DATA: Record<string, { name: string; greeting: string; tone: string }> = {
  'keris-jawa': {
    name: 'Keris Jawa',
    greeting: 'Aku adalah Keris Jawa. Jangan lihat aku hanya sebagai senjata, karena di lekuk bilahku tersimpan kisah kehormatan, pusaka, dan identitas budaya.',
    tone: 'bijaksana',
  },
}

export default function DialogueModal({ artifactId, onClose, onReward }: DialogueModalProps) {
  const artifact = ARTIFACT_DATA[artifactId] || ARTIFACT_DATA['keris-jawa']
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', content: artifact.greeting },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactId,
          message: text,
          mode: 'student',
          explanationLevel: 'umum',
        }),
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()
      const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', content: data.aiMessage }
      setMessages((prev) => [...prev, aiMsg])

      // Handle rewards
      if (data.earnedXp) {
        onReward('xp', `+${data.earnedXp} XP`)
      }
      if (data.unlockedFragments?.length) {
        onReward('fragment', 'Memory Fragment Found!')
      }
    } catch {
      const fallback: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: 'Maaf, suara artefak sedang terputus sebentar. Coba tanyakan lagi dalam beberapa saat.',
      }
      setMessages((prev) => [...prev, fallback])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full max-w-lg bg-[#1F1A15] border border-[#D4AF37]/20 rounded-xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#D4AF37]/10 bg-[#15110E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F8F1E7]">{artifact.name}</h3>
              <p className="text-xs text-[#B8AFA3]">Gaya: {artifact.tone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-colors"
          >
            <X className="w-4 h-4 text-[#B8AFA3]" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#D4AF37]/20 text-[#F8F1E7]'
                      : 'bg-[#15110E] text-[#F8F1E7] border border-[#D4AF37]/10'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#15110E] border border-[#D4AF37]/10 px-3 py-2 rounded-lg">
                <span className="text-[#B8AFA3] text-sm animate-pulse">Artefak sedang berpikir...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Choices */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_CHOICES.slice(0, 4).map((choice) => (
            <button
              key={choice}
              onClick={() => sendMessage(choice)}
              disabled={loading}
              className="whitespace-nowrap text-xs bg-[#15110E] border border-[#D4AF37]/20 text-[#D4AF37] px-3 py-1.5 rounded-full hover:bg-[#D4AF37]/10 transition-colors disabled:opacity-50 shrink-0"
            >
              {choice}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-[#D4AF37]/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu..."
            disabled={loading}
            className="flex-1 bg-[#15110E] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-sm text-[#F8F1E7] placeholder-[#B8AFA3]/50 focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-9 h-9 bg-[#D4AF37] rounded-lg flex items-center justify-center hover:bg-[#e6c44a] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-[#0F0C0A]" />
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
