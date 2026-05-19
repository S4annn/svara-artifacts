// ============================================
// RelicVerse: Museum Hidup Adventure - Types
// ============================================

export interface Profile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  avatar_key?: string
  role: 'user' | 'admin'
  selected_game_role?: string
  total_xp: number
  level: number
  current_room: string
  player_position_x: number
  player_position_y: number
  streak_count: number
  last_active_date?: string
  show_on_leaderboard: boolean
  created_at: string
  updated_at: string
}

export interface MuseumRoom {
  id: string
  name: string
  slug: string
  description?: string
  theme?: string
  map_key?: string
  background_image_url?: string
  icon?: string
  required_level: number
  reward_xp: number
  is_default_unlocked: boolean
  order_index: number
  created_at: string
}

export interface Artifact {
  id: string
  room_id?: string
  name: string
  slug: string
  category?: string
  origin_region?: string
  historical_period?: string
  discovery_location?: string
  current_location?: string
  material?: string
  main_function?: string
  description?: string
  cultural_value?: string
  interesting_facts?: string
  image_url?: string
  sprite_url?: string
  game_x: number
  game_y: number
  interaction_radius: number
  is_locked: boolean
  unlock_required_level: number
  is_mystery: boolean
  personality_tone?: string
  speaking_style?: string
  difficulty_level?: string
  first_greeting?: string
  completion_message?: string
  ai_persona_prompt?: string
  source_title?: string
  source_url?: string
  source_note?: string
  created_at: string
}

export interface MemoryFragment {
  id: string
  artifact_id: string
  title: string
  content: string
  unlock_condition?: string
  trigger_keywords?: string[]
  reward_xp: number
  order_index: number
}

export interface UserMemoryFragment {
  id: string
  user_id: string
  artifact_id: string
  fragment_id: string
  unlocked_at: string
}

export interface Chat {
  id: string
  user_id: string
  artifact_id: string
  title?: string
  created_at: string
}

export interface ChatMessage {
  id: string
  chat_id: string
  sender: 'user' | 'ai' | 'system'
  message: string
  created_at: string
}

export interface Quiz {
  id: string
  artifact_id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation?: string
  reward_xp: number
  order_index: number
}

export interface QuizResult {
  id: string
  user_id: string
  artifact_id: string
  score: number
  total_questions: number
  correct_answers: number
  earned_xp: number
  created_at: string
}

export interface Quest {
  id: string
  title: string
  description?: string
  quest_type?: string
  requirement_type?: string
  requirement_value?: string
  reward_xp: number
  required_level: number
  unlocks_room_id?: string
  unlocks_badge_id?: string
  is_main_quest: boolean
  order_index: number
}

export interface UserQuest {
  id: string
  user_id: string
  quest_id: string
  status: 'active' | 'completed' | 'claimed'
  progress: number
  completed_at?: string
  claimed_at?: string
}

export interface Badge {
  id: string
  name: string
  description?: string
  icon?: string
  condition_type?: string
  condition_value?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  reward_xp: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  unlocked_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  artifact_id: string
  status: 'discovered' | 'in_progress' | 'completed'
  chat_count: number
  inspected: boolean
  quiz_completed: boolean
  completed: boolean
  last_interacted_at?: string
}

export interface StoryChapter {
  id: string
  title: string
  description?: string
  order_index: number
  required_level: number
  reward_xp: number
}

export interface DailyMission {
  id: string
  title: string
  description?: string
  mission_type: string
  target_value: number
  reward_xp: number
}

export interface UserDailyMission {
  id: string
  user_id: string
  mission_id: string
  mission_date: string
  progress: number
  completed: boolean
  completed_at?: string
}

// Game-specific types
export interface GameArtifactObject {
  artifactId: string
  name: string
  x: number
  y: number
  interactionRadius: number
  isLocked: boolean
  isCompleted: boolean
  spriteKey?: string
}

export interface ChatRequest {
  artifactId: string
  message: string
  chatId?: string
  mode?: 'student' | 'teacher'
  explanationLevel?: 'sd' | 'smp' | 'sma' | 'umum' | 'akademik'
  activeQuestId?: string
}

export interface ChatResponse {
  aiMessage: string
  chatId: string
  unlockedFragments?: MemoryFragment[]
  earnedXp?: number
  completedQuest?: Quest
  unlockedBadge?: Badge
  levelUp?: boolean
  suggestedNextAction?: string
}

// Phaser-React event types
export type GameEvent =
  | { type: 'OPEN_ARTIFACT_DIALOG'; artifactId: string }
  | { type: 'OPEN_NARA_DIALOG' }
  | { type: 'GAIN_XP'; amount: number }
  | { type: 'COMPLETE_QUEST'; questId: string }
  | { type: 'UNLOCK_FRAGMENT'; fragmentId: string }
  | { type: 'OPEN_QUIZ'; artifactId: string }
  | { type: 'CHANGE_ROOM'; roomSlug: string }
