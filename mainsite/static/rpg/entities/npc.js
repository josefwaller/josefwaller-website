var NPC = Class({

	SUPERCLASS: Entity,

	sprites: [

		"stand"

	],

	type: 0,

	init: function(p){

		this.type = p.type;

		switch(this.type){
			case 1:
				this.spriteSetName = "npcOne";
				break;

			case 2:
				this.spriteSetName = "npcTwo";
				break;

			case 3:
				this.spriteSetName = "npcThree";
				break;
		}

	},
	update: function(){

		// checks if the player is within range
		var range = this.s;
		var p = this.parent.getPlayer();
		var playerPos = p.getPos();

		// initially sets dialog to false
		p.setHasDialog(false, null);

		var difX = this.x - playerPos.x;
		var difY = this.y - playerPos.y;
		var difTotal = Math.sqrt(Math.pow(difX, 2) + Math.pow(difY, 2));	

		if (difTotal <= range){

			// tells the player it has dialog
			p.setHasDialog(true, this.type);
		}

	},
	draw: function(ctx){
		this.superRender(ctx);
	}
})