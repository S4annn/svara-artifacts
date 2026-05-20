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

// Positions are relative to the 800x600 game world.
// Adjust these when you change the background image.
const INTERACTABLES: Interactable[] = [
  { id: 'nara', type: 'npc', name: 'Nara', x: 600, y: 420, radius: 70, prompt: '[E] Bicara dengan Nara' },
  { id: 'keris-jawa', type: 'artifact', name: 'Keris Jawa', artifactId: 'keris-jawa', x: 200, y: 220, radius: 60, prompt: '[E] Bicara dengan Keris Jawa' },
  { id: 'candi-borobudur', type: 'artifact', name: 'Candi Borobudur', artifactId: 'candi-borobudur', x: 600, y: 220, radius: 60, prompt: '[E] Bicara dengan Candi Borobudur' },
  { id: 'patung-ganesha', type: 'artifact', name: 'Patung Ganesha', artifactId: 'patung-ganesha', x: 400, y: 160, radius: 60, prompt: '[E] Bicara dengan Patung Ganesha' },
  { id: 'angklung', type: 'artifact', name: 'Angklung', artifactId: 'angklung', x: 150, y: 360, radius: 55, prompt: '[E] Bicara dengan Angklung' },
  { id: 'topeng-cirebon', type: 'artifact', name: 'Topeng Cirebon', artifactId: 'topeng-cirebon', x: 650, y: 360, radius: 55, prompt: '[E] Bicara dengan Topeng Cirebon' },
]

// ─── COLLISION RECTANGLES ───
// Invisible walls/obstacles. Adjust to match your background layout.
const COLLISIONS = [
  // Outer walls
  { x: 400, y: 10, w: 800, h: 20 },   // top
  { x: 400, y: 590, w: 800, h: 20 },   // bottom
  { x: 10, y: 300, w: 20, h: 600 },    // left
  { x: 790, y: 300, w: 20, h: 600 },   // right
  // Central pedestal / statue
  { x: 400, y: 280, w: 60, h: 60 },
  // Left display cases
  { x: 150, y: 220, w: 50, h: 40 },
  { x: 150, y: 360, w: 50, h: 40 },
  // Right display cases
  { x: 650, y: 220, w: 50, h: 40 },
  { x: 650, y: 360, w: 50, h: 40 },
  // Top displays
  { x: 250, y: 120, w: 60, h: 30 },
  { x: 550, y: 120, w: 60, h: 30 },
]

// ─── DEBUG FLAG ───
const DEBUG_COLLISIONS = false

