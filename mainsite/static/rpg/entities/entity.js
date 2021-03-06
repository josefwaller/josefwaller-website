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

		// the GamePlayer which this item belongs to
		this.parent = p.parent;

		if (Object.keys(p).indexOf("area") !== -1){
			// copies the area to not get a reference, which would change with each item
			this.area = JSON.parse(JSON.stringify(p.area));
		}
	},

	superMove: function(x, y){

		// checks it does not hit a barrier

		// records its previous location so that it can move back if needed
		var prev = {
			x: this.x,
			y: this.y
		}

		var translate = {
			x: x,
			y: y
		}

		var s = this.parent.getAreaSize();

		for (var t in translate){

			// moves
			this[t] += this.speed * translate[t] * delta;


			// checks that the player does not run out of bounds
			// stops him/her one pixel out, so that it will still 
			// trigger the scroll
			// if the player cannot scroll because there is a barrier there
			// this stops him/her from running off of the screen
			if (this[t] < -1){
				this[t] = -1;
			}else if (this[t] > s - this.s + 1){
				this[t] = s - this.s + 1;
			}

			// checks it does not hit a barrier
			var bars = this.parent.getBarriers();
			for (var i = 0; i < bars.length; i++){
				var b = bars[i];
				if (this.isInSameArea(b) && b.getHealth() > 0){
					if (this.basicCheckForCollision(b)){

						this[t] = prev[t];
						break;
					}
				}
			}
		}
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

			this.lastAnimChange = time;
		}
			
		if (this.currentSpriteIndex >= this.currentAnimation.length){
			this.currentSpriteIndex = 0;
		}

	},

	isInSameArea: function(entity){

		var entityArea = entity.getArea();
		if (entityArea.x === this.area.x && entityArea.y === this.area.y){
			return true;
		}

		return false;
	},
	basicCheckForCollision: function(e){

		ePos = e.getPos();
		eS = e.getSize();

		if (this.x + this.s > ePos.x){
			if (this.x < ePos.x + eS){
				if (this.y + this.s > ePos.y){
					if (this.y < ePos.y + eS){
						return true;
					}
				}
			}
		}

		return false;

	},
	checkForCollision: function(e){

		ePos = e.getPos();
		eS = e.getSize();
		eSprite = e.getCurrentSprite();

		var result = checkEntitiesForCollision(
			this.x, this.y, this.s, this.getCurrentSprite(),
			ePos.x, ePos.y, eS, eSprite);

		return result;

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
	},

	getCurrentSprite: function(){
		return sprites[this.spriteSetName][this.sprites[this.currentAnimation[this.currentSpriteIndex]]];
	}

});