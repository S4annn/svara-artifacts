import Phaser from 'phaser'
import { gameEvents, GAME_EVENTS } from './events'

// ─── INTERACTABLE DEFINITIONS ───
interface Interactable {
  id: string
  type: 'artifact' | 'npc'
  name: string
  artifactId?: string
  x: number
  y: number
  radius: number
  prompt: string
}

// Positions relative to the 1448x1086 world.
// Adjust these to match where artifacts appear in your museum-hall.png
const INTERACTABLES: Interactable[] = [
  { id: 'nara', type: 'npc', name: 'Nara', x: 900, y: 750, radius: 90, prompt: '[E] Bicara dengan Nara' },
  { id: 'keris-jawa', type: 'artifact', name: 'Keris Jawa', artifactId: 'keris-jawa', x: 350, y: 400, radius: 80, prompt: '[E] Bicara dengan Keris Jawa' },
  { id: 'candi-borobudur', type: 'artifact', name: 'Candi Borobudur', artifactId: 'candi-borobudur', x: 1100, y: 400, radius: 80, prompt: '[E] Bicara dengan Candi Borobudur' },
  { id: 'patung-ganesha', type: 'artifact', name: 'Patung Ganesha', artifactId: 'patung-ganesha', x: 724, y: 300, radius: 80, prompt: '[E] Bicara dengan Patung Ganesha' },
  { id: 'angklung', type: 'artifact', name: 'Angklung', artifactId: 'angklung', x: 300, y: 650, radius: 75, prompt: '[E] Bicara dengan Angklung' },
  { id: 'topeng-cirebon', type: 'artifact', name: 'Topeng Cirebon', artifactId: 'topeng-cirebon', x: 1150, y: 650, radius: 75, prompt: '[E] Bicara dengan Topeng Cirebon' },
]

// ─── COLLISION RECTANGLES ───
// Invisible walls. Adjust to match your museum-hall.png layout.
const COLLISIONS = [
  // Outer walls
  { x: 724, y: 15, w: 1448, h: 30 },    // top
  { x: 724, y: 1071, w: 1448, h: 30 },   // bottom
  { x: 15, y: 543, w: 30, h: 1086 },     // left
  { x: 1433, y: 543, w: 30, h: 1086 },   // right
  // Central display / statue
  { x: 724, y: 500, w: 100, h: 80 },
  // Left display cases
  { x: 300, y: 400, w: 80, h: 60 },
  { x: 300, y: 650, w: 80, h: 60 },
  // Right display cases
  { x: 1150, y: 400, w: 80, h: 60 },
  { x: 1150, y: 650, w: 80, h: 60 },
  // Top row displays
  { x: 450, y: 200, w: 90, h: 50 },
  { x: 724, y: 200, w: 90, h: 50 },
  { x: 1000, y: 200, w: 90, h: 50 },
]

const DEBUG_COLLISIONS = false

