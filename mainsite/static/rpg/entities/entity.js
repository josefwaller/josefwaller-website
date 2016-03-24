var Entity = Class({

	x: 0,
	y: 0,
	s: 0,

	area: null,
	parent: null,

	// animation variables
	spriteSetName: "",
	animations: [],
	currentAnimation: [0],
	currentSpriteIndex: 0,
	lastAnimChange: 0,
	animationDelay: 1,

	mirror: false,

	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.s = p.s;

		if ("area" in p){
			// copies the area to not get a reference, which would change with each item
			this.area = JSON.parse(JSON.stringify(p.area));
		}

		// the GamePlayer which this item belongs to
		this.parent = p.parent;
	},

	superRender: function(ctx) {

		var spriteSet = sprites[this.spriteSetName];
		var spriteName = this.sprites[this.currentAnimation[this.currentSpriteIndex]];

		var sprite = spriteSet[spriteName].slice();
		if (this.mirror){

			sprite.reverse();

		}

		drawSprite(ctx, sprite, this.x, this.y, this.s);
	},

	checkForAnimChange: function(){


		// checks if it needs to change the animation sprite
		var time = new Date().getTime();
		if (time - this.lastAnimChange >= this.animationDelay){

			this.currentSpriteIndex++;
			
			if (this.currentSpriteIndex >= this.currentAnimation.length){
				this.currentSpriteIndex = 0;
			}

			this.lastAnimChange = time;
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
	},

	getArea: function(){
		return this.area;
	}

});