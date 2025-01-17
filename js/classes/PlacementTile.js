const mouseImage = new Image();
mouseImage.src = 'img/cursor.png';

class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = 32;
    this.color = 'rgba(255, 255, 255, 0.15)';
    this.occupied = false;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  update(mouse) {
    this.draw();

    if (
      mouse.x > this.position.x &&
      mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.size
    ) {
      this.color = 'rgba(0, 0, 255, 0.5)'; 
      this.showMouseImage(mouse.x, mouse.y); 
    } else {
      this.color = 'rgba(0, 0, 0, 0)';
    }
  }

  showMouseImage(mouseX, mouseY) {
    if (mouseImage.complete) {
      const tileCenterX = Math.floor(mouseX / this.size) * this.size;
      const tileCenterY = Math.floor(mouseY / this.size) * this.size;
      c.drawImage(mouseImage, tileCenterX, tileCenterY, this.size, this.size);
    }
  }
}
