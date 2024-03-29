const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const placementTilesData2D = []

for (let i = 0; i < placementTilesData.length; i += 50) {
	placementTilesData2D.push(placementTilesData.slice(i, i + 50))
}

const placementTiles = []

placementTilesData2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 1) {
			// add building placement tile here
			placementTiles.push(
				new PlacementTile({
					position: {
						x: x * 20,
						y: y * 20
					}
				})
			)
		}
	})
})

const image = new Image(1280, 768)

image.onload = () => {
	canvas.width = 1000
	canvas.height = 647
	c.drawImage(image, 0, 0, canvas.width, canvas.height)
	animate()
}
image.src = 'img/map.png'

const enemies = []

function spawnEnemies(spawnCount) {
	for (let i = 1; i < spawnCount + 1; i++) {
		const xOffset = i * 150
		enemies.push(
			new Enemy({
				position: {
					x: waypoints[0].x - xOffset,
					y: waypoints[0].y
				}
			})
		)
	}
}

const buildings = []
let activeTile = undefined
let enemyCount = 3
let enemyCounter = enemyCount
let wave = 1
let hearts = 1
let coins = 175
const explosions = []
spawnEnemies(enemyCount)

function animate() {
	const animationId = requestAnimationFrame(animate)

	c.drawImage(image, 0, 0)
	document.getElementById('hpScale').innerHTML = wave;
	document.getElementById("waves").innerHTML = wave;
	document.getElementById("enemies").innerHTML = enemyCounter;
	if (wave === 6) {
		console.log('game over')
		cancelAnimationFrame(animationId)
		document.getElementById('gameOver').innerHTML = "You Win!"
		document.getElementById('gameOver').style.display = 'flex'
		document.getElementById('waves').innerHTML = "0"
		document.getElementById('enemies').innerHTML = "0"
		document.getElementById('coins').innerHTML = "0"
		document.getElementById('hearts').innerHTML = "0"
	}

	for (let i = enemies.length - 1; i >= 0; i--) {
		const enemy = enemies[i]
		enemy.update()

		if (enemy.position.y < 0 && enemy.position.x > 100) {
			hearts -= 1
			enemies.splice(i, 1)
			document.querySelector('#hearts').innerHTML = hearts

			if (hearts === 0) {
				console.log('game over')
				cancelAnimationFrame(animationId)
				document.querySelector('#gameOver').style.display = 'flex'
			}
		}
	}

	for (let i = explosions.length - 1; i >= 0; i--) {
		const explosion = explosions[i]
		explosion.draw()
		explosion.update()

		if (explosion.frames.current >= explosion.frames.max - 1) {
			explosions.splice(i, 1)
		}

		// console.log(explosions)
	}

	// tracking total amount of enemies
	if (enemies.length === 0) {
		enemyCount *= 2
		enemyCounter = enemyCount
		wave += 1
		spawnEnemies(enemyCount)
	}

	placementTiles.forEach((tile) => {
		tile.update(mouse)
	})

	buildings.forEach((building) => {
		building.update()
		building.target = null
		const validEnemies = enemies.filter((enemy) => {
			const xDifference = enemy.center.x - building.center.x
			const yDifference = enemy.center.y - building.center.y
			const distance = Math.hypot(xDifference, yDifference)
			return distance < enemy.radius + building.radius
		})
		building.target = validEnemies[0]

		for (let i = building.projectiles.length - 1; i >= 0; i--) {
			const projectile = building.projectiles[i]

			projectile.update()

			const xDifference = projectile.enemy.center.x - projectile.position.x
			const yDifference = projectile.enemy.center.y - projectile.position.y
			const distance = Math.hypot(xDifference, yDifference)

			// this is when a projectile hits an enemy
			if (distance < projectile.enemy.radius + projectile.radius) {
				// enemy health and enemy removal
				projectile.enemy.health -= 20
				if (projectile.enemy.health <= 0) {
					const enemyIndex = enemies.findIndex((enemy) => {
						return projectile.enemy === enemy
					})

					if (enemyIndex > -1) {
						enemies.splice(enemyIndex, 1)
						coins += 25
						enemyCounter -= 1
						document.querySelector('#coins').innerHTML = coins
					}
				}

				// console.log(projectile.enemy.health)
				explosions.push(
					new Sprite({
						position: {
							x: projectile.position.x,
							y: projectile.position.y
						},
						imageSrc: './img/explosion.png',
						frames: {
							max: 4
						},
						offset: {
							x: 0,
							y: 0
						}
					})
				)
				building.projectiles.splice(i, 1)
			}
		}
	})
}

const mouse = {
	x: undefined,
	y: undefined
}

canvas.addEventListener('click', (event) => {
	console.log("X: " + event.x + "  Y: " + event.y)
	if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
		coins -= 50
		document.querySelector('#coins').innerHTML = coins
		buildings.push(
			new Building({
				position: {
					x: activeTile.position.x,
					y: activeTile.position.y
				}
			})
		)
		activeTile.isOccupied = true
		buildings.sort((a, b) => {
			return a.position.y - b.position.y
		})
	}
})

window.addEventListener('mousemove', (event) => {
	mouse.x = event.clientX
	mouse.y = event.clientY

	activeTile = null
	for (let i = 0; i < placementTiles.length; i++) {
		const tile = placementTiles[i]
		if (
			mouse.x - 260 > tile.position.x &&
			mouse.x - 260 < tile.position.x + tile.size &&
			mouse.y - 25 > tile.position.y &&
			mouse.y - 25 < tile.position.y + tile.size
		) {
			activeTile = tile
			break
		}
	}
})

function playMusic() {
	var audio = document.getElementById("audio");
	audio.play();
}

function refreshPage(){
	window.location.reload();
}