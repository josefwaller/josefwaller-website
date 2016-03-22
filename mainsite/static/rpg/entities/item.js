// both melee and ranged
// will just change the player's status when hit

var Item = new Class({

	SUPERCLASS: Entity,

	type: 0,

	isUsed: false,

	init: function(p){

		// Either 'melee' or 'ranged'
		this.type = p.type;
	},

	update: function(){

		if (!this.isUsed){
			this.checkForPlayer();
		}
	},

	checkForPlayer: function(){

		var playerPos = this.parent.player.getPos();
		var playerS = this.parent.player.getSize();

		// checks if they are hitting
		if (playerPos.x + playerS > this.x){
			if (playerPos.x < this.x + this.s){
				if (playerPos.y + playerS > this.y){
					if (playerPos.y < this.y + this.s){

						this.onPickUp();

					}
				}
			}
		}

	},

	onPickUp: function(){

		this.isUsed = true;
		this.parent.player.hasTool[this.type] = true;
		this.parent.player.selectedTool = this.type;

	},

	draw: function(ctx){

		if (!this.isUsed){

			var sprite = sprites[this.type + "Weapon"].onGround;

			drawSprite(
				ctx,
				sprite,
				this.x,
				this.y,
				this.s);
		}

	}

});