// Event bridge between Phaser game and React UI
type EventCallback = (...args: unknown[]) => void

class GameEventBus {
  private listeners: Map<string, EventCallback[]> = new Map()

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: EventCallback) {
    const cbs = this.listeners.get(event)
    if (cbs) {
      this.listeners.set(event, cbs.filter((cb) => cb !== callback))
    }
  }

  emit(event: string, ...args: unknown[]) {
    const cbs = this.listeners.get(event)
    if (cbs) {
      cbs.forEach((cb) => cb(...args))
    }
  }
}

// Singleton instance
export const gameEvents = new GameEventBus()

// Event names
export const GAME_EVENTS = {
  // Phaser -> React
  OPEN_ARTIFACT_DIALOG: 'open_artifact_dialog',
  OPEN_NARA_DIALOG: 'open_nara_dialog',
  PLAYER_NEAR_ARTIFACT: 'player_near_artifact',
  PLAYER_LEFT_ARTIFACT: 'player_left_artifact',
  ROOM_ENTERED: 'room_entered',

  // React -> Phaser
  CLOSE_DIALOG: 'close_dialog',
  TELEPORT_PLAYER: 'teleport_player',
  CHANGE_ROOM: 'change_room',
  UPDATE_ARTIFACT_STATUS: 'update_artifact_status',

  // Joystick
  JOYSTICK_MOVE: 'joystick_move',
  JOYSTICK_STOP: 'joystick_stop',
} as const
