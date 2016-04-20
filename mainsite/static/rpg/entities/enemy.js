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

	speed: 20,

	isDying: false,
	dieTime: 0,
	isDead: false,

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

	die: function(){
		
		this.isMirrored = false;

		this.checkForAnimChange();

		if (new Date().getTime() - this.dieTime >= 2 * this.animationDelay){

			this.isDead = true;

		}
	},

	getIsAlive: function(){
		return (!this.isDead);
	}

});