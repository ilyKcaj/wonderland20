class Building extends Sprite {
  constructor({ position = { x: 0, y: 0 } }) {
    super({
      position,
      imageSrc: './img/calculator.png',
      frames: {
        max: 19
      },
      offset: {
        x: 0,
        y: 0
      }
    })

    this.width = 40
    this.height = 20
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    }
    this.projectiles = []
    this.radius = 250
    this.target
  }

  draw() {
    super.draw()
  }

  hover() {
    c.beginPath()
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'rgba(0, 0, 255, 0.2)'
    c.fill()
  }

  update() {
    this.draw()
    if (this.target || (!this.target && this.frames.current !== 0))
      super.update()

    if (
      this.target &&
      this.frames.current === 0 &&
      this.frames.elapsed % this.frames.hold === 0
    )
      this.shoot()
  }

  shoot() {
    this.projectiles.push(
      new Projectile({
        position: {
          x: this.center.x - 0,
          y: this.center.y - 0
        },
        enemy: this.target
      })
    )
  }
}
