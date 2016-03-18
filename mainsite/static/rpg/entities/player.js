var Player = Class({
	
	x: 0,
	y: 0,
	s: 0,

	animations: {
		runDown: [
			"runDownOne",
			"runDownTwo"
		],
		runUp: [
			"runUpOne",
			"runUpTwo"
		],
		runSide: [
			"runSideOne",
			"runSideTwo"
		]
	},

	hasTool: {
		ranged: false,
		melee: false
	},

	currentSpriteIndex: 0,

	currentAnimation: "runDown",

	lastAnimChange: 0,

	speed: 1,

	animationDelay: 150,

	isMoving: false,

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

			this.mirror = false;

			// checks if it is mooving
			var movingKeys = [
				"ArrowLeft",
				"ArrowRight",
				"ArrowUp",
				"ArrowDown"
			];

			if (movingKeys.indexOf(keys[i]) !== -1){
				this.isMoving = true;
			}

			switch(keys[i]){

				case "ArrowLeft":
					
					this.currentAnimation = "runSide";
					this.x -= this.speed * delta;

					break;

				case "ArrowUp":

					this.currentAnimation = "runUp";
					this.y -= this.speed * delta;
					break;

				case "ArrowDown":
					this.currentAnimation = "runDown";
					this.y += this.speed * delta;
					break;

				case "ArrowRight":
					this.currentAnimation = "runSide";
					this.x += this.speed * delta;
					this.mirror = true;
					break;

			}
		}

	},

	update: function(){

		// checks for animation change
		if (this.isMoving){
			this.isMoving = false;

			if (new Date().getTime() - this.lastAnimChange > this.animationDelay){
				this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.animations[this.currentAnimation].length;
				this.lastAnimChange = new Date().getTime();
			}

		}

	},

	draw: function(ctx){

		var spriteSet = sprites.player;
		var spriteName = this.animations[this.currentAnimation][this.currentSpriteIndex];

		var sprite = spriteSet[spriteName].slice();
		if (this.mirror){

			sprite.reverse();

		}

		drawSprite(ctx, sprite, this.x, this.y, this.s);

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