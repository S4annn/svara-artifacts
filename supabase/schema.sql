-- ============================================
-- RelicVerse: Museum Hidup Adventure
-- Complete Database Schema for Supabase
-- ============================================

-- 1. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  avatar_key TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  selected_game_role TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_room TEXT DEFAULT 'lobby',
  player_position_x INTEGER DEFAULT 400,
  player_position_y INTEGER DEFAULT 300,
  streak_count INTEGER DEFAULT 0,
  last_active_date DATE,
  show_on_leaderboard BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MUSEUM ROOMS
CREATE TABLE public.museum_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  theme TEXT,
  map_key TEXT,
  background_image_url TEXT,
  icon TEXT,
  required_level INTEGER DEFAULT 1,
  reward_xp INTEGER DEFAULT 100,
  is_default_unlocked BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARTIFACTS
CREATE TABLE public.artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.museum_rooms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  origin_region TEXT,
  historical_period TEXT,
  discovery_location TEXT,
  current_location TEXT,
  material TEXT,
  main_function TEXT,
  description TEXT,
  cultural_value TEXT,
  interesting_facts TEXT,
  image_url TEXT,
  sprite_url TEXT,
  model_3d_url TEXT,
  game_x INTEGER DEFAULT 0,
  game_y INTEGER DEFAULT 0,
  interaction_radius INTEGER DEFAULT 80,
  is_locked BOOLEAN DEFAULT FALSE,
  unlock_required_level INTEGER DEFAULT 1,
  is_mystery BOOLEAN DEFAULT FALSE,
  personality_tone TEXT,
  speaking_style TEXT,
  difficulty_level TEXT DEFAULT 'medium',
  first_greeting TEXT,
  completion_message TEXT,
  ai_persona_prompt TEXT,
  source_title TEXT,
  source_url TEXT,
  source_note TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 4. ARTIFACT MEMORY FRAGMENTS
CREATE TABLE public.artifact_memory_fragments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  unlock_condition TEXT,
  trigger_keywords TEXT[],
  reward_xp INTEGER DEFAULT 20,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER MEMORY FRAGMENTS
CREATE TABLE public.user_memory_fragments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  fragment_id UUID REFERENCES public.artifact_memory_fragments(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fragment_id)
);

-- 6. CHATS
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CHAT MESSAGES
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai', 'system')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. QUIZZES
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT,
  explanation TEXT,
  reward_xp INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QUIZ RESULTS
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  score INTEGER,
  total_questions INTEGER,
  correct_answers INTEGER,
  earned_xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. QUESTS
CREATE TABLE public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  quest_type TEXT,
  requirement_type TEXT,
  requirement_value TEXT,
  reward_xp INTEGER DEFAULT 100,
  required_level INTEGER DEFAULT 1,
  unlocks_room_id UUID REFERENCES public.museum_rooms(id) ON DELETE SET NULL,
  unlocks_badge_id UUID,
  is_main_quest BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. USER QUESTS
CREATE TABLE public.user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'claimed')),
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- 12. BADGES
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  condition_type TEXT,
  condition_value TEXT,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  reward_xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. USER BADGES
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 14. USER PROGRESS (per artifact)
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'discovered' CHECK (status IN ('discovered', 'in_progress', 'completed')),
  chat_count INTEGER DEFAULT 0,
  inspected BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  last_interacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, artifact_id)
);

-- 15. USER XP LOGS
CREATE TABLE public.user_xp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT,
  source_id UUID,
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. FAVORITES / COLLECTION
CREATE TABLE public.collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, artifact_id)
);

-- 17. DAILY MISSIONS
CREATE TABLE public.daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  mission_type TEXT,
  target_value INTEGER DEFAULT 1,
  reward_xp INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. USER DAILY MISSIONS
CREATE TABLE public.user_daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES public.daily_missions(id) ON DELETE CASCADE,
  mission_date DATE DEFAULT CURRENT_DATE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ
);

-- 19. STORY CHAPTERS
CREATE TABLE public.story_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  required_level INTEGER DEFAULT 1,
  reward_xp INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. USER STORY PROGRESS
