import { create } from 'zustand'

interface Notification {
  id: string
  type: 'xp' | 'badge' | 'fragment' | 'level' | 'room' | 'quest'
  value: string
}

interface GameState {
  // Player
  playerName: string
  level: number
  totalXp: number
  currentRoom: string
  selectedRole: string | null
  avatarKey: string | null

  // Progress
  xpForNextLevel: number
  questActive: string | null
  questProgress: number
  questMax: number

  // UI state
  dialogueOpen: boolean
  currentArtifactId: string | null
  quizOpen: boolean
  notifications: Notification[]
  naraDialogueOpen: boolean
  naraMessage: string | null
  isPaused: boolean

  // Actions
  setPlayer: (data: Partial<Pick<GameState, 'playerName' | 'level' | 'totalXp' | 'currentRoom' | 'selectedRole' | 'avatarKey'>>) => void
  addXp: (amount: number) => void
  openDialogue: (artifactId: string) => void
  closeDialogue: () => void
  openQuiz: () => void
  closeQuiz: () => void
  showNara: (message: string) => void
  hideNara: () => void
  pushNotification: (type: Notification['type'], value: string) => void
  removeNotification: (id: string) => void
  setQuest: (title: string, progress: number, max: number) => void
  setPaused: (paused: boolean) => void
}

const XP_THRESHOLDS = [0, 100, 250, 500, 850, 1300]

function getXpForNextLevel(level: number): number {
  return XP_THRESHOLDS[level] || 2000
}

function calculateLevel(xp: number): number {
  if (xp >= 1300) return 6
  if (xp >= 850) return 5
  if (xp >= 500) return 4
  if (xp >= 250) return 3
  if (xp >= 100) return 2
  return 1
}

export const useGameStore = create<GameState>((set, get) => ({
  // Player defaults
  playerName: 'Relic Keeper',
  level: 1,
  totalXp: 0,
  currentRoom: 'lobby',
  selectedRole: null,
  avatarKey: null,

  // Progress
  xpForNextLevel: 100,
  questActive: 'Bicara dengan Keris Jawa',
  questProgress: 0,
  questMax: 1,

  // UI state
  dialogueOpen: false,
  currentArtifactId: null,
  quizOpen: false,
  notifications: [],
  naraDialogueOpen: false,
  naraMessage: null,
  isPaused: false,

  // Actions
  setPlayer: (data) => set((state) => ({
    ...state,
    ...data,
    xpForNextLevel: getXpForNextLevel(data.level ?? state.level),
  })),

  addXp: (amount) => {
    const state = get()
    const newXp = state.totalXp + amount
    const newLevel = calculateLevel(newXp)
    const leveled = newLevel > state.level

    set({
      totalXp: newXp,
      level: newLevel,
      xpForNextLevel: getXpForNextLevel(newLevel),
    })

    // Auto-push notifications
    get().pushNotification('xp', `+${amount} XP`)
    if (leveled) {
      get().pushNotification('level', `Level Up! Lv.${newLevel}`)
    }
  },

  openDialogue: (artifactId) => set({ dialogueOpen: true, currentArtifactId: artifactId, isPaused: true }),
  closeDialogue: () => set({ dialogueOpen: false, currentArtifactId: null, isPaused: false }),
  openQuiz: () => set({ quizOpen: true, isPaused: true }),
  closeQuiz: () => set({ quizOpen: false, isPaused: false }),
  showNara: (message) => set({ naraDialogueOpen: true, naraMessage: message, isPaused: true }),
  hideNara: () => set({ naraDialogueOpen: false, naraMessage: null, isPaused: false }),

  pushNotification: (type, value) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    set((state) => ({
      notifications: [...state.notifications, { id, type, value }],
    }))
    // Auto-remove after 3s
    setTimeout(() => get().removeNotification(id), 3000)
  },

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  setQuest: (title, progress, max) => set({ questActive: title, questProgress: progress, questMax: max }),
  setPaused: (paused) => set({ isPaused: paused }),
}))
