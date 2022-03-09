const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl');
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
	constructor() {
		

		this.velocity = {
			x: 0,
			y: 0
		}

		this.rotation = 0
		this.opacity = 1

		const image = new Image()
		image.src = './assets/ship.png'
		
		image.onload = () => {
			const scale = .15
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale

			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height - 20
			}
		}
		
	}

	draw() {
		//c.fillStyle = 'red'
		//c.fillRect(this.position.x, this.position.y, this.width, this.height)
		
		c.save()
		c.globalAlpha = this.opacity
		c.translate(
			player.position.x  + player.width/2, 
			player.position.y + player.height/2)

		c.rotate(this.rotation)

		c.translate(
			-player.position.x  - player.width/2, 
			-player.position.y - player.height/2)

		c.drawImage(this.image, this.position.x, this.position.y, 
		this.width, this.height)

		c.restore()
			
	}

	update() {
		if (this.image){
			this.draw()
			this.position.x += this.velocity.x
			this.position.y += this.velocity.y
		}
	}

	
}

// -- Projectile Rendering -- \\

class Projectile{
	constructor({position, velocity}) {
		this.position = position
		this.velocity = velocity
        this.width = 4
		this.height = 20
		this.radius = this.width/2
	}

	draw() {
		c.beginPath()
		c.rect(this.position.x - this.width / 2, this.position.y, this.width, this.height)
		c.fillStyle = 'red'
		c.fill()
		c.closePath()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

class Particle{
	constructor({position, velocity, radius, color, fades}) {
		this.position = position
		this.velocity = velocity
		this.radius =  radius
		this.color = color
		this.opacity = 1
		this.fades = fades
	}

	draw() {
		c.save()
		c.globalAlpha = this.opacity
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		c.fillStyle = this.color
		c.fill()
		c.closePath()
		c.restore()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		if (this.fades) {
			this.opacity -= .01
		}
	}
}

class InvaderProjectile{
	constructor({position, velocity}) {
		this.position = position
		this.velocity = velocity
        this.width = 3
		this.height = 10
		
	}

	draw() {
		c.fillStyle = 'white'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}


class Invader {
	constructor({position}) {
		
		this.velocity = {
			x: 0,
			y: 0
		}

		const image = new Image()
		image.src = './assets/invader.png'
		
		image.onload = () => {
			const scale = .05
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale

			this.position = {
				x: position.x,
				y: position.y
			}
		}
		
	}

	draw() {

		c.drawImage(this.image, this.position.x, this.position.y, 
		this.width, this.height)
			
	}

	update({velocity}) {
		if (this.image){
			this.draw()
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
	}

	//parameters for invader bullets
	shoot(invaderProjectiles){ 
		invaderProjectiles.push(new InvaderProjectile({
			position: {
				x: this.position.x + this.width/2,
				y: this.position.y + this.height
			},
			velocity: {
				x:0,
				y:5
			}
		}))
	}

	
}

class Grid {
	constructor() {
		this.position = {
			x: 0,
			y: 0
		}

		this.velocity = {
			x: 2,
			y: 0
		}

		this.invaders = []
		
		const columns = Math.floor(Math.random() * 10 + 5)
		const rows = Math.floor(Math.random() * 5 + 2)
		this.width = columns * 66
		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
			this.invaders.push(new Invader({
				position: {
				x: x*67,
				y: y*62
			}
		}))
		}}
		
	}

	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.velocity.y = 0

		if (this.position.x + this.width >= canvas.width || 
			this.position.x <= 0) {
			this.velocity.x = -this.velocity.x
			this.velocity.y += 60
		}

		
	}
}

const player = new Player()
const projectiles = []
let grids = []
const invaderProjectiles = []
const particles = []
const laserShoot = new Audio('./assets/laserShoot.wav');
const invaderHit = new Audio('./assets/hitHurt.wav');
const playerHit = new Audio('./assets/game over.mp3');


//key state intialization
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	},
    x: {
		pressed: false
	}
	
}

let frames = 0
let game = {
	over: false,
	active: true
}

let score = 0

//beautiful stars
for (let i = 0; i < 200; i++) {
	particleRadius = Math.random() * 2
	particles.push(new Particle({
		position: {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height
		}, 
		velocity: {
			x: particleRadius/8,
			y: 0
		},
		radius: particleRadius,
		color: 'white'
	}))}

function createParticles({object, color, fades}) {
	for (let i = 0; i < 15; i++) {
		particles.push(new Particle({
			position: {
				x: object.position.x + object.width/2,
				y: object.position.y + object.height/2
			}, 
			velocity: {
				x: (Math.random() - 0.5) * 2,
				y: (Math.random() - 0.5) * 2
			},
			radius: Math.random() * 3,
			color: color || 'red',
			fades
		}))}
}