export class MuseumScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container
  private playerBody!: Phaser.Physics.Arcade.Body
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key }
  private speed = 200
  private colliders!: Phaser.Physics.Arcade.StaticGroup
  private activeInteractable: Interactable | null = null
  private promptContainer!: Phaser.GameObjects.Container
  private promptText!: Phaser.GameObjects.Text
  private onArtifactInteract?: (artifactId: string) => void
  private onNaraInteract?: () => void
  private joystickVelocity = { x: 0, y: 0 }
  private isPaused = false

  private readonly WORLD_W = 1448
  private readonly WORLD_H = 1086

  constructor() {
    super({ key: 'MuseumScene' })
  }

  init(data: { onArtifactInteract?: (artifactId: string) => void; onNaraInteract?: () => void }) {
    this.onArtifactInteract = data.onArtifactInteract
    this.onNaraInteract = data.onNaraInteract
  }

  preload() {
    this.load.image('museum-hall', '/assets/maps/museum-hall.png')
    // Player sprite sheets: 4 cols x 4 rows, 320x320 per frame (1280x1280 total)
    this.load.spritesheet('player-idle', '/sprites/player-idle.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet('player-walk', '/sprites/player-walk.png', { frameWidth: 320, frameHeight: 320 })
    // NPC Nara sprite sheets: same format
    this.load.spritesheet('nara-idle', '/assets/sprites/npc/nara-idle.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet('nara-walk', '/assets/sprites/npc/nara-walk.png', { frameWidth: 320, frameHeight: 320 })
  }

  create() {
    const W = this.WORLD_W
    const H = this.WORLD_H

    // ═══════════════════════════════════════
    // BACKGROUND — full museum hall
    // ═══════════════════════════════════════
    const bg = this.add.image(W / 2, H / 2, 'museum-hall')
    bg.setDisplaySize(W, H)
    bg.setDepth(0)

    // ═══════════════════════════════════════
    // WORLD & CAMERA
    // ═══════════════════════════════════════
    this.physics.world.setBounds(0, 0, W, H)
    this.cameras.main.setBounds(0, 0, W, H)
    this.cameras.main.setBackgroundColor(0x050f0b)
    this.cameras.main.setZoom(1)

    // ═══════════════════════════════════════
    // COLLISIONS
    // ═══════════════════════════════════════
    this.colliders = this.physics.add.staticGroup()
    COLLISIONS.forEach((c) => {
      const rect = this.add.rectangle(c.x, c.y, c.w, c.h, 0xff0000, DEBUG_COLLISIONS ? 0.3 : 0)
      this.colliders.add(rect)
    })

    // ═══════════════════════════════════════
    // ARTIFACT INDICATORS (glow + sparkle)
    // ═══════════════════════════════════════
    INTERACTABLES.forEach((item) => {
      if (item.type === 'artifact') {
        // Ground glow
        const glow = this.add.circle(item.x, item.y + 20, 35, 0xd4af37, 0.05)
        glow.setDepth(1)
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.04, to: 0.14 },
          scale: { from: 0.9, to: 1.15 },
          duration: 2200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
        // Sparkle
        const sparkle = this.add.circle(item.x + 18, item.y - 30, 3, 0xd4af37, 0.8)
        sparkle.setDepth(900)
        this.tweens.add({
          targets: sparkle,
          alpha: { from: 0.9, to: 0.15 },
          scale: { from: 1, to: 0.3 },
          duration: 1000,
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 600,
        })
      }
    })

    // ═══════════════════════════════════════
    // KERIS SPRITE (removed - using glow indicator only)
    // ═══════════════════════════════════════

    // ═══════════════════════════════════════
    // NPC NARA (single frame, facing down)
    // ═══════════════════════════════════════
    const naraSprite = this.add.sprite(900, 730, 'nara-idle', 0)
    naraSprite.setDisplaySize(120, 120)
    naraSprite.setDepth(730)
    // Don't animate — just show frame 0 (facing down, idle)

    // Nara shadow
    this.add.ellipse(900, 790, 40, 12, 0x000000, 0.3).setDepth(729)

    // Nara name
    this.add.text(900, 800, 'Nara', {
      fontSize: '13px', color: '#1F8A70', fontFamily: 'sans-serif', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(801)

    // Nara bubble
    const bubble = this.add.text(900, 660, '💬', { fontSize: '20px' }).setOrigin(0.5).setDepth(900)
    this.tweens.add({
      targets: bubble,
      y: 655,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // ═══════════════════════════════════════
    // PLAYER (using real idle/walk sprite sheets)
    // ═══════════════════════════════════════
    // Idle animations — single frame per direction (like Stardew Valley standing still)
    this.anims.create({ key: 'idle-down', frames: [{ key: 'player-idle', frame: 0 }], frameRate: 1, repeat: 0 })
    this.anims.create({ key: 'idle-left', frames: [{ key: 'player-idle', frame: 4 }], frameRate: 1, repeat: 0 })
    this.anims.create({ key: 'idle-right', frames: [{ key: 'player-idle', frame: 8 }], frameRate: 1, repeat: 0 })
    this.anims.create({ key: 'idle-up', frames: [{ key: 'player-idle', frame: 12 }], frameRate: 1, repeat: 0 })

    // Walk animations — cycle through 4 frames per direction
    this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 3 }), frameRate: 8, repeat: -1 })
    this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('player-walk', { start: 4, end: 7 }), frameRate: 8, repeat: -1 })
    this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('player-walk', { start: 8, end: 11 }), frameRate: 8, repeat: -1 })
    this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('player-walk', { start: 12, end: 15 }), frameRate: 8, repeat: -1 })

    // Player sprite directly (no container — more reliable physics)
    const playerSprite = this.physics.add.sprite(W / 2, H - 200, 'player-idle', 0)
    playerSprite.setDisplaySize(120, 120)
    playerSprite.play('idle-down')
    playerSprite.setDepth(H - 200)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = playerSprite.body as any
    body.setSize(80, 40)
    body.setOffset(120, 230)
    body.setCollideWorldBounds(true)

    // Player shadow (separate, follows player in update)
    const playerShadow = this.add.ellipse(W / 2, H - 160, 40, 12, 0x000000, 0.3)
    playerShadow.setDepth(1)

    // Store as class property
    this.player = playerSprite as unknown as Phaser.GameObjects.Container
    this.playerBody = body
    // Store shadow reference on the sprite
    ;(playerSprite as unknown as { shadow: Phaser.GameObjects.Ellipse }).shadow = playerShadow

    // Collisions
    this.physics.add.collider(playerSprite, this.colliders)

    // Camera follow (smooth)
    this.cameras.main.startFollow(playerSprite, true, 0.08, 0.08)

    // ═══════════════════════════════════════
    // LIGHTING / VIGNETTE
    // ═══════════════════════════════════════
    const vig = this.add.graphics().setDepth(995).setScrollFactor(0)
    vig.fillStyle(0x000000, 0.3)
    vig.fillRect(0, 0, 800, 25)
    vig.fillRect(0, 575, 800, 25)
    vig.fillStyle(0x000000, 0.2)
    vig.fillRect(0, 0, 20, 600)
    vig.fillRect(780, 0, 20, 600)

    // ═══════════════════════════════════════
    // DUST PARTICLES
    // ═══════════════════════════════════════
    for (let i = 0; i < 20; i++) {
      const px = Phaser.Math.Between(60, W - 60)
      const py = Phaser.Math.Between(60, H - 60)
      const dot = this.add.circle(px, py, Phaser.Math.FloatBetween(1, 2), 0xd4af37, 0.25)
      dot.setDepth(994)
      this.tweens.add({
        targets: dot,
        x: px + Phaser.Math.Between(-20, 20),
        y: py + Phaser.Math.Between(-40, -10),
        alpha: { from: 0.25, to: 0 },
        duration: 5000 + Math.random() * 4000,
        repeat: -1,
        delay: Math.random() * 4000,
      })
    }

    // ═══════════════════════════════════════
    // PROMPT UI (fixed to camera)
    // ═══════════════════════════════════════
    this.promptContainer = this.add.container(400, 560)
    this.promptContainer.setScrollFactor(0)
    const promptBg = this.add.rectangle(0, 0, 260, 32, 0x071510, 0.92)
    promptBg.setStrokeStyle(1.5, 0xd4af37, 0.6)
    this.promptText = this.add.text(0, 0, '', {
      fontSize: '12px', color: '#D4AF37', fontFamily: 'sans-serif',
    }).setOrigin(0.5)
    this.promptContainer.add([promptBg, this.promptText])
    this.promptContainer.setDepth(1000)
    this.promptContainer.setVisible(false)

    // ═══════════════════════════════════════
    // INPUT
    // ═══════════════════════════════════════
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.input.keyboard!.on('keydown-E', () => this.handleInteract())
    this.input.keyboard!.on('keydown-SPACE', () => this.handleInteract())

    // Joystick
    gameEvents.on(GAME_EVENTS.JOYSTICK_MOVE, (data: unknown) => {
      const { x, y } = data as { x: number; y: number }
      this.joystickVelocity = { x, y }
    })
    gameEvents.on(GAME_EVENTS.JOYSTICK_STOP, () => {
      this.joystickVelocity = { x: 0, y: 0 }
    })
  }

  // ─── INTERACTION ───
  private handleInteract() {
    if (this.isPaused || !this.activeInteractable) return

    const item = this.activeInteractable
    if (item.type === 'artifact' && item.artifactId && this.onArtifactInteract) {
      this.onArtifactInteract(item.artifactId)
    } else if (item.type === 'npc' && this.onNaraInteract) {
      this.onNaraInteract()
    }

    this.isPaused = true
    const resume = () => {
      this.isPaused = false
      gameEvents.off(GAME_EVENTS.CLOSE_DIALOG, resume)
    }
    gameEvents.on(GAME_EVENTS.CLOSE_DIALOG, resume)
  }

  // ─── UPDATE ───
  update() {
    if (this.isPaused) {
      this.playerBody.setVelocity(0)
      return
    }

    // Movement
    let vx = 0
    let vy = 0
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -1
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -1
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 1

    if (this.joystickVelocity.x !== 0 || this.joystickVelocity.y !== 0) {
      vx = this.joystickVelocity.x
      vy = this.joystickVelocity.y
    }

    const len = Math.sqrt(vx * vx + vy * vy)
    if (len > 0) {
      this.playerBody.setVelocity((vx / len) * this.speed, (vy / len) * this.speed)
    } else {
      this.playerBody.setVelocity(0, 0)
    }

    // Player animation
    const sprite = this.player as unknown as Phaser.GameObjects.Sprite
    if (sprite && sprite.play) {
      if (len > 0) {
        if (Math.abs(vx) > Math.abs(vy)) {
          sprite.play(vx < 0 ? 'walk-left' : 'walk-right', true)
        } else {
          sprite.play(vy < 0 ? 'walk-up' : 'walk-down', true)
        }
      } else {
        const currentAnim = sprite.anims?.currentAnim?.key || 'walk-down'
        const dir = currentAnim.replace('walk-', '').replace('idle-', '')
        sprite.play('idle-' + dir, true)
      }
    }

    // Update shadow position
    const shadowRef = (sprite as unknown as { shadow?: Phaser.GameObjects.Ellipse }).shadow
    if (shadowRef) {
      shadowRef.setPosition(this.player.x, this.player.y + 35)
      shadowRef.setDepth(this.player.y + 27)
    }

    // Depth sort
    this.player.setDepth(this.player.y + 28)

    // Proximity check
    let closest: Interactable | null = null
    let closestDist = Infinity
    for (const item of INTERACTABLES) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y)
      if (dist < item.radius && dist < closestDist) {
        closest = item
        closestDist = dist
      }
    }
    this.activeInteractable = closest

    if (closest) {
      this.promptText.setText(closest.prompt)
      this.promptContainer.setVisible(true)
    } else {
      this.promptContainer.setVisible(false)
    }
  }
}
