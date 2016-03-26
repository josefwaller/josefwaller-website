var MeleeEnemy = Class({
	// caps for emphasis
	SUPERCLASS: Entity,

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
		"dieTwo"
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
		]
	},
	animationDelay: 200,

	type: null,

	speed: 20,

	isDying: false,
	dieTime: 0,
	isDead: false,

	init: function(p){

		// 1 or 2
		this.type = p.type;

		switch (this.type){
			case 1:
				this.spriteSetName = "meleeEnemyOne";
				break;

			case 2:
				this.spriteSetName = "meleeEnemyTwo";
				break;
		}

	},

	onHit: function(){

		if (!this.isDying && !this.isDead){

			console.log("HIT")
			this.isDying = true;
			this.dieTime = new Date().getTime();
			this.currentAnimation = this.animations.die;
			this.lastAnimChange = this.dieTime;
			this.animationDelay = 100;
			this.currentSpriteIndex = 0;
		}

	},

	update: function(){	

		if (this.isDying){

			this.checkForAnimChange();

			if (new Date().getTime() - this.dieTime >= 2 * this.animationDelay){

				this.isDead = true;

			}

		}else if (!this.isDead){

			// gets player position
			var playerPos = this.parent.player.getPos();
			var playerSize = this.parent.player.getSize();

			var hitPlayer = false;

			// checks if it hit the player
			if (playerPos.x + playerSize > this.x){
				if (playerPos.x < this.x + this.s){
					if (playerPos.y + playerSize > this.y){
						if (playerPos.y < this.y + this.s){

							this.parent.player.onHit();
							hitPlayer = true;

						}
					}
				}
			}

			if (!hitPlayer){

				// chase after player

				// gets the angle to run after the player
				var disX = playerPos.x - this.x;
				var disY = playerPos.y - this.y;

				var hyp = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));

				// gets the distances X + Y to go,
				// forms a right triangle between the enemy and the player
				// with the speed as the hypotenuse
				var moveX = this.speed * (disX / hyp);
				var moveY = this.speed * (disY / hyp);

				this.x += moveX * delta;
				this.y += moveY * delta;

				// changes animation
				if (Math.abs(disX) > Math.abs(disY)){

					this.currentAnimation = this.animations.runSide;
					if (disX > 0){
						this.mirror = true;
					}else{
						this.mirror = false;
					}

				}else {

					if (disY > 0){
						this.currentAnimation = this.animations.runDown;
					}else {
						this.currentAnimation = this.animations.runUp;
					}

				}

				this.checkForAnimChange();
			}
		}

	},

	draw: function(ctx){

		if (!this.isDead){

			this.superRender(ctx);

		}

	},

	getIsAlive: function(){
		return !this.isDead;
	}

});