var RangedEnemy = Class({
	SUPERCLASS: Enemy,

	spriteSetName: "",

	// all the sprites this entity uses
	sprites: [
		"runDownOne",
		"runDownTwo",
		"runSideOne",
		"runSideTwo",
		"runUpOne",
		"runUpTwo",
		"attackDown",
		"attackSide",
		"attackUp",
		"dieOne",
		"dieTwo",
		"shootDown",
		"shootUp",
		"shootSide"
	],

	animations: {
		runDown: [
			0,
			1
		],
		runSide: [
			2,
			3
		],
		runUp: [
			4,
			5
		],
		die: [
			9,
			10
		],
		standDown: [0],
		standSide: [2],
		standUp: [4],
		shootDown: [11],
		shootUp: [12],
		shootSide: [13]
	},
	
	animationDelay: 200,

	lastShootTime: 0,
	shootDelay: 2000,

	speed: 10,

	init: function(p){

		switch (p.type){
			case 1:
				this.spriteSetName = "rangedEnemyOne";
				break;

			case 2:
				this.spriteSetName = "rangedEnemyTwo";
				break;
		}
	},

	update: function(){

		if (this.isDying){

			this.die();

		} else if (!this.isDead){

			// finds the player
			var player = this.parent.getPlayer();

			// gets the player's position
			var playerPos = player.getPos();

			// checks if it is lined up to shoot
			if (Math.abs(this.x - playerPos.x) < this.s|| Math.abs(this.y - playerPos.y) < this.s){

				var canShoot = false;
				var missileX = 0;
				var misileY = 0;
				var missileDirection = 0;

				// checks if it has waited long enough from the last shot
				var newTime = new Date().getTime();
				if (newTime - this.lastShootTime >= this.shootDelay){


					// checks if it is inline to shoot a missile vertically

					if (Math.abs(playerPos.x - this.x) < this.s){

						// sets up to shoot a missile vertically
						canShoot = true;
						missileX = this.x;

						if (playerPos.y > this.y){

							missileY = this.y + this.s;
							missileDirection = this.dirs.down;
							this.currentAnimation = this.animations.shootDown;
							this.direction = this.dirs.down;

						}else {
							missileY = this.y - this.s;
							missileDirection = this.dirs.up;
							this.currentAnimation = this.animations.shootUp;
							this.direction = this.dirs.up;
						}


					// checks if it is inline to shoot horizontally
					}else if (Math.abs(playerPos.y - this.y) < this.s){

						// sets up to shoot a missile
						canShoot = true;
						missileY = this.y;
						this.currentAnimation = this.animations.shootSide;

						if (playerPos.x > this.x){

							missileX = this.x + this.s;
							missileDirection = this.dirs.right;
							this.direction = this.dirs.right;

						}else {
							missileX = this.x - this.s;
							missileDirection = this.dirs.left;
							this.direction = this.dirs.left;
						}

					} 

					// shoots
					this.parent.addMissile(new Missile({
						x: missileX,
						y: missileY,
						s: this.s,
						isEnemy: true,
						type: "rangedEnemyOne",
						direction: missileDirection,
						area: this.area,
						parent: this.parent
					}));

					this.lastShootTime = newTime;
				}else {
					// if it has not waited long enough

					// checks if it is done the shooting animation
					if (newTime - this.lastShootTime >= this.shootDelay / 2){

						this.mirror = false;

						switch (this.direction){
							case this.dirs.up:
								this.currentAnimation = this.animations.standUp;
								break;

							case this.dirs.left:
								this.currentAnimation = this.animations.standSide;
								break;

							case this.dirs.right:
								this.currentAnimation = this.animations.standSide;
								this.mirror = true;
								break;

							case this.dirs.down:
								this.currentAnimation = this.animations.standDown;
								break;
						}
					}
				}
			}else {

				// checks whether it would be quicker to move vertically or horizontally to reach them

				if (Math.abs(this.x - playerPos.x) > Math.abs(this.y - playerPos.y)){

					this.mirror = false;

					// moves vertically

					if (this.y + this.s < playerPos.y){

						this.currentAnimation = this.animations.runDown;
						this.superMove(0, 1);
					}else if (this.y - this.s > playerPos.y){

						this.currentAnimation = this.animations.runUp;
						this.superMove(0, -1);

					}

				}else {

					// moves horizontally
					this.currentAnimation = this.animations.runSide;
					if (this.x - this.s > playerPos.x){

						this.mirror = false;
						this.superMove(-1, 0);

					}else if (this.x + this.s < playerPos.x){

						this.mirror = true;
						this.superMove(1, 0);
					}
				}
			}

			this.checkForAnimChange();
		}
	},

	draw: function(ctx){

		if (!this.isDead){
			this.superRender(ctx);
		}
	}
})