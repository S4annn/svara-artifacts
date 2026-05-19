'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import { Compass, MessageCircle, Puzzle, Trophy, Gamepad2, Sparkles, Lock, ChevronDown } from 'lucide-react'

// Floating particles component
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#D4AF37]/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}

// Decorative divider like the reference
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <div className="w-12 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
      </div>
      <div className="w-2 h-2 rotate-45 border border-[#D4AF37]/60" />
      <div className="flex items-center gap-1">
        <div className="w-12 h-px bg-gradient-to-l from-[#D4AF37] to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      </div>
    </div>
  )
}

const gameFeatures = [
  { icon: Gamepad2, title: 'Explore the Museum', desc: 'Gerakkan karaktermu menjelajahi ruangan museum yang misterius dan penuh rahasia.' },
  { icon: MessageCircle, title: 'Talk with AI Artifacts', desc: 'Setiap artefak punya kepribadian unik. Tanyakan kisah mereka melalui AI dialogue.' },
  { icon: Puzzle, title: 'Unlock Memory Fragments', desc: 'Temukan potongan ingatan tersembunyi dan bantu artefak mengingat sejarahnya.' },
  { icon: Compass, title: 'Complete Quests', desc: 'Ikuti misi utama dan side quest untuk membuka area museum yang terkunci.' },
  { icon: Trophy, title: 'Earn XP & Badges', desc: 'Naik level, kumpulkan badge, dan buktikan dirimu sebagai Relic Keeper sejati.' },
  { icon: Sparkles, title: 'Learn Through Play', desc: 'Sejarah Nusantara jadi hidup, menyenangkan, dan mudah diingat.' },
]

const howToPlay = [
  { num: '01', title: 'Move Your Character', desc: 'Gerakkan Relic Keeper menggunakan WASD, arrow keys, atau virtual joystick di mobile.' },
  { num: '02', title: 'Find Glowing Artifacts', desc: 'Dekati artefak yang bercahaya dan tekan tombol Interact.' },
  { num: '03', title: 'Talk and Ask', desc: 'Tanyakan asal-usul, fungsi, nilai budaya, dan kisah tersembunyi artefak melalui AI.' },
  { num: '04', title: 'Earn and Unlock', desc: 'Dapatkan XP, Memory Fragment, Badge, dan buka ruangan museum baru.' },
]

const artifacts = [
  { name: 'Keris Jawa', origin: 'Jawa', personality: 'Bijaksana', rarity: 'Epic', status: 'Awakened' },
  { name: 'Candi Borobudur', origin: 'Jawa Tengah', personality: 'Filosofis', rarity: 'Legendary', status: 'Awakened' },
  { name: 'Prasasti Yupa', origin: 'Kalimantan Timur', personality: 'Formal', rarity: 'Rare', status: 'Awakened' },
  { name: 'Angklung', origin: 'Jawa Barat', personality: 'Ceria', rarity: 'Rare', status: 'Awakened' },
  { name: 'Topeng Cirebon', origin: 'Cirebon', personality: 'Teatrikal', rarity: 'Common', status: 'Locked' },
  { name: 'Batik Parang', origin: 'Jawa', personality: 'Elegan', rarity: 'Common', status: 'Locked' },
]

const rarityColors: Record<string, string> = {
  Common: 'border-[#B8AFA3]/30',
  Rare: 'border-[#1F8A70]/50',
  Epic: 'border-[#D4AF37]/50',
  Legendary: 'border-[#D4AF37]',
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div className="min-h-screen bg-[#071510] overflow-hidden">
      {/* Navbar — game style, transparent */}
      <nav className="fixed top-0 w-full z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mt-3 flex items-center justify-between h-14 px-5 rounded-full bg-[#0D1F18]/80 backdrop-blur-md border border-[#1F8A70]/15">
            <Link href="/" className="text-lg font-bold text-[#D4AF37] tracking-wider">
              RelicVerse
            </Link>
            <div className="hidden md:flex items-center gap-7 text-sm text-[#B8AFA3]">
              <a href="#game-info" className="hover:text-[#F8F1E7] transition-colors">Game Info</a>
              <a href="#how-to-play" className="hover:text-[#F8F1E7] transition-colors">How to Play</a>
              <a href="#lore" className="hover:text-[#F8F1E7] transition-colors">Lore</a>
              <a href="#artifacts" className="hover:text-[#F8F1E7] transition-colors">Artifacts</a>
              <a href="#about" className="hover:text-[#F8F1E7] transition-colors">About</a>
            </div>
            <Link
              href="/login"
              className="bg-[#D4AF37] text-[#071510] px-5 py-1.5 rounded-full text-sm font-bold hover:bg-[#e6c44a] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/20"
            >
              Play Game
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — Full screen immersive */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071510] via-[#0D1F18] to-[#071510]" />
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* Radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1F8A70]/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[80px]" />
        </motion.div>
        <Particles />

        {/* Decorative corner leaves/vines (CSS shapes) */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
          <div className="absolute top-4 left-4 w-16 h-1 bg-[#1F8A70] rounded-full rotate-45" />
          <div className="absolute top-8 left-2 w-12 h-1 bg-[#1F8A70] rounded-full rotate-[30deg]" />
          <div className="absolute top-2 left-8 w-10 h-1 bg-[#1F8A70] rounded-full rotate-[60deg]" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="absolute top-4 right-4 w-16 h-1 bg-[#1F8A70] rounded-full -rotate-45" />
          <div className="absolute top-8 right-2 w-12 h-1 bg-[#1F8A70] rounded-full -rotate-[30deg]" />
          <div className="absolute top-2 right-8 w-10 h-1 bg-[#1F8A70] rounded-full -rotate-[60deg]" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#1F8A70] text-xs font-bold tracking-[0.3em] uppercase mb-6">
              2D Cozy Museum Adventure
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#F8F1E7] leading-[0.9] mb-4 tracking-tight">
              Relic<span className="text-[#D4AF37]">Verse</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#B8AFA3] font-light mb-3">
              Museum Hidup Adventure
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[#B8AFA3]/80 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Bangunkan artefak. Pulihkan sejarah. Jadilah Relic Keeper.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/login"
              className="group relative bg-[#D4AF37] text-[#071510] px-10 py-3.5 rounded-full font-bold text-lg hover:bg-[#e6c44a] transition-all shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:scale-105"
            >
              Play Game
              <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-md group-hover:blur-lg transition-all" />
            </Link>
            <a
              href="#how-to-play"
              className="border border-[#F8F1E7]/20 text-[#F8F1E7] px-10 py-3.5 rounded-full font-semibold text-lg hover:bg-[#F8F1E7]/5 hover:border-[#F8F1E7]/40 transition-all"
            >
              How to Play
            </a>
          </motion.div>

          {/* Floating game cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { text: 'AI Talking Artifacts', color: '#1F8A70' },
              { text: 'Memory Fragment Found!', color: '#D4AF37' },
              { text: 'Quest Completed +100 XP', color: '#A97142' },
              { text: 'Room Unlocked', color: '#1F8A70' },
            ].map((card, i) => (
              <motion.div
                key={card.text}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                className="bg-[#0D1F18]/80 backdrop-blur-sm border border-[#1F8A70]/20 rounded-lg px-3 py-1.5 text-xs text-[#F8F1E7]/80"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: card.color }} />
                {card.text}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-5 h-5 text-[#B8AFA3]/40" />
        </motion.div>
      </section>

      {/* Game Info Section */}
      <section id="game-info" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071510] via-[#0D1F18] to-[#071510]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Divider />
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8F1E7] mt-6 mb-3">
              Explore, Talk, Discover, Unlock
            </h2>
            <p className="text-[#B8AFA3] max-w-lg mx-auto text-sm">
              Setiap artefak menyimpan potongan cerita. Dekati, dengarkan, dan bantu mereka mengingat kembali sejarahnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gameFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-[#0D1F18]/60 backdrop-blur-sm border border-[#1F8A70]/10 rounded-2xl p-6 hover:border-[#1F8A70]/30 transition-all hover:bg-[#0D1F18]/80"
              >
                <div className="w-11 h-11 bg-[#1F8A70]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1F8A70]/20 transition-colors">
                  <f.icon className="w-5 h-5 text-[#1F8A70]" />
                </div>
                <h3 className="text-base font-semibold text-[#F8F1E7] mb-2">{f.title}</h3>
                <p className="text-sm text-[#B8AFA3] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lore Section */}
      <section id="lore" className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-[#071510]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/[0.02] to-transparent" />
        <Particles />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Divider />
          <h2 className="text-3xl md:text-4xl font-bold text-[#F8F1E7] mt-6 mb-8">Lore</h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[#B8AFA3] leading-[1.8] text-base md:text-lg italic"
          >
            &ldquo;Pada suatu malam, Museum Nusantara tiba-tiba hidup. Artefak-artefak kuno mulai bersuara,
            tetapi ingatan mereka pecah menjadi <span className="text-[#D4AF37]">Memory Fragment</span>.
            Sebuah AI guide bernama <span className="text-[#1F8A70]">Nara</span> memanggilmu untuk menjadi
            Relic Keeper — penjaga muda yang bertugas memulihkan kisah warisan Nusantara.&rdquo;
          </motion.p>
          <Divider />
        </div>
      </section>

      {/* How to Play */}
      <section id="how-to-play" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071510] via-[#0D1F18] to-[#071510]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Divider />
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8F1E7] mt-6 mb-3">How to Play</h2>
            <p className="text-[#B8AFA3] text-sm">Sederhana, intuitif, dan menyenangkan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {howToPlay.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 bg-[#0D1F18]/40 border border-[#1F8A70]/10 rounded-2xl p-5"
              >
                <div className="shrink-0 w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold text-lg">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#F8F1E7] mb-1">{step.title}</h3>
                  <p className="text-xs text-[#B8AFA3] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artifacts Preview */}
      <section id="artifacts" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-[#071510]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Divider />
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8F1E7] mt-6 mb-3">
              Meet the Living Artifacts
            </h2>
            <p className="text-[#B8AFA3] text-sm">Koleksi artefak yang menunggu untuk menceritakan kisahnya.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {artifacts.map((art, i) => (
              <motion.div
                key={art.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`group relative bg-[#0D1F18]/60 border ${rarityColors[art.rarity]} rounded-2xl p-5 hover:bg-[#0D1F18]/80 transition-all cursor-pointer`}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-[#1F8A70]/0 group-hover:bg-[#1F8A70]/5 transition-colors" />

                {/* Artifact icon placeholder */}
                <div className="relative w-full aspect-square bg-[#071510] rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  {art.status === 'Locked' ? (
                    <Lock className="w-8 h-8 text-[#B8AFA3]/30" />
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-[#F8F1E7] truncate">{art.name}</h3>
                  </div>
                  <p className="text-xs text-[#B8AFA3]">{art.origin}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-[#1F8A70]">{art.personality}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      art.status === 'Awakened'
                        ? 'bg-[#1F8A70]/10 text-[#1F8A70]'
                        : 'bg-[#B8AFA3]/10 text-[#B8AFA3]'
                    }`}>
                      {art.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-28 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#071510] via-[#0D1F18] to-[#071510]" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Divider />
          <h2 className="text-3xl md:text-4xl font-bold text-[#F8F1E7] mt-6 mb-6">About RelicVerse</h2>
          <p className="text-[#B8AFA3] leading-[1.8] text-sm md:text-base">
            RelicVerse adalah game edukasi sejarah berbasis AI yang mengubah museum menjadi dunia petualangan interaktif.
            Pemain dapat menjelajahi ruangan museum, berbicara dengan artefak, membuka memory fragment,
            dan belajar budaya Nusantara melalui pengalaman yang fun dan imersif.
          </p>
          <div className="mt-8">
            <Divider />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-[#071510]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/[0.03] to-transparent" />
        <Particles />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8F1E7] mb-4">
              Siap Menjadi Relic Keeper?
            </h2>
            <p className="text-[#B8AFA3] mb-10 text-sm">
              Museum sudah menunggumu. Artefak-artefak ingin menceritakan kisah mereka.
            </p>
            <Link
              href="/login"
              className="group relative inline-block bg-[#D4AF37] text-[#071510] px-12 py-4 rounded-full font-bold text-lg hover:bg-[#e6c44a] transition-all shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:scale-105"
            >
              Mulai Petualangan
              <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-md group-hover:blur-lg transition-all" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-[#1F8A70]/10 bg-[#071510]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#D4AF37] font-bold tracking-wider">RelicVerse</p>
          <p className="text-xs text-[#B8AFA3]/60">Museum Hidup Adventure — Game Edukasi Sejarah Nusantara</p>
          <p className="text-xs text-[#B8AFA3]/60">&copy; 2026 RelicVerse</p>
        </div>
      </footer>
    </div>
  )
}
