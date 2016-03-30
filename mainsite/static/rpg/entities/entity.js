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

	direction: 0,

	// the different directions, named for easy reading
	dirs: {
		up: 0,
		right: 1,
		down: 2,
		left: 3
	},

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
			
		if (this.currentSpriteIndex >= this.currentAnimation.length){
			this.currentSpriteIndex = 0;
		}

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

			this.lastAnimChange = time;
		}
	},

	isInSameArea: function(entity){

		var entityArea = entity.getArea();

		if (entityArea.x === this.area.x && entityArea.y === this.area.y){
			return true;
		}

		return false;
	},
	checkForCollision: function(e){

		ePos = e.getPos();
		eS = e.getSize();

		if (ePos.x + eS > this.x){
			if (ePos.x < this.x + this.s){
				if (ePos.y + eS > this.y){
					if (ePos.y < this.y + this.s){
						return true;
					}
				}
			}
		}

		return false;

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