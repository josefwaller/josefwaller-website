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
	checkForCollision: function(e){

		ePos = e.getPos();
		eS = e.getSize();

		if (ePos.x + eS > this.x){
			if (ePos.x < this.x + this.s){
				if (ePos.y + eS > this.y){
					if (ePos.y < this.y + this.s){

						// the blocks are colliding, so it checks if any pixels collide as well
						var pixelSize = this.s / size;
						var offX = Math.floor((this.x - ePos.x) / pixelSize);
						var offY = Math.floor((this.y - ePos.y) / pixelSize);

						// the indexes to start and end at
						// the only relevent pixels, the ones that have a chance of hitting each other
						var startX;
						var startY;
						var endX;
						var endY;
						
						if (ePos.x > this.x){
							// if the entity is farther right than thios entity, it can skip the first offX pixels
							startX = - offX;
							endX = size;

						}else if (this.x > ePos.x){

							startX = 0;
							endX = offX;

						}else {
							startX = 0;
							endX = size;
						}

						// does the same for Y
						if (ePos.y > this.y){
							startY = - offY;
							endY = size;
						}else if (this.y > ePos.y){
							startY = 0;
							endY = offY;
						}else {
							startY = 0;
							endY = size;
						}

						// gets the current sprite
						var thisSprite = this.getCurrentSprite();
						var otherSprite = e.getCurrentSprite();


						// cycles through and checks if any pixels hit
						for (var thisX = startX; thisX < endX; thisX++){
							for (var thisY = startY; thisY < endY; thisY++){

								if (thisSprite[thisX][thisY] !== null){

									for (var otherX = size - startX - 1; otherX >= 0; otherX--){
										for (var otherY = size - startY - 1; otherY >= 0; otherY--){

											if (otherSprite[otherX][otherY] !== null){

												// check if the pixels hit
												var thisPixelOffX = this.x + thisX * pixelSize;
												var thisPixelOffY = this.y + thisY * pixelSize;

												var otherPixelOffX = ePos.x + otherX * pixelSize;
												var otherPixelOffY = ePos.y + otherY * pixelSize;

												// checks if they hit
												if (thisPixelOffX < otherPixelOffX + pixelSize){
													if (thisPixelOffX + pixelSize > otherPixelOffX){
														if (thisPixelOffY < otherPixelOffY + pixelSize){
															if (thisPixelOffY + pixelSize > otherPixelOffY){
																return true;
															}
														}
													}
												}


											}

										}
									}
								}
							}
						}
						// return true;
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
	},

	getCurrentSprite: function(){
		return sprites[this.spriteSetName][this.sprites[this.currentAnimation[this.currentSpriteIndex]]];
	}

});