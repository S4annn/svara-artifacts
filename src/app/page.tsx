'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Compass, MessageCircle, Puzzle, Trophy, Map, Sparkles } from 'lucide-react'

const features = [
  { icon: Map, title: 'Jelajahi Museum', desc: 'Masuki museum 2D dan gerakkan karaktermu dari ruang ke ruang.' },
  { icon: MessageCircle, title: 'Bicara dengan Artefak', desc: 'Artefak hidup dan bisa bercerita melalui AI.' },
  { icon: Puzzle, title: 'Buka Memory Fragment', desc: 'Temukan potongan ingatan tersembunyi dari setiap artefak.' },
  { icon: Compass, title: 'Selesaikan Quest', desc: 'Ikuti misi utama dan side quest untuk membuka area baru.' },
  { icon: Trophy, title: 'Kumpulkan Badge & XP', desc: 'Naik level dan raih badge sebagai Relic Keeper.' },
  { icon: Sparkles, title: 'Belajar Sambil Bermain', desc: 'Sejarah Nusantara jadi hidup dan menyenangkan.' },
]

const steps = [
  { num: '1', text: 'Gerakkan karakter dengan WASD' },
  { num: '2', text: 'Dekati artefak yang bercahaya' },
  { num: '3', text: 'Tekan E untuk berinteraksi' },
  { num: '4', text: 'Tanyakan kisah artefak' },
  { num: '5', text: 'Selesaikan quest & quiz' },
  { num: '6', text: 'Buka ruangan baru' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F0C0A]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0F0C0A]/80 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#D4AF37] tracking-wide">
            RelicVerse
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#B8AFA3]">
            <a href="#features" className="hover:text-[#D4AF37] transition-colors">Fitur</a>
            <a href="#how-to-play" className="hover:text-[#D4AF37] transition-colors">Cara Bermain</a>
            <Link href="/login" className="hover:text-[#D4AF37] transition-colors">Login</Link>
          </div>
          <Link
            href="/login"
            className="bg-[#D4AF37] text-[#0F0C0A] px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#e6c44a] transition-colors"
          >
            Play Game
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase mb-4">
              2D Museum Adventure Game
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#F8F1E7] leading-tight mb-6">
              Masuki Museum Hidup dan Pulihkan Ingatan Artefak Nusantara
            </h1>
            <p className="text-lg text-[#B8AFA3] max-w-2xl mx-auto mb-10">
              Jelajahi museum 2D interaktif, bicara dengan artefak melalui AI, selesaikan quest,
              kumpulkan memory fragment, dan jadilah Relic Keeper.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/login"
              className="bg-[#D4AF37] text-[#0F0C0A] px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#e6c44a] transition-colors shadow-lg shadow-[#D4AF37]/20"
            >
              Play Game
            </Link>
            <a
              href="#how-to-play"
              className="border border-[#D4AF37]/40 text-[#D4AF37] px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#D4AF37]/10 transition-colors"
            >
              Cara Bermain
            </a>
          </motion.div>

          {/* Hero visual placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="w-full max-w-3xl mx-auto aspect-video bg-[#15110E] rounded-xl border border-[#D4AF37]/20 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <p className="text-[#B8AFA3] text-sm">Museum 2D Preview</p>
                  <p className="text-[#D4AF37] text-xs mt-1">Explore • Interact • Discover</p>
                </div>
              </div>
              {/* Decorative glowing dots */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse" />
              <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#1F8A70] rounded-full animate-pulse delay-300" />
              <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#A97142] rounded-full animate-pulse delay-700" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-[#15110E]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#F8F1E7] mb-4">Fitur Utama</h2>
          <p className="text-center text-[#B8AFA3] mb-12">Bukan website museum biasa — ini game adventure.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1F1A15] border border-[#D4AF37]/10 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors"
              >
                <f.icon className="w-8 h-8 text-[#D4AF37] mb-4" />
                <h3 className="text-lg font-semibold text-[#F8F1E7] mb-2">{f.title}</h3>
                <p className="text-sm text-[#B8AFA3]">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section id="how-to-play" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#F8F1E7] mb-4">Cara Bermain</h2>
          <p className="text-center text-[#B8AFA3] mb-12">Sederhana, intuitif, dan menyenangkan.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1F1A15] border border-[#D4AF37]/10 rounded-lg p-5 text-center"
              >
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#D4AF37] font-bold">{s.num}</span>
                </div>
                <p className="text-sm text-[#F8F1E7]">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#15110E]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#F8F1E7] mb-4">Siap Menjadi Relic Keeper?</h2>
          <p className="text-[#B8AFA3] mb-8">Museum sudah menunggumu. Artefak-artefak ingin menceritakan kisah mereka.</p>
          <Link
            href="/login"
            className="inline-block bg-[#D4AF37] text-[#0F0C0A] px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#e6c44a] transition-colors shadow-lg shadow-[#D4AF37]/20"
          >
            Mulai Petualangan
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#D4AF37]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#D4AF37] font-bold">RelicVerse</p>
          <p className="text-xs text-[#B8AFA3]">Museum Hidup Adventure — Game Edukasi Sejarah Nusantara</p>
          <p className="text-xs text-[#B8AFA3]">&copy; 2026 RelicVerse</p>
        </div>
      </footer>
    </div>
  )
}
