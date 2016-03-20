// both melee and ranged
// will just change the player's status when hit

var Item = new Class({

	x: 0,
	y: 0,
	s: 0,
	area: {},

	type: 0,

	parent: null,

	isUsed: false,

	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.s = p.s;

		// copies the area to not get a reference, which would change with each item
		this.area = JSON.parse(JSON.stringify(p.area));

		// Either 'melee' or 'ranged'
		this.type = p.type;

		// the GamePlayer which this item belongs to
		this.parent = p.parent;
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

	},

	// get set functions
	getArea: function(){
		return this.area;
	}

});