export class MuseumScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container
  private playerBody!: Phaser.Physics.Arcade.Body
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key }
  private speed = 140
  private colliders!: Phaser.Physics.Arcade.StaticGroup
  private activeInteractable: Interactable | null = null
  private promptContainer!: Phaser.GameObjects.Container
  private promptText!: Phaser.GameObjects.Text
  private onArtifactInteract?: (artifactId: string) => void
  private onNaraInteract?: () => void
  private joystickVelocity = { x: 0, y: 0 }
  private isPaused = false
  private sparkles: Phaser.GameObjects.Arc[] = []
  private naraSprite!: Phaser.GameObjects.Image
  private kerisSprite!: Phaser.GameObjects.Image

  // World dimensions
  private readonly WORLD_W = 800
  private readonly WORLD_H = 600

  constructor() {
    super({ key: 'MuseumScene' })
  }

  init(data: { onArtifactInteract?: (artifactId: string) => void; onNaraInteract?: () => void }) {
    this.onArtifactInteract = data.onArtifactInteract
    this.onNaraInteract = data.onNaraInteract
  }

  preload() {
    // Background
    this.load.image('museum-bg', '/assets/tilesets/museum-tileset.png')
    // Sprites
    this.load.image('player-sprite', '/sprites/player.png')
    this.load.image('nara-sprite', '/assets/sprites/npc/nara.png')
    this.load.image('keris-sprite', '/assets/sprites/artifacts/keris.png')
  }

  create() {
    const W = this.WORLD_W
    const H = this.WORLD_H

    // ═══════════════════════════════════════
    // STEP 1: Static museum background
    // ═══════════════════════════════════════
    const bg = this.add.image(W / 2, H / 2, 'museum-bg')
    bg.setDisplaySize(W, H)
    bg.setDepth(0)

    // ═══════════════════════════════════════
    // STEP 2: World bounds & camera
    // ═══════════════════════════════════════
    this.physics.world.setBounds(0, 0, W, H)
    this.cameras.main.setBounds(0, 0, W, H)
    this.cameras.main.setBackgroundColor(0x050f0b)

    // ═══════════════════════════════════════
    // STEP 3: Collision rectangles
    // ═══════════════════════════════════════
    this.colliders = this.physics.add.staticGroup()
    COLLISIONS.forEach((c) => {
      const rect = this.add.rectangle(c.x, c.y, c.w, c.h, 0xff0000, DEBUG_COLLISIONS ? 0.3 : 0)
      this.colliders.add(rect)
    })

    // ═══════════════════════════════════════
    // STEP 4: Artifact sparkle indicators
    // ═══════════════════════════════════════
    INTERACTABLES.forEach((item) => {
      if (item.type === 'artifact') {
        // Glow circle on ground
        const glow = this.add.circle(item.x, item.y + 10, 20, 0xd4af37, 0.06)
        glow.setDepth(1)
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.04, to: 0.12 },
          scale: { from: 0.9, to: 1.1 },
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })

        // Sparkle dot
        const sparkle = this.add.circle(item.x + 12, item.y - 20, 2.5, 0xd4af37, 0.8)
        sparkle.setDepth(100)
        this.tweens.add({
          targets: sparkle,
          alpha: { from: 0.9, to: 0.2 },
          scale: { from: 1, to: 0.4 },
          duration: 900,
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 500,
        })
        this.sparkles.push(sparkle)
      }
    })

    // ═══════════════════════════════════════
    // STEP 5: Keris sprite (artifact)
    // ═══════════════════════════════════════
    this.kerisSprite = this.add.image(200, 210, 'keris-sprite')
    this.kerisSprite.setDisplaySize(36, 36)
    this.kerisSprite.setDepth(210)

    // ═══════════════════════════════════════
    // STEP 6: NPC Nara
    // ═══════════════════════════════════════
    this.naraSprite = this.add.image(600, 410, 'nara-sprite')
    this.naraSprite.setDisplaySize(40, 40)
    this.naraSprite.setDepth(420)

    // Nara label
    this.add.text(600, 440, 'Nara', {
      fontSize: '9px', color: '#1F8A70', fontFamily: 'sans-serif',
    }).setOrigin(0.5).setDepth(440)

    // Nara chat bubble
    const naraBubble = this.add.text(600, 385, '💬', { fontSize: '14px' }).setOrigin(0.5).setDepth(500)
    this.tweens.add({
      targets: naraBubble,
      y: 381,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // ═══════════════════════════════════════
    // STEP 7: Player
    // ═══════════════════════════════════════
    this.player = this.add.container(W / 2, H - 120)

    // Player shadow
    const shadow = this.add.ellipse(0, 14, 22, 8, 0x000000, 0.3)
    // Player sprite
    const pSprite = this.add.image(0, 0, 'player-sprite')
    pSprite.setDisplaySize(34, 34)

    this.player.add([shadow, pSprite])
    this.player.setDepth(H - 120)

    this.physics.add.existing(this.player)
    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body
    this.playerBody.setSize(22, 14)
    this.playerBody.setOffset(-11, 2)
    this.playerBody.setCollideWorldBounds(true)

    // Player-wall collision
    this.physics.add.collider(this.player, this.colliders)

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)

    // ═══════════════════════════════════════
    // STEP 8: Lighting / vignette overlay
    // ═══════════════════════════════════════
    const vignette = this.add.graphics()
    vignette.setDepth(997)
    // Top/bottom dark bars
    vignette.fillStyle(0x000000, 0.25)
    vignette.fillRect(0, 0, W, 30)
    vignette.fillRect(0, H - 30, W, 30)
    // Side shadows
    vignette.fillStyle(0x000000, 0.15)
    vignette.fillRect(0, 0, 25, H)
    vignette.fillRect(W - 25, 0, 25, H)

    // Warm center glow
    const warmGlow = this.add.circle(W / 2, H / 2, 180, 0xd4af37, 0.015)
    warmGlow.setDepth(996)

    // ═══════════════════════════════════════
    // STEP 9: Dust particles
    // ═══════════════════════════════════════
    for (let i = 0; i < 15; i++) {
      const px = Phaser.Math.Between(40, W - 40)
      const py = Phaser.Math.Between(40, H - 40)
      const dot = this.add.circle(px, py, Phaser.Math.FloatBetween(0.8, 1.5), 0xd4af37, 0.3)
      dot.setDepth(995)
      this.tweens.add({
        targets: dot,
        x: px + Phaser.Math.Between(-15, 15),
        y: py + Phaser.Math.Between(-25, -5),
        alpha: { from: 0.3, to: 0 },
        duration: 4000 + Math.random() * 3000,
        repeat: -1,
        delay: Math.random() * 3000,
      })
    }

    // ═══════════════════════════════════════
    // STEP 10: Prompt UI
    // ═══════════════════════════════════════
    this.promptContainer = this.add.container(W / 2, H - 50)
    const promptBg = this.add.rectangle(0, 0, 220, 28, 0x071510, 0.9)
    promptBg.setStrokeStyle(1, 0xd4af37, 0.5)
    this.promptText = this.add.text(0, 0, '', {
      fontSize: '11px', color: '#D4AF37', fontFamily: 'sans-serif',
    }).setOrigin(0.5)
    this.promptContainer.add([promptBg, this.promptText])
    this.promptContainer.setDepth(1000)
    this.promptContainer.setVisible(false)
    this.promptContainer.setScrollFactor(0) // Fixed to camera

    // ═══════════════════════════════════════
    // STEP 11: Input
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

    // ═══════════════════════════════════════
    // STEP 12: Joystick events
    // ═══════════════════════════════════════
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

  // ─── UPDATE LOOP ───
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

    // Joystick override
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

    // Depth sort player
    this.player.setDepth(this.player.y + 14)

    // Check proximity to interactables
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

    // Update prompt
    if (closest) {
      this.promptText.setText(closest.prompt)
      this.promptContainer.setVisible(true)
    } else {
      this.promptContainer.setVisible(false)
    }
  }
}
