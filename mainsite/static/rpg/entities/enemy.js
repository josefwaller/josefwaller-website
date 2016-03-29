var Enemy = Class({
	SUPERCLASS: Entity,

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

	init: function(p){

	},

	onHit: function(){

		if (!this.isDying && !this.isDead){

			this.isDying = true;
			this.dieTime = new Date().getTime();
			this.currentAnimation = this.animations.die;
			this.lastAnimChange = this.dieTime;
			this.animationDelay = 100;
			this.currentSpriteIndex = 0;
		}

	},

	getIsAlive: function(){
		return this.isAlive;
	}

});