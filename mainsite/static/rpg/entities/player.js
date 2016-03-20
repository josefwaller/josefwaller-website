var Player = Class({
	
	x: 0,
	y: 0,
	s: 0,

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
		"attackUp"
	],

	// the different animations
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
		attackDown: [
			6
		],
		attackSide: [
			7
		],
		attackUp:  [
			8
		]
	},

	currentAnimation: [0],

	hasTool: {
		ranged: false,
		melee: false
	},

	selectedTool: null,

	isAttacking: false,
	attackTime: 0,
	attackDuration: 150,

	currentSpriteIndex: 0,

	lastAnimChange: 0,

	speed: 70,

	translate: {
		x: 0,
		y: 0
	},

	animationDelay: 150,

	isMoving: false,

	direction: 0,

	// the different directions, named for easy reading
	dirs: {
		up: 0,
		right: 1,
		down: 2,
		left: 3
	},

	mirror: false,

	init: function(p){
			
		this.x = p.x;
		this.y = p.y;
		this.s = p.s;

		lastAnimChange = new Date().getTime();

	},

	onKey: function(keys, delta){

		// takes an array of keys
		for (var i = 0; i < keys.length; i++){

			switch(keys[i]){

				case "ArrowLeft":
					
					this.translate.x = -1;
					break;

				case "ArrowUp":

					this.translate.y = -1;
					break;

				case "ArrowDown":

					this.translate.y = 1;
					break;

				case "ArrowRight":

					this.translate.x = 1;
					break;

				// checks for attacking
				case " ":
					
					if (!this.isAttacking){
						this.isAttacking = true;
						this.attackTime = new Date().getTime();

						// gets the sprite
						this.currentSpriteIndex = 0;

						switch (this.direction){
							case this.dirs.down:
								this.currentAnimation = this.animations.attackDown;
								break

							// fall through for both sides
							case this.dirs.right:
							case this.dirs.left:
								this.currentAnimation = this.animations.attackSide;
								break

							case this.dirs.up:
								this.currentAnimation = this.animations.attackUp;
								break;

							default:
								console.log(this.direction)
						}

					}
					break;

			}
		}

	},

	update: function(){

		// checks for attacking
		if (this.isAttacking){

			// attack

			// check if player is done attacking
			var time = new Date().getTime();
			if (time - this.attackTime > this.attackDuration){

				this.isAttacking = false;

				// changes animation
				switch (this.direction){
					case this.dirs.down: 
						this.currentAnimation = this.animations.runDown;
						break;

					// fall through for both left and right
					case this.dirs.left:
					case this.dirs.right:
						this.currentAnimation = this.animations.runSide;
						break;

					case this.dirs.up:
						this.currentAnimation = this.animations.runUp;
						break;
				}

			}

		}else {

			// checks for movement
			if (this.translate.x !== 0 || this.translate.y !== 0){

				this.mirror = false;

				// moves accoring to tranlate
				this.move(this.translate.x, this.translate.y);

				// checks for animation
				switch(this.translate.y){
					case 1:
						// running down
						this.currentAnimation = this.animations.runDown;
						this.direction = this.dirs.down;
						break;

					case -1:
						// running up
						this.currentAnimation = this.animations.runUp;
						this.direction = this.dirs.up;
						break

				}

				// running sideways
				if (this.translate.x !== 0){

					this.currentAnimation = this.animations.runSide;

					if (this.translate.x == 1){
						this.mirror = true;
						this.direction = this.dirs.right;
					}else{
						this.direction = this.dirs.left;
					}
				}


				// checks if it needs to change the animation sprite
				var time = new Date().getTime();
				if (time - this.lastAnimChange > this.animationDelay){

					this.currentSpriteIndex++;
					if (this.currentSpriteIndex >= this.currentAnimation.length){
						this.currentSpriteIndex = 0;
					}

					this.lastAnimChange = time;
				}


			}

			this.translate = {
				x: 0,
				y: 0
			};
		}

	},

	draw: function(ctx){

		var spriteSet = sprites.player;
		var spriteName = this.sprites[this.currentAnimation[this.currentSpriteIndex]];

		var sprite = spriteSet[spriteName].slice();
		if (this.mirror){

			sprite.reverse();

		}

		drawSprite(ctx, sprite, this.x, this.y, this.s);

		if (this.isAttacking){

			// checks for the weapon
			if (this.selectedTool !== null){

				// the offset at which to draw the tool
				var toolOffsetX = 0;
				var toolOffsetY = 0;

				// the maximum offset, just need the proper direction
				var toolOffset = (this.s * 3/4);

				// gets the direction
				var direction;

				switch (this.direction){

					case this.dirs.up:
						direction = "Up";
						toolOffsetY = - toolOffset;
						break;

					case this.dirs.left:
						direction = "Side";
						toolOffsetX = - toolOffset;
						break;

					case this.dirs.right:
						direction = "Side";
						toolOffsetX = toolOffset;
						break;

					case this.dirs.down:
						direction = "Down";
						toolOffsetY = toolOffset;
						break;

				}
				// draws the tool
				var toolSprite;

				if (this.hasTool.melee){
					toolSprite = sprites.meleeWeapon["use" + direction];

				}else if (this.hasTool.ranged){
					toolSprite = sprites.rangedWeapon["use" + direction];

				}else {
					console.error("Invalid Tool");
				}

				toolSprite = toolSprite.slice();
				if (this.mirror){
					toolSprite.reverse();
				}

				// draws the tool
				drawSprite(
					ctx,
					toolSprite,
					this.x + toolOffsetX,
					this.y + toolOffsetY,
					this.s);

			}

		}

	},
	move: function(x, y){
		if (!this.isAttacking){
			this.x += this.speed * x * delta;
			this.y += this.speed * y * delta;
		}
	},
	// Get and Set functions
	getPos: function(){
		return {
			x: this.x, 
			y: this.y
		};
	},

	setPos: function(x, y){
		if (x !== null){
			this.x = x;
		}
		if (y !== null){
			this.y = y;
		}
	},

	getSize: function(){
		return this.s;
	}
})