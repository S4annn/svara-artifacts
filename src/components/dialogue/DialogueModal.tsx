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

const ARTIFACT_DATA: Record<string, { name: string; greeting: string; tone: string; origin: string }> = {
  'keris-jawa': {
    name: 'Keris Jawa',
    greeting: 'Aku adalah Keris Jawa. Jangan lihat aku hanya sebagai senjata, karena di lekuk bilahku tersimpan kisah kehormatan, pusaka, dan identitas budaya.',
    tone: 'Bijaksana',
    origin: 'Jawa',
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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-[#0D1F18] border border-[#1F8A70]/30 rounded-3xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl shadow-[#1F8A70]/10"
      >
        {/* Header — RPG style */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F8A70]/15 bg-gradient-to-r from-[#0D1F18] to-[#071510]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#D4AF37]/15 rounded-xl flex items-center justify-center border border-[#D4AF37]/30">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F8F1E7]">{artifact.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[#1F8A70] bg-[#1F8A70]/10 px-2 py-0.5 rounded-full">{artifact.tone}</span>
                <span className="text-[10px] text-[#B8AFA3]">{artifact.origin}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1F8A70]/10 transition-colors"
          >
            <X className="w-4 h-4 text-[#B8AFA3]" />
          </button>
        </div>

        {/* Messages — RPG dialogue style */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[200px]">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1F8A70]/20 text-[#F8F1E7] border border-[#1F8A70]/20 rounded-br-md'
                      : 'bg-[#071510] text-[#F8F1E7] border border-[#D4AF37]/10 rounded-bl-md'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <p className="text-[10px] text-[#D4AF37] font-bold mb-1">{artifact.name}</p>
                  )}
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#071510] border border-[#D4AF37]/10 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Choices */}
        <div className="px-5 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
          {QUICK_CHOICES.slice(0, 4).map((choice) => (
            <button
              key={choice}
              onClick={() => sendMessage(choice)}
              disabled={loading}
              className="whitespace-nowrap text-xs bg-[#071510] border border-[#1F8A70]/20 text-[#1F8A70] px-3 py-1.5 rounded-full hover:bg-[#1F8A70]/10 hover:border-[#1F8A70]/40 transition-all disabled:opacity-40 shrink-0"
            >
              {choice}
            </button>
          ))}
        </div>

        {/* Input — game style */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#1F8A70]/15 flex gap-2 bg-[#071510]/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu kepada artefak..."
            disabled={loading}
            className="flex-1 bg-[#071510] border border-[#1F8A70]/20 rounded-xl px-4 py-2.5 text-sm text-[#F8F1E7] placeholder-[#B8AFA3]/40 focus:outline-none focus:border-[#1F8A70]/50 focus:ring-1 focus:ring-[#1F8A70]/20 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 bg-[#1F8A70] rounded-xl flex items-center justify-center hover:bg-[#1F8A70]/80 transition-colors disabled:opacity-40 disabled:hover:bg-[#1F8A70]"
          >
            <Send className="w-4 h-4 text-[#F8F1E7]" />
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
