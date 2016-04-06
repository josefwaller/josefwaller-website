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
		var range = this.s / 2;
		var p = this.parent.getPlayer();
		var playerPos = p.getPos();
		var playerSize = p.getSize();

		// initially sets dialog to false
		p.setHasDialog(false, null);

		if (playerPos.x + playerSize > this.x - range){
			if (playerPos.x < this.x + this.s + range){
				if (playerPos.y + playerSize > this.y + this.s){
					if (playerPos.y < this.y + this.s + range){

						// show pop up asking if player wants to talk


						// tells the player it has dialog
						p.setHasDialog(true, this.type);

					}
				}
			}
		}

	},
	draw: function(ctx){
		this.superRender(ctx);
	}
})