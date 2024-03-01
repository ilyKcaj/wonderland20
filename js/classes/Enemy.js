class Enemy extends Sprite {
	constructor({
		position = {
			x: 0,
			y: 0
		}
	}) {

		const enemyTypes = ['potato', 'tomato', 'broccoli', 'cactus']
		const enemySprites = ['./img/potato.png', './img/tomato.png', './img/broccoli.png', './img/cactus.png']
		var enemyIndex = Math.floor(Math.random() * enemyTypes.length)
		var enemyType = enemyTypes[enemyIndex]
		var enemySprite = enemySprites[enemyIndex]
		// var enemyType = 'cactus'
		// var enemySprite = './img/cactus.png'

		super({
			position,
			imageSrc: enemySprite,
			frames: {
				max: 1
			}
		})
		this.position = position
		this.width = 50
		this.height = 50
		this.waypointIndex = 0
		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2
		}
		this.radius = 50
		this.velocity = {
			x: 0,
			y: 0
		}
		this.enemyType = enemyType

		switch (enemyType) {
			case 'potato':
				this.health = 100 * parseInt(document.getElementById('hpScale').innerHTML);
				this.healthOffset = 0
				this.speed = 3
				break
			case 'tomato':
				this.health = 50 * parseInt(document.getElementById('hpScale').innerHTML);
				// this.healthOffset = (this.width * this.health / 200)
				this.healthOffset = 0
				this.speed = 5
				break
			case 'broccoli':
				this.health = 75 * parseInt(document.getElementById('hpScale').innerHTML);
				// this.healthOffset = 7.5
				this.healthOffset = 0
				this.speed = 4
				break
			case 'cactus':
				this.health = 10 * parseInt(document.getElementById('hpScale').innerHTML);
				// this.healthOffset = 8
				this.healthOffset = 0
				this.speed = 10
		}
	}

	draw() {
		super.draw()

		var healthBarWidth = (this.width * this.health / 100)

		// health bar
		c.fillStyle = 'red'
		c.fillRect(this.position.x + this.healthOffset, this.position.y - 15, healthBarWidth, 10)

		// c.fillStyle = 'green'
		c.fillRect(
			this.position.x + this.healthOffset,
			this.position.y - 15,
			(this.width * this.health) / 100,
			10
		)
	}

	update() {
		this.draw()
		super.update()

		const waypoint = waypoints[this.waypointIndex]
		const yDistance = waypoint.y - this.center.y
		const xDistance = waypoint.x - this.center.x
		const angle = Math.atan2(yDistance, xDistance)

		const speed = this.speed

		this.velocity.x = Math.cos(angle) * speed
		this.velocity.y = Math.sin(angle) * speed

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.center = {
			x: this.position.x + this.width / 2,
			y: this.position.y + this.height / 2
		}

		if (
			Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
			Math.abs(this.velocity.x) &&
			Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
			Math.abs(this.velocity.y) &&
			this.waypointIndex < waypoints.length - 1
		) {
			this.waypointIndex++
		}
	}
}