import Phaser from 'phaser'
import { gameEvents, GAME_EVENTS } from './events'

interface ArtifactDef {
  id: string
  name: string
  x: number
  y: number
  color: number
  width: number
  height: number
  rotation?: number
}

const ARTIFACTS: ArtifactDef[] = [
  { id: 'keris-jawa', name: 'Keris Jawa', x: 250, y: 180, color: 0xd4af37, width: 16, height: 50, rotation: -0.3 },
  { id: 'candi-borobudur', name: 'Candi Borobudur', x: 550, y: 180, color: 0xa97142, width: 50, height: 40 },
  { id: 'patung-ganesha', name: 'Patung Ganesha', x: 400, y: 130, color: 0x1f8a70, width: 30, height: 40 },
]

export class MuseumScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container
  private playerBody!: Phaser.Physics.Arcade.Body
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key }
  private speed = 150
  private walls!: Phaser.Physics.Arcade.StaticGroup
  private artifactObjects: { def: ArtifactDef; obj: Phaser.GameObjects.Rectangle; glow: Phaser.Tweens.Tween }[] = []
  private nearestArtifact: ArtifactDef | null = null
  private promptText!: Phaser.GameObjects.Text
  private onArtifactInteract?: (artifactId: string) => void
  private joystickVelocity = { x: 0, y: 0 }
  private nara!: Phaser.GameObjects.Container
  private naraNearby = false
  private onNaraInteract?: () => void
  private isPaused = false

  constructor() {
    super({ key: 'MuseumScene' })
  }

  init(data: { onArtifactInteract?: (artifactId: string) => void; onNaraInteract?: () => void }) {
    this.onArtifactInteract = data.onArtifactInteract
    this.onNaraInteract = data.onNaraInteract
  }

  create() {
    const { width, height } = this.scale

    // Museum floor — dark green stone
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a1a14)

    // Floor tile pattern
    for (let x = 0; x < width; x += 48) {
      for (let y = 0; y < height; y += 48) {
        const tile = this.add.rectangle(x + 24, y + 24, 46, 46, 0x0d2118)
        tile.setAlpha(0.6)
      }
    }

    // Carpet runner (center)
    this.add.rectangle(width / 2, height / 2, 120, height - 80, 0x2b1b12).setAlpha(0.4)

    // Walls
    this.walls = this.physics.add.staticGroup()
    const wallColor = 0x132b22
    const topWall = this.add.rectangle(width / 2, 12, width, 24, wallColor)
    this.walls.add(topWall)
    const bottomWall = this.add.rectangle(width / 2, height - 12, width, 24, wallColor)
    this.walls.add(bottomWall)
    const leftWall = this.add.rectangle(12, height / 2, 24, height, wallColor)
    this.walls.add(leftWall)
    const rightWall = this.add.rectangle(width - 12, height / 2, 24, height, wallColor)
    this.walls.add(rightWall)

    // Wall decorations (torches)
    this.createTorch(80, 30)
    this.createTorch(width - 80, 30)
    this.createTorch(80, height - 30)
    this.createTorch(width - 80, height - 30)

    // Room label
    this.add.text(width / 2, 40, 'Hall of Awakening', {
      fontSize: '14px',
      color: '#D4AF37',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.8)

    // Create artifacts
    ARTIFACTS.forEach((def) => {
      // Pedestal
      this.add.rectangle(def.x, def.y + 20, 60, 12, 0x1f1a15).setAlpha(0.8)
      this.add.rectangle(def.x, def.y + 14, 50, 6, 0x2b1b12).setAlpha(0.6)

      // Artifact shape
      const obj = this.add.rectangle(def.x, def.y, def.width, def.height, def.color)
      if (def.rotation) obj.setRotation(def.rotation)

      // Glow tween
      const glow = this.tweens.add({
        targets: obj,
        alpha: { from: 1, to: 0.5 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      // Label
      this.add.text(def.x, def.y + 38, def.name, {
        fontSize: '10px',
        color: '#B8AFA3',
        fontFamily: 'sans-serif',
      }).setOrigin(0.5)

      this.artifactObjects.push({ def, obj, glow })
    })

    // NPC Nara
    this.nara = this.add.container(680, 350)
    const naraBody = this.add.circle(0, 0, 14, 0x1f8a70)
    const naraHead = this.add.circle(0, -18, 10, 0x1f8a70)
    const naraLabel = this.add.text(0, 20, 'Nara', { fontSize: '9px', color: '#1F8A70', fontFamily: 'sans-serif' }).setOrigin(0.5)
    const naraBubble = this.add.text(0, -38, '💬', { fontSize: '12px' }).setOrigin(0.5)
    this.nara.add([naraBody, naraHead, naraLabel, naraBubble])

    // Nara float animation
    this.tweens.add({
      targets: naraBubble,
      y: -42,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Player — character with body + head
    this.player = this.add.container(width / 2, height - 80)
    const pBody = this.add.rectangle(0, 0, 20, 24, 0x38bdf8)
    const pHead = this.add.circle(0, -16, 8, 0x7dd3fc)
    this.player.add([pBody, pHead])
    this.physics.add.existing(this.player)
    this.playerBody = this.player.body as Phaser.Physics.Arcade.Body
    this.playerBody.setSize(20, 24)
    this.playerBody.setCollideWorldBounds(true)

    // Collisions
    this.physics.add.collider(this.player, this.walls)

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }

    // Interact key
    this.input.keyboard!.on('keydown-E', () => this.handleInteract())
    this.input.keyboard!.on('keydown-SPACE', () => this.handleInteract())

    // Prompt text
    this.promptText = this.add.text(width / 2, height - 30, '', {
      fontSize: '11px',
      color: '#D4AF37',
      fontFamily: 'sans-serif',
      backgroundColor: '#071510cc',
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setDepth(10)

    // Listen for joystick events
    gameEvents.on(GAME_EVENTS.JOYSTICK_MOVE, (data: unknown) => {
      const { x, y } = data as { x: number; y: number }
      this.joystickVelocity = { x, y }
    })
    gameEvents.on(GAME_EVENTS.JOYSTICK_STOP, () => {
      this.joystickVelocity = { x: 0, y: 0 }
    })

    // Instructions (subtle)
    this.add.text(width / 2, height - 12, 'WASD bergerak • E interaksi', {
      fontSize: '9px',
      color: '#B8AFA3',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5).setAlpha(0.5)
  }

  private createTorch(x: number, y: number) {
    const torch = this.add.circle(x, y, 4, 0xd4af37)
    this.tweens.add({
      targets: torch,
      alpha: { from: 0.8, to: 0.3 },
      scale: { from: 1, to: 0.7 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private handleInteract() {
    if (this.isPaused) return

    if (this.nearestArtifact && this.onArtifactInteract) {
      this.onArtifactInteract(this.nearestArtifact.id)
      this.isPaused = true
      gameEvents.on(GAME_EVENTS.CLOSE_DIALOG, () => {
        this.isPaused = false
      })
    } else if (this.naraNearby && this.onNaraInteract) {
      this.onNaraInteract()
      this.isPaused = true
      gameEvents.on(GAME_EVENTS.CLOSE_DIALOG, () => {
        this.isPaused = false
      })
    }
  }

  update() {
    if (this.isPaused) {
      this.playerBody.setVelocity(0)
      return
    }

    // Movement from keyboard
    let vx = 0
    let vy = 0

    const left = this.cursors.left.isDown || this.wasd.A.isDown
    const right = this.cursors.right.isDown || this.wasd.D.isDown
    const up = this.cursors.up.isDown || this.wasd.W.isDown
    const down = this.cursors.down.isDown || this.wasd.S.isDown

    if (left) vx = -1
    else if (right) vx = 1
    if (up) vy = -1
    else if (down) vy = 1

    // Joystick override
    if (this.joystickVelocity.x !== 0 || this.joystickVelocity.y !== 0) {
      vx = this.joystickVelocity.x
      vy = this.joystickVelocity.y
    }

    // Normalize and apply
    const len = Math.sqrt(vx * vx + vy * vy)
    if (len > 0) {
      this.playerBody.setVelocity(
        (vx / len) * this.speed,
        (vy / len) * this.speed
      )
    } else {
      this.playerBody.setVelocity(0, 0)
    }

    // Check proximity to artifacts
    let nearest: ArtifactDef | null = null
    let nearestDist = Infinity

    for (const { def } of this.artifactObjects) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, def.x, def.y)
      if (dist < 70 && dist < nearestDist) {
        nearest = def
        nearestDist = dist
      }
    }
    this.nearestArtifact = nearest

    // Check Nara proximity
    const naraDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.nara.x, this.nara.y)
    this.naraNearby = naraDist < 60

    // Update prompt
    if (this.nearestArtifact) {
      this.promptText.setText(`[E] Bicara dengan ${this.nearestArtifact.name}`)
      this.promptText.setVisible(true)
    } else if (this.naraNearby) {
      this.promptText.setText('[E] Bicara dengan Nara')
      this.promptText.setVisible(true)
    } else {
      this.promptText.setVisible(false)
    }
  }
}
