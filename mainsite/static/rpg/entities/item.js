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

		// checks if they are hitting
		if (this.checkForCollision(this.parent.getPlayer())){

			this.onPickUp();
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

	},

	// get set
	getCurrentSprite: function(){
		return sprites[this.type + "Weapon"].onGround;
	}

});