import Phaser from 'phaser'
import { gameEvents, GAME_EVENTS } from './events'

interface ArtifactDef {
  id: string
  name: string
  x: number
  y: number
  color: number
  glowColor: number
}

const ARTIFACTS: ArtifactDef[] = [
  { id: 'keris-jawa', name: 'Keris Jawa', x: 200, y: 200, color: 0xd4af37, glowColor: 0xd4af37 },
  { id: 'candi-borobudur', name: 'Candi Borobudur', x: 600, y: 200, color: 0xa97142, glowColor: 0xa97142 },
  { id: 'patung-ganesha', name: 'Patung Ganesha', x: 400, y: 150, color: 0x1f8a70, glowColor: 0x1f8a70 },
]

export class MuseumScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container
  private playerBody!: Phaser.Physics.Arcade.Body
  private playerShadow!: Phaser.GameObjects.Ellipse
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key }
  private speed = 140
  private walls!: Phaser.Physics.Arcade.StaticGroup
  private obstacles!: Phaser.Physics.Arcade.StaticGroup
  private artifactObjects: { def: ArtifactDef; container: Phaser.GameObjects.Container; indicator: Phaser.GameObjects.Container }[] = []
  private nearestArtifact: ArtifactDef | null = null
  private promptContainer!: Phaser.GameObjects.Container
  private promptText!: Phaser.GameObjects.Text
  private onArtifactInteract?: (artifactId: string) => void
  private joystickVelocity = { x: 0, y: 0 }
  private nara!: Phaser.GameObjects.Container
  private naraNearby = false
  private onNaraInteract?: () => void
  private isPaused = false
  private depthSortables: Phaser.GameObjects.Container[] = []
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter

  constructor() {
    super({ key: 'MuseumScene' })
  }

  init(data: { onArtifactInteract?: (artifactId: string) => void; onNaraInteract?: () => void }) {
    this.onArtifactInteract = data.onArtifactInteract
    this.onNaraInteract = data.onNaraInteract
  }

  preload() {
    this.load.image('player-sprite', '/sprites/player.png')
  }

  create() {
    const W = 800
    const H = 500

    this.artifactObjects = []
    this.depthSortables = []

    // === GROUND LAYER ===
    this.createFloor(W, H)

    // === WALL LAYER ===
    this.walls = this.physics.add.staticGroup()
    this.obstacles = this.physics.add.staticGroup()
    this.createWalls(W, H)

    // === DECORATION LAYER (below player) ===
    this.createDecorations(W, H)

    // === ARTIFACTS ===
    ARTIFACTS.forEach((def) => this.createArtifact(def))

    // === NPC NARA ===
    this.createNara(680, 380)

    // === PLAYER ===
    this.createPlayer(W / 2, H - 100)

    // === ABOVE LAYER (pillars tops, banners) ===
    this.createAboveLayer(W, H)

    // === LIGHTING OVERLAY ===
    this.createLighting(W, H)

    // === PARTICLES (fireflies/dust) ===
    this.createParticles(W, H)

    // === PROMPT UI ===
    this.createPromptUI(W, H)

    // === INPUT ===
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.input.keyboard!.on('keydown-E', () => this.handleInteract())
    this.input.keyboard!.on('keydown-SPACE', () => this.handleInteract())

    // === JOYSTICK EVENTS ===
    gameEvents.on(GAME_EVENTS.JOYSTICK_MOVE, (data: unknown) => {
      const { x, y } = data as { x: number; y: number }
      this.joystickVelocity = { x, y }
    })
    gameEvents.on(GAME_EVENTS.JOYSTICK_STOP, () => {
      this.joystickVelocity = { x: 0, y: 0 }
    })

    // === COLLISIONS ===
    this.physics.add.collider(this.player, this.walls)
    this.physics.add.collider(this.player, this.obstacles)

    // === CAMERA ===
    this.cameras.main.setBackgroundColor(0x050f0b)
    this.cameras.main.setBounds(0, 0, W, H)
  }

  // ─── FLOOR ───
  private createFloor(W: number, H: number) {
    // Base floor
    this.add.rectangle(W / 2, H / 2, W, H, 0x0c1a14).setDepth(0)

    // Stone tile pattern
    const tileSize = 40
    for (let x = 0; x < W; x += tileSize) {
      for (let y = 0; y < H; y += tileSize) {
        const shade = Phaser.Math.Between(12, 20)
        const color = Phaser.Display.Color.GetColor(shade, shade + 12, shade + 6)
        const tile = this.add.rectangle(x + tileSize / 2, y + tileSize / 2, tileSize - 1, tileSize - 1, color)
        tile.setAlpha(0.7).setDepth(0)
      }
    }

    // Central carpet (warm red-brown)
    const carpetW = 140
    this.add.rectangle(W / 2, H / 2, carpetW, H - 100, 0x3d1f1f).setAlpha(0.5).setDepth(1)
    // Carpet border
    this.add.rectangle(W / 2 - carpetW / 2 + 2, H / 2, 4, H - 100, 0xd4af37).setAlpha(0.3).setDepth(1)
    this.add.rectangle(W / 2 + carpetW / 2 - 2, H / 2, 4, H - 100, 0xd4af37).setAlpha(0.3).setDepth(1)

    // Carpet fringe top/bottom
    this.add.rectangle(W / 2, 55, carpetW, 6, 0xd4af37).setAlpha(0.2).setDepth(1)
    this.add.rectangle(W / 2, H - 55, carpetW, 6, 0xd4af37).setAlpha(0.2).setDepth(1)
  }

  // ─── WALLS ───
  private createWalls(W: number, H: number) {
    const wallThickness = 28
    const wallColor = 0x1a3328

    // Top wall (thick, with molding)
    const tw = this.add.rectangle(W / 2, wallThickness / 2, W, wallThickness, wallColor).setDepth(2)
    this.walls.add(tw)
    // Molding
    this.add.rectangle(W / 2, wallThickness, W, 4, 0x2a4a3a).setDepth(2)
    this.add.rectangle(W / 2, wallThickness + 4, W, 2, 0xd4af37).setAlpha(0.3).setDepth(2)

    // Bottom wall
    const bw = this.add.rectangle(W / 2, H - wallThickness / 2, W, wallThickness, wallColor).setDepth(2)
    this.walls.add(bw)
    this.add.rectangle(W / 2, H - wallThickness, W, 4, 0x2a4a3a).setDepth(2)

    // Left wall
    const lw = this.add.rectangle(wallThickness / 2, H / 2, wallThickness, H, wallColor).setDepth(2)
    this.walls.add(lw)
    this.add.rectangle(wallThickness, H / 2, 3, H, 0x2a4a3a).setDepth(2)

    // Right wall
    const rw = this.add.rectangle(W - wallThickness / 2, H / 2, wallThickness, H, wallColor).setDepth(2)
    this.walls.add(rw)
    this.add.rectangle(W - wallThickness, H / 2, 3, H, 0x2a4a3a).setDepth(2)

    // Room title banner on top wall
    this.add.rectangle(W / 2, 18, 200, 20, 0x0d1f18).setAlpha(0.8).setDepth(3)
    this.add.text(W / 2, 18, 'Hall of Awakening', {
      fontSize: '11px', color: '#D4AF37', fontFamily: 'sans-serif', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(3)
  }

  // ─── DECORATIONS ───
  private createDecorations(W: number, H: number) {
    // Pillars (left side)
    this.createPillar(60, 120)
    this.createPillar(60, 320)
    // Pillars (right side)
    this.createPillar(W - 60, 120)
    this.createPillar(W - 60, 320)

    // Wall lamps
    this.createWallLamp(150, 36)
    this.createWallLamp(400, 36)
    this.createWallLamp(650, 36)

    // Plants
    this.createPlant(90, 440)
    this.createPlant(W - 90, 440)
    this.createPlant(90, 80)
    this.createPlant(W - 90, 80)

    // Display cases (side tables)
    this.createDisplayCase(120, 250)
    this.createDisplayCase(W - 120, 250)

    // Door at bottom
    this.add.rectangle(W / 2, H - 16, 60, 12, 0x2b1b12).setDepth(2)
    this.add.rectangle(W / 2, H - 22, 50, 4, 0xd4af37).setAlpha(0.4).setDepth(2)
  }

  private createPillar(x: number, y: number) {
    // Pillar base
    const base = this.add.rectangle(x, y + 20, 28, 10, 0x2a4a3a).setDepth(y + 20)
    // Pillar body
    const body = this.add.rectangle(x, y, 20, 50, 0x1a3328).setDepth(y)
    // Pillar top
    this.add.rectangle(x, y - 25, 26, 8, 0x2a4a3a).setDepth(y - 25)
    // Add collision
    const collider = this.add.rectangle(x, y + 10, 24, 20, 0x000000, 0)
    this.obstacles.add(collider)
  }

  private createWallLamp(x: number, y: number) {
    // Lamp bracket
    this.add.rectangle(x, y, 6, 12, 0x3d2b1b).setDepth(3)
    // Flame glow
    const glow = this.add.circle(x, y + 8, 12, 0xd4af37, 0.08).setDepth(3)
    const flame = this.add.circle(x, y + 6, 3, 0xd4af37).setDepth(3)
    this.tweens.add({
      targets: [flame, glow],
      alpha: { from: 0.8, to: 0.4 },
      scale: { from: 1, to: 0.8 },
      duration: 600 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
    })
  }

  private createPlant(x: number, y: number) {
    // Pot
    this.add.rectangle(x, y + 6, 14, 12, 0x3d2b1b).setDepth(y + 6)
    // Leaves
    this.add.circle(x - 4, y - 4, 6, 0x1a5c3a).setDepth(y - 4)
    this.add.circle(x + 4, y - 6, 5, 0x1f8a70).setAlpha(0.8).setDepth(y - 6)
    this.add.circle(x, y - 8, 4, 0x2a7a5a).setDepth(y - 8)
  }

  private createDisplayCase(x: number, y: number) {
    // Glass case shadow
    this.add.ellipse(x, y + 18, 44, 10, 0x000000, 0.2).setDepth(y + 18)
    // Case body
    this.add.rectangle(x, y, 40, 30, 0x1a2a22).setDepth(y)
    this.add.rectangle(x, y - 2, 36, 26, 0x0d1f18).setAlpha(0.6).setDepth(y)
    // Glass top highlight
    this.add.rectangle(x, y - 12, 30, 2, 0x4a8a7a).setAlpha(0.3).setDepth(y)
    // Collision
    const col = this.add.rectangle(x, y + 5, 40, 20, 0x000000, 0)
    this.obstacles.add(col)
  }

  // ─── ARTIFACTS ───
  private createArtifact(def: ArtifactDef) {
    const container = this.add.container(def.x, def.y)

    // Ground glow circle
    const groundGlow = this.add.circle(0, 16, 24, def.glowColor, 0.06)

    // Pedestal
    const pedestalBase = this.add.rectangle(0, 14, 44, 8, 0x2a1a12)
    const pedestalBody = this.add.rectangle(0, 6, 36, 16, 0x1f1510)
    const pedestalTop = this.add.rectangle(0, -2, 40, 4, 0x3d2b1b)

    // Artifact shape (stylized)
    const artifactShape = this.add.rectangle(0, -14, 12, 20, def.color)
    artifactShape.setAlpha(0.9)

    // Sparkle indicator
    const sparkle = this.add.circle(14, -22, 3, def.glowColor)

    // Label background
    const labelBg = this.add.rectangle(0, 30, def.name.length * 5.5 + 12, 14, 0x071510, 0.8)
    const label = this.add.text(0, 30, def.name, {
      fontSize: '9px', color: '#F8F1E7', fontFamily: 'sans-serif',
    }).setOrigin(0.5)

    container.add([groundGlow, pedestalBase, pedestalBody, pedestalTop, artifactShape, sparkle, labelBg, label])
    container.setDepth(def.y + 14)

    // Glow animation
    this.tweens.add({
      targets: groundGlow,
      alpha: { from: 0.06, to: 0.15 },
      scale: { from: 1, to: 1.1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Sparkle animation
    this.tweens.add({
      targets: sparkle,
      alpha: { from: 1, to: 0.2 },
      scale: { from: 1, to: 0.5 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    })

    // Floating indicator (shows when near)
    const indicator = this.add.container(def.x, def.y - 40)
    const indBg = this.add.rectangle(0, 0, 20, 20, 0x071510, 0.8)
    indBg.setStrokeStyle(1, def.glowColor, 0.6)
    const indText = this.add.text(0, 0, 'E', {
      fontSize: '10px', color: '#D4AF37', fontFamily: 'sans-serif', fontStyle: 'bold',
    }).setOrigin(0.5)
    indicator.add([indBg, indText])
    indicator.setDepth(1000)
    indicator.setVisible(false)
    indicator.setAlpha(0)

    this.tweens.add({
      targets: indicator,
      y: def.y - 44,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.artifactObjects.push({ def, container, indicator })
  }

  // ─── NPC NARA ───
  private createNara(x: number, y: number) {
    this.nara = this.add.container(x, y)

    // Shadow
    const shadow = this.add.ellipse(0, 14, 22, 8, 0x000000, 0.3)
    // Body
    const body = this.add.rectangle(0, 2, 16, 22, 0x1a5c3a)
    // Head
    const head = this.add.circle(0, -12, 9, 0x2a8a6a)
    // Eyes
    this.add.circle(-3, -13, 2, 0xffffff)
    this.add.circle(3, -13, 2, 0xffffff)
    this.add.circle(-3, -13, 1, 0x071510)
    this.add.circle(3, -13, 1, 0x071510)
    // Label
    const label = this.add.text(0, 22, 'Nara', { fontSize: '9px', color: '#1F8A70', fontFamily: 'sans-serif' }).setOrigin(0.5)
    // Chat bubble
    const bubble = this.add.container(0, -30)
    const bubbleBg = this.add.rectangle(0, 0, 18, 16, 0x0d1f18, 0.9)
    bubbleBg.setStrokeStyle(1, 0x1f8a70, 0.5)
    const bubbleText = this.add.text(0, 0, '?', { fontSize: '10px', color: '#1F8A70', fontFamily: 'sans-serif', fontStyle: 'bold' }).setOrigin(0.5)
    bubble.add([bubbleBg, bubbleText])

    this.nara.add([shadow, body, head, label, bubble])
    this.nara.setDepth(y + 14)
    this.depthSortables.push(this.nara)

    // Idle animation
    this.tweens.add({
      targets: bubble,
      y: -34,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  // ─── PLAYER ───
  private createPlayer(x: number, y: number) {
    this.player = this.add.container(x, y)

    // Shadow
    this.playerShadow = this.add.ellipse(0, 14, 20, 8, 0x000000, 0.3)

    // Player sprite
    const sprite = this.add.image(0, 0, 'player-sprite')
    sprite.setDisplaySize(30, 30)

    this.player.add([this.playerShadow, sprite])
    this.player.setDepth(y)

    this.physics.add.existing(this.player)
    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body
    this.playerBody.setSize(20, 16)
    this.playerBody.setOffset(-10, -2)
    this.playerBody.setCollideWorldBounds(true)

    this.depthSortables.push(this.player)
  }

  // ─── ABOVE LAYER ───
  private createAboveLayer(W: number, _H: number) {
    // Pillar tops that render above player
    // (already handled by depth sorting)

    // Top wall shadow
    this.add.rectangle(W / 2, 38, W, 12, 0x000000, 0.15).setDepth(999)
  }

  // ─── LIGHTING ───
  private createLighting(W: number, H: number) {
    // Vignette effect (dark edges)
    const vignette = this.add.graphics()
    vignette.setDepth(998)
    vignette.fillStyle(0x000000, 0.3)
    vignette.fillRect(0, 0, W, 20)
    vignette.fillRect(0, H - 20, W, 20)
    vignette.fillRect(0, 0, 20, H)
    vignette.fillRect(W - 20, 0, 20, H)

    // Warm center light
    const light = this.add.circle(W / 2, H / 2, 200, 0xd4af37, 0.02)
    light.setDepth(997)
  }

  // ─── PARTICLES ───
  private createParticles(W: number, H: number) {
    // Create dust/firefly particles using graphics
    for (let i = 0; i < 12; i++) {
      const px = Phaser.Math.Between(50, W - 50)
      const py = Phaser.Math.Between(50, H - 50)
      const particle = this.add.circle(px, py, Phaser.Math.Between(1, 2), 0xd4af37, 0.4)
      particle.setDepth(996)

      this.tweens.add({
        targets: particle,
        x: px + Phaser.Math.Between(-20, 20),
        y: py + Phaser.Math.Between(-30, -10),
        alpha: { from: 0.4, to: 0 },
        scale: { from: 1, to: 0.3 },
        duration: 3000 + Math.random() * 3000,
        repeat: -1,
        delay: Math.random() * 2000,
      })
    }
  }

  // ─── PROMPT UI ───
  private createPromptUI(W: number, H: number) {
    this.promptContainer = this.add.container(W / 2, H - 45)
    const bg = this.add.rectangle(0, 0, 180, 26, 0x071510, 0.9)
    bg.setStrokeStyle(1, 0xd4af37, 0.4)
    this.promptText = this.add.text(0, 0, '', {
      fontSize: '10px', color: '#D4AF37', fontFamily: 'sans-serif',
    }).setOrigin(0.5)
    this.promptContainer.add([bg, this.promptText])
    this.promptContainer.setDepth(1000)
    this.promptContainer.setVisible(false)
  }

  // ─── INTERACT ───
  private handleInteract() {
    if (this.isPaused) return

    if (this.nearestArtifact && this.onArtifactInteract) {
      this.onArtifactInteract(this.nearestArtifact.id)
      this.isPaused = true
      const resume = () => { this.isPaused = false; gameEvents.off(GAME_EVENTS.CLOSE_DIALOG, resume) }
      gameEvents.on(GAME_EVENTS.CLOSE_DIALOG, resume)
    } else if (this.naraNearby && this.onNaraInteract) {
      this.onNaraInteract()
      this.isPaused = true
      const resume = () => { this.isPaused = false; gameEvents.off(GAME_EVENTS.CLOSE_DIALOG, resume) }
      gameEvents.on(GAME_EVENTS.CLOSE_DIALOG, resume)
    }
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

    // Joystick
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

    // Depth sort player based on Y
    this.player.setDepth(this.player.y + 14)

    // Check artifact proximity
    let nearest: ArtifactDef | null = null
    let nearestDist = Infinity

    for (const { def, indicator } of this.artifactObjects) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, def.x, def.y)
      if (dist < 65 && dist < nearestDist) {
        nearest = def
        nearestDist = dist
      }
      // Show/hide indicator
      const shouldShow = dist < 65
      if (shouldShow && !indicator.visible) {
        indicator.setVisible(true)
        this.tweens.add({ targets: indicator, alpha: 1, duration: 200 })
      } else if (!shouldShow && indicator.visible) {
        indicator.setAlpha(0)
        indicator.setVisible(false)
      }
    }
    this.nearestArtifact = nearest

    // Nara proximity
    const naraDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.nara.x, this.nara.y)
    this.naraNearby = naraDist < 55

    // Prompt
    if (this.nearestArtifact) {
      this.promptText.setText(`[E] Bicara dengan ${this.nearestArtifact.name}`)
      this.promptContainer.setVisible(true)
    } else if (this.naraNearby) {
      this.promptText.setText('[E] Bicara dengan Nara')
      this.promptContainer.setVisible(true)
    } else {
      this.promptContainer.setVisible(false)
    }
  }
}