CREATE TABLE public.user_story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.story_chapters(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. MYSTERY CHALLENGES
CREATE TABLE public.mystery_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  clue TEXT NOT NULL,
  hints JSONB,
  answer TEXT NOT NULL,
  reward_xp INTEGER DEFAULT 100,
  reward_xp_no_hint INTEGER DEFAULT 150,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. USER MYSTERY ATTEMPTS
CREATE TABLE public.user_mystery_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.mystery_challenges(id) ON DELETE CASCADE,
  hints_used INTEGER DEFAULT 0,
  questions_asked INTEGER DEFAULT 0,
  is_solved BOOLEAN DEFAULT FALSE,
  solved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.museum_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifact_memory_fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memory_fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystery_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mystery_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Public readable tables (authenticated)
CREATE POLICY "rooms_select" ON public.museum_rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "artifacts_select" ON public.artifacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "fragments_select" ON public.artifact_memory_fragments FOR SELECT TO authenticated USING (true);
CREATE POLICY "quizzes_select" ON public.quizzes FOR SELECT TO authenticated USING (true);
CREATE POLICY "quests_select" ON public.quests FOR SELECT TO authenticated USING (true);
CREATE POLICY "badges_select" ON public.badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "daily_missions_select" ON public.daily_missions FOR SELECT TO authenticated USING (true);
CREATE POLICY "story_chapters_select" ON public.story_chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "mystery_challenges_select" ON public.mystery_challenges FOR SELECT TO authenticated USING (true);

-- User-owned data policies
CREATE POLICY "user_fragments_select" ON public.user_memory_fragments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_fragments_insert" ON public.user_memory_fragments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chats_select" ON public.chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "chats_insert" ON public.chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chats_update" ON public.chats FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "messages_select" ON public.chat_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.chats WHERE chats.id = chat_messages.chat_id AND chats.user_id = auth.uid())
);
CREATE POLICY "messages_insert" ON public.chat_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.chats WHERE chats.id = chat_messages.chat_id AND chats.user_id = auth.uid())
);

CREATE POLICY "quiz_results_select" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quiz_results_insert" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_quests_select" ON public.user_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_quests_insert" ON public.user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_quests_update" ON public.user_quests FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_badges_select" ON public.user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_badges_insert" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_select" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_progress_insert" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_progress_update" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "xp_logs_select" ON public.user_xp_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "xp_logs_insert" ON public.user_xp_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "collection_select" ON public.collection_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "collection_insert" ON public.collection_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "collection_delete" ON public.collection_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "user_daily_select" ON public.user_daily_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_daily_insert" ON public.user_daily_missions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_daily_update" ON public.user_daily_missions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_story_select" ON public.user_story_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_story_insert" ON public.user_story_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_story_update" ON public.user_story_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_mystery_select" ON public.user_mystery_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_mystery_insert" ON public.user_mystery_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_mystery_update" ON public.user_mystery_attempts FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (for content management tables)
CREATE POLICY "rooms_admin" ON public.museum_rooms FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "artifacts_admin" ON public.artifacts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "fragments_admin" ON public.artifact_memory_fragments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "quizzes_admin" ON public.quizzes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "quests_admin" ON public.quests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "badges_admin" ON public.badges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add XP function
CREATE OR REPLACE FUNCTION public.add_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source_type TEXT DEFAULT NULL,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS TABLE(new_total_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN) AS $$
DECLARE
  old_level INTEGER;
  new_xp INTEGER;
  calc_level INTEGER;
BEGIN
  SELECT total_xp, level INTO new_xp, old_level FROM public.profiles WHERE id = p_user_id;
  new_xp := COALESCE(new_xp, 0) + p_amount;

  -- Level thresholds: 0, 100, 250, 500, 850, 1300
  calc_level := CASE
    WHEN new_xp >= 1300 THEN 6
    WHEN new_xp >= 850 THEN 5
    WHEN new_xp >= 500 THEN 4
    WHEN new_xp >= 250 THEN 3
    WHEN new_xp >= 100 THEN 2
    ELSE 1
  END;

  UPDATE public.profiles
  SET total_xp = new_xp, level = calc_level, updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO public.user_xp_logs (user_id, source_type, source_id, amount, description)
  VALUES (p_user_id, p_source_type, p_source_id, p_amount, p_description);

  RETURN QUERY SELECT new_xp, calc_level, (calc_level > COALESCE(old_level, 1));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
