import Phaser from 'phaser'

export class MuseumScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key }
  private speed = 160
  private walls!: Phaser.Physics.Arcade.StaticGroup
  private artifact!: Phaser.GameObjects.Rectangle
  private interactZone!: Phaser.GameObjects.Zone
  private nearArtifact = false
  private promptText!: Phaser.GameObjects.Text
  private onArtifactInteract?: () => void

  constructor() {
    super({ key: 'MuseumScene' })
  }

  init(data: { onArtifactInteract?: () => void }) {
    this.onArtifactInteract = data.onArtifactInteract
  }

  create() {
    const { width, height } = this.scale

    // Floor
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e)

    // Floor tiles pattern
    for (let x = 0; x < width; x += 64) {
      for (let y = 0; y < height; y += 64) {
        this.add.rectangle(x + 32, y + 32, 62, 62, 0x16213e).setAlpha(0.3)
      }
    }

    // Walls
    this.walls = this.physics.add.staticGroup()
    // Top wall
    const topWall = this.add.rectangle(width / 2, 16, width, 32, 0x0f3460)
    this.walls.add(topWall)
    // Bottom wall
    const bottomWall = this.add.rectangle(width / 2, height - 16, width, 32, 0x0f3460)
    this.walls.add(bottomWall)
    // Left wall
    const leftWall = this.add.rectangle(16, height / 2, 32, height, 0x0f3460)
    this.walls.add(leftWall)
    // Right wall
    const rightWall = this.add.rectangle(width - 16, height / 2, 32, height, 0x0f3460)
    this.walls.add(rightWall)

    // Room label
    this.add.text(width / 2, 50, 'Ruang Kerajaan Nusantara', {
      fontSize: '18px',
      color: '#e2e8f0',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5)

    // Artifact pedestal
    this.add.rectangle(width / 2, height / 3, 80, 80, 0x533483).setAlpha(0.5)
    // Artifact object (Keris Jawa)
    this.artifact = this.add.rectangle(width / 2, height / 3, 20, 60, 0xfbbf24)
    this.artifact.setRotation(-0.3)

    // Artifact label
    this.add.text(width / 2, height / 3 + 55, 'Keris Jawa', {
      fontSize: '12px',
      color: '#fbbf24',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5)

    // Glow effect on artifact
    this.tweens.add({
      targets: this.artifact,
      alpha: { from: 1, to: 0.6 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
    })

    // Interact zone around artifact
    this.interactZone = this.add.zone(width / 2, height / 3, 120, 120)
    this.physics.add.existing(this.interactZone, true)

    // Player
    this.player = this.add.rectangle(width / 2, height - 100, 28, 28, 0x38bdf8)
    this.physics.add.existing(this.player)
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body
    playerBody.setCollideWorldBounds(true)

    // Collisions
    this.physics.add.collider(this.player, this.walls)

    // Overlap with artifact zone
    this.physics.add.overlap(this.player, this.interactZone, () => {
      this.nearArtifact = true
    })

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }

    // Interact key (E or Space)
    this.input.keyboard!.on('keydown-E', () => {
      if (this.nearArtifact && this.onArtifactInteract) {
        this.onArtifactInteract()
      }
    })
    this.input.keyboard!.on('keydown-SPACE', () => {
      if (this.nearArtifact && this.onArtifactInteract) {
        this.onArtifactInteract()
      }
    })

    // Prompt text
    this.promptText = this.add.text(width / 2, height / 3 + 80, '', {
      fontSize: '13px',
      color: '#94a3b8',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5)

    // Instructions
    this.add.text(width / 2, height - 40, 'WASD / Arrow keys untuk bergerak | E / Space untuk interaksi', {
      fontSize: '11px',
      color: '#64748b',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5)
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0)

    // Movement
    const left = this.cursors.left.isDown || this.wasd.A.isDown
    const right = this.cursors.right.isDown || this.wasd.D.isDown
    const up = this.cursors.up.isDown || this.wasd.W.isDown
    const down = this.cursors.down.isDown || this.wasd.S.isDown

    if (left) body.setVelocityX(-this.speed)
    else if (right) body.setVelocityX(this.speed)

    if (up) body.setVelocityY(-this.speed)
    else if (down) body.setVelocityY(this.speed)

    // Normalize diagonal
    if ((left || right) && (up || down)) {
      body.velocity.normalize().scale(this.speed)
    }

    // Check proximity to artifact
    const dist = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.artifact.x, this.artifact.y
    )
    this.nearArtifact = dist < 80

    // Show/hide prompt
    if (this.nearArtifact) {
      this.promptText.setText('[E] Bicara dengan Keris Jawa')
    } else {
      this.promptText.setText('')
    }
  }
}
