'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation?: string
}

interface QuizChallengeProps {
  artifactName: string
  questions: QuizQuestion[]
  onComplete: (score: number, total: number) => void
  onClose: () => void
}

export default function QuizChallenge({ artifactName, questions, onComplete, onClose }: QuizChallengeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = questions[currentIndex]
  const options = [
    { key: 'A', text: current?.option_a },
    { key: 'B', text: current?.option_b },
    { key: 'C', text: current?.option_c },
    { key: 'D', text: current?.option_d },
  ]

  function handleSelect(key: string) {
    if (showResult) return
    setSelectedAnswer(key)
    setShowResult(true)
    if (key === current.correct_answer) {
      setCorrectCount((c) => c + 1)
    }
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setFinished(true)
      onComplete(correctCount + (selectedAnswer === current.correct_answer ? 1 : 0), questions.length)
    }
  }

  if (finished) {
    const finalScore = correctCount
    const isPerfect = finalScore === questions.length
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      >
        <div className="bg-[#0D1F18] border border-[#D4AF37]/20 rounded-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className={`w-8 h-8 ${isPerfect ? 'text-[#D4AF37]' : 'text-[#B8AFA3]'}`} />
          </div>
          <h3 className="text-xl font-bold text-[#F8F1E7] mb-2">Quiz Selesai!</h3>
          <p className="text-[#B8AFA3] mb-1">{artifactName}</p>
          <p className="text-3xl font-bold text-[#D4AF37] my-4">{finalScore}/{questions.length}</p>
          {isPerfect && <p className="text-sm text-[#1F8A70] mb-4">Perfect Score! +100 XP</p>}
          {!isPerfect && <p className="text-sm text-[#B8AFA3] mb-4">+{finalScore * 20} XP</p>}
          <button
            onClick={onClose}
            className="w-full bg-[#D4AF37] text-[#071510] py-2.5 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors"
          >
            Kembali ke Museum
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="bg-[#0D1F18] border border-[#D4AF37]/20 rounded-xl p-6 max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#D4AF37]">Quiz: {artifactName}</p>
          <p className="text-xs text-[#B8AFA3]">{currentIndex + 1}/{questions.length}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#071510] rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold text-[#F8F1E7] mb-5">{current.question}</h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.key
            const isCorrect = opt.key === current.correct_answer
            let borderColor = 'border-[#D4AF37]/10'
            let bgColor = 'bg-[#071510]'

            if (showResult) {
              if (isCorrect) {
                borderColor = 'border-[#1F8A70]'
                bgColor = 'bg-[#1F8A70]/10'
              } else if (isSelected && !isCorrect) {
                borderColor = 'border-[#6B1F1F]'
                bgColor = 'bg-[#6B1F1F]/10'
              }
            } else if (isSelected) {
              borderColor = 'border-[#D4AF37]'
              bgColor = 'bg-[#D4AF37]/10'
            }

            return (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                disabled={showResult}
                className={`w-full text-left px-4 py-3 rounded-lg border ${borderColor} ${bgColor} transition-all flex items-center gap-3`}
              >
                <span className="text-xs font-bold text-[#D4AF37] w-5">{opt.key}</span>
                <span className="text-sm text-[#F8F1E7] flex-1">{opt.text}</span>
                {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-[#1F8A70]" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-[#6B1F1F]" />}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showResult && current.explanation && (
          <div className="bg-[#071510] border border-[#D4AF37]/10 rounded-lg p-3 mb-4">
            <p className="text-xs text-[#B8AFA3]">{current.explanation}</p>
          </div>
        )}

        {/* Next button */}
        {showResult && (
          <button
            onClick={handleNext}
            className="w-full bg-[#D4AF37] text-[#071510] py-2.5 rounded-lg font-semibold hover:bg-[#e6c44a] transition-colors flex items-center justify-center gap-2"
          >
            {currentIndex < questions.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
