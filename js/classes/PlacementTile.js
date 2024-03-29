class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position
    this.size = 32
    this.color = 'rgba(255, 255, 255, 0.15)'
    this.occupied = false
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.size, this.size)
  }

  update(mouse) {
    this.draw()
    if (
      mouse.x - 260 > this.position.x &&
      mouse.x - 260 < this.position.x + this.size &&
      mouse.y - 25 > this.position.y &&
      mouse.y - 25 < this.position.y + this.size
    ) {
      this.color = 'rgba(0, 0, 255, 0.5)'
    } else this.color = 'rgba(0, 0, 0, 0)'
  }
}
