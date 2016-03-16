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

	currentSpriteIndex: 0,

	currentAnimation: "runDown",


	init: function(p){
			
		this.x = p.x;
		this.y = p.y;
		this.s = p.s;

	},

	onKey: function(keys, delta){
		// takes an array of keys

		for (var i = 0; i < keys.length; i++){

			switch(keys[i]){

				case "ArrowLeft":
					
					this.currentAnimation = "runSide";
					// this.x -= this.speed * delta;

					break;

			}
		}

	},

	update: function(){

	},

	draw: function(ctx){

		var spriteSet = sprites.player;
		var spriteName = this.animations[this.currentAnimation][this.currentSpriteIndex];

		console.log(spriteName);

		var sprite = spriteSet[spriteName];

		console.log(sprite);
		drawSprite(ctx, sprite, this.x, this.y, this.s);

	}
})