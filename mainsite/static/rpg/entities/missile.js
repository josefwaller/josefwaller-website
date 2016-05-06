var Missile = Class({

	SUPERCLASS: Entity,

	isEnemy: false,

	spriteSetName: "",
	
	sprites: [
		"missile"
	],

	speed: 100,

	init: function(p){

		this.isEnemy = p.isEnemy;
		this.direction = p.direction;

		this.spriteSetName = p.type;
	},

	update: function(){

		// moves
		switch(this.direction){

			case this.dirs.up:
				this.y -= this.speed * delta;
				break;

			case this.dirs.down:
				this.y += this.speed * delta;
				break;

			case this.dirs.left:
				this.x -= this.speed * delta;
				break;

			case this.dirs.right:
				this.x += this.speed * delta;
				break;
		}

		// checks if it hits an enemy or the player
		if (!this.isEnemy){

			var enemies = this.parent.getEnemies();

			for (var i = 0; i < enemies.length; i++){

				if (this.isInSameArea(enemies[i])){

					if (enemies[i].getIsAlive() === true){

						if (this.checkForCollision(enemies[i])){

							enemies[i].onHit();

							// removes self
							this.parent.removeMissile(this);

							break;

						}
					}

				}

			}
		}else {

			var player = this.parent.getPlayer();

			if (this.checkForCollision(player)){
				player.onHit();
				this.parent.removeMissile(this);
			}

		}

		this.checkForOutOfBounds();

	},

	checkForOutOfBounds: function(){

		var areaSize = this.parent.getAreaSize();

		if (this.x + this.s <= 0 || this.x > areaSize){
			this.parent.removeMissile(this);
			return;
		}

		if (this.y + this.s <= 0 || this.y > areaSize){
			this.parent.removeMissile(this);
			return;
		}
	},

	draw: function(ctx){	

		var transX = this.x + this.s / 2;
		var transY = this.y + this.s / 2;
		
		
		// rotates
		var rotation;

		switch(this.direction){
			
			case this.dirs.left:
				// no rotation needed
				rotation = 0;
				break;
			case this.dirs.up:
				rotation = 0.5 * Math.PI;
				break;

			case this.dirs.right:
				rotation = Math.PI;
				break;

			case this.dirs.down:
				rotation = 1.5 * Math.PI;
				break;

		}


		// moves to the middle of the sprite
		ctx.translate(transX, transY);
		ctx.rotate(rotation);
		ctx.translate(- transX, - transY);

		this.superRender(ctx);

		// resets
		ctx.translate(transX, transY);
		ctx.rotate(-rotation);
		ctx.translate(- transX, - transY);
	}

});