function animate() {

	
	if (!game.active){
		//show game over screen and restart button
		c.fillStyle = 'black'
		c.fillRect(0, 0, canvas.width, canvas.height)
		c.fillStyle = 'white'
		c.font = '48px sans-serif'
		c.fillText('Game Over', canvas.width/2 - 150, canvas.height/2 - 50)
		c.font = '24px sans-serif'
		c.fillText('Press Space to Restart', canvas.width/2 - 150, canvas.height/2)
		requestAnimationFrame(animate)
		grids = []


		particles.forEach((particle, i) => {
		
			if (particle.position.x - particle.radius >= canvas.width) {
				particle.position.y = Math.random() * canvas.height
				particle.position.x = -particle.radius
			}
			if (particle.opacity <= 0) {
				setTimeout(() => {
				particles.splice(i, 1)
				}, 0)
			} else {
			particle.update()
			}
		})
		//restart game if space is pressed
		if (keys.space.pressed){
			game.active = true
			game.over = false
			player.position.x = canvas.width/2 - player.width/2
			player.opacity = 1
			score = 0
			scoreEl.innerHTML = score
			grids.push(new Grid())
		}

		return
	}

	

	requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()

	

	particles.forEach((particle, i) => {
		
		if (particle.position.x - particle.radius >= canvas.width) {
			particle.position.y = Math.random() * canvas.height
			particle.position.x = -particle.radius
		}
		if (particle.opacity <= 0) {
			setTimeout(() => {
			particles.splice(i, 1)
			}, 0)
		} else {
		particle.update()
		}
	})
	
	//invader projectile garbage collection
	invaderProjectiles.forEach((invaderProjectile,index) => {
		if (invaderProjectile.position.y + invaderProjectile.height >= 
			canvas.height) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1)
			}, 0) 
		} else invaderProjectile.update()

		if (
			invaderProjectile.position.y + invaderProjectile.height >= 
			player.position.y && invaderProjectile.position.x + invaderProjectile.width
			 >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width) {
				console.log('you lose')
				setTimeout(() => {
					invaderProjectiles.splice(index, 1)
					player.opacity = 0
					game.over = true
					playerHit.play()

				}, 0) 

				setTimeout(() => {
					game.active = false
				}, 2000) 
				
				createParticles({
					object: player,
					color: 'white',
					fades: true
				})
			}
	})

	//player projectile garbage collection
	projectiles.forEach((projectile, index) => {
		
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1)
			}, 0)
		} else { projectile.update() 

		}
	})

	grids.forEach((grid, gridIndex) => {
		grid.update()

		//shoot invader projectiles
		if (frames % (130 -  + Math.floor(score/1000)) === 0 && grid.invaders.length > 0) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
				invaderProjectiles)
		}
		
		grid.invaders.forEach((invader, i) => {
			invader.update({velocity: grid.velocity})

			
			projectiles.forEach((projectile,j) => {
				
				//invader projectile collision VERY ANNOYING TO IMPLEMENT
				if (
					projectile.position.y - projectile.radius <=
						invader.position.y + invader.height && 
					projectile.position.x + projectile.radius >= 
						invader.position.x && 
					projectile.position.x - projectile.radius <= 
						invader.position.x + invader.width && 
					projectile.position.y + projectile.radius >= 
						invader.position.y
					) {

						setTimeout(() => {
								
								const invaderFound = grid.invaders.find(
									(invader2) => invader2 === invader)

								const projectileFound = projectiles.find(
									(projectile2) => projectile2 === projectile)

								if (invaderFound && projectileFound) {

									score += 100
									invaderHit.play()
									scoreEl.innerHTML = score
									createParticles({
										object: invader,
										color: 'red',
										fades: true
									})

									grid.invaders.splice(i, 1)
									projectiles.splice(j, 1)

									//invader wall collision stuff
									if (grid.invaders.length > 0) {
										const firstInvader = grid.invaders[0]
										const lastInvader = grid.invaders[grid.
											invaders.length-1]
										
										grid.width = 
											lastInvader.position.x - 
											firstInvader.position.x +
											lastInvader.width 
										
										grid.position.x = firstInvader.position.x
										

									} else {
											grids.splice(gridIndex, 1)
									}
								}
							
						}, 0)
					}
			})
		})
	})

	//player movement
	if (keys.a.pressed && player.position.x >= 0){
		player.velocity.x = -5
		player.rotation = -.15
	} else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
		player.velocity.x = 5
		player.rotation = .15
	} else {
		player.velocity.x = 0
		player.rotation = 0
	}

	if (frames % (3000 - Math.floor(score/100)) === 0|| grids.length === 0) {
		grids.push(new Grid())
		
		frames = 0
		
	}
	
	frames++
	
}


var oldShotTime = performance.now()

function shoot() {
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + player.width/2,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -10
        }
    }))
    oldShotTime = performance.now()
}

animate()

// -- Key Logger -- \\

addEventListener('keydown', ({key}) => {
	//if (game.over) return
	switch (key) {
		case 'a':
			keys.a.pressed = true
			break

		case 'd':
			keys.d.pressed = true
			break

		case ' ':
			
                keys.space.pressed = true
                newShotTime = performance.now()
                if ((newShotTime - oldShotTime) > 80 && !game.over){
					laserShoot.play();
                    shoot()
                }
            break

        case 'x':
		    keys.x.pressed = true
		    break
	}
})

addEventListener('keyup', ({key}) => {
	switch (key) {
		case 'a':
			
			keys.a.pressed = false
			break
		case 'd':
			
			keys.d.pressed = false
			break
		case ' ':
			
			keys.space.pressed = false
			break
            
        case 'x':
            keys.x.pressed = false
            break
	}
})