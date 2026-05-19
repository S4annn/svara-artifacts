# RelicVerse: Museum Hidup Adventure

> Game edukasi sejarah 2D berbasis AI. Jelajahi museum interaktif, bicara dengan artefak Nusantara, selesaikan quest, dan jadilah Relic Keeper.

## Konsep

RelicVerse adalah game 2D top-down museum adventure. User berperan sebagai "Relic Keeper" yang menjelajahi museum misterius di malam hari. Artefak-artefak kuno bisa berbicara melalui AI, tetapi ingatan mereka terpecah menjadi Memory Fragment yang harus dikumpulkan.

**Core Loop:** Explore → Interact → Talk → Discover → Solve → Earn → Unlock

## Fitur Utama

- 🎮 **Playable 2D Game** — Phaser.js museum scene dengan player movement
- 🗣️ **AI Dialogue** — Bicara dengan artefak melalui Gemini AI (roleplay edukatif)
- 🧩 **Memory Fragments** — Kumpulkan potongan ingatan dari setiap artefak
- ⚔️ **Quest System** — Main quest dan side quest dengan objectives
- 🏆 **XP & Badges** — Level up dan kumpulkan achievement
- 📝 **Quiz Challenge** — Multiple choice quiz per artefak
- 🗺️ **Museum Rooms** — Buka ruangan baru seiring progress
- 📱 **Mobile Support** — Virtual joystick untuk mobile
- 👨‍🏫 **Admin Panel** — Kelola konten artefak, quiz, quest
- 🛡️ **Auth** — Supabase Auth dengan protected routes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Game Engine | Phaser.js |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| AI | Google Gemini API |
| Deployment | Vercel + Supabase |

## Struktur Folder

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Login page
│   ├── register/             # Register page
│   ├── admin/                # Admin panel
│   ├── api/chat/             # Gemini AI route
│   └── (game)/
│       ├── play/             # Main game screen
│       ├── onboarding/       # Character setup
│       └── passport/         # Museum passport/profile
├── components/
│   ├── dialogue/             # AI chat modal
│   ├── game/                 # Game overlay, joystick, popups
│   └── quiz/                 # Quiz challenge
├── game/
│   ├── MuseumScene.ts        # Phaser scene
│   ├── PhaserGame.tsx        # React wrapper
│   └── events.ts             # Phaser-React event bridge
├── lib/supabase/             # Supabase client/server
└── types/                    # TypeScript types
```

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd svara-artifacts
npm install
```

### 2. Setup Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Jalankan `supabase/schema.sql` di SQL Editor
3. Jalankan `supabase/seed.sql` di SQL Editor
4. Aktifkan Email Auth di Authentication > Providers
5. Tambahkan redirect URL: `http://localhost:3000`

### 3. Environment Variables

Copy `.env.local.example` ke `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run Development

```bash
npm run dev
```

Buka http://localhost:3000

### 5. Membuat Admin

Setelah register, update role di Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Cara Bermain

1. Buka landing page → klik "Play Game"
2. Register/Login
3. Pilih role dan avatar di onboarding
4. Gerakkan karakter dengan WASD/Arrow keys
5. Dekati artefak yang bercahaya
6. Tekan E atau Space untuk berinteraksi
7. Bicara dengan artefak melalui AI chat
8. Selesaikan quest dan quiz
9. Kumpulkan XP, badge, dan memory fragment
10. Buka ruangan baru

## Database Schema

Lihat `supabase/schema.sql` untuk schema lengkap. Tabel utama:
- `profiles` — User profile + game state
- `museum_rooms` — Ruangan museum
- `artifacts` — Data artefak + AI persona
- `artifact_memory_fragments` — Potongan ingatan
- `chats` / `chat_messages` — Chat history
- `quizzes` / `quiz_results` — Quiz system
- `quests` / `user_quests` — Quest system
- `badges` / `user_badges` — Badge collection
- `user_xp_logs` — XP tracking

## Deployment (Vercel)

1. Push ke GitHub
2. Import di Vercel
3. Set environment variables
4. Deploy

## Future Improvements

- [ ] Tiled map editor integration
- [ ] Sprite animations untuk player
- [ ] Mystery Artifact Challenge mode
- [ ] Daily Missions & Streak
- [ ] Leaderboard
- [ ] Teacher Mode (generate worksheets)
- [ ] 3D artifact viewer
- [ ] Sound effects & ambient music
- [ ] Story chapters progression
- [ ] Share achievement to social media

## License

MIT
