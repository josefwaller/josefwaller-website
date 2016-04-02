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
	
	draw: function(ctx){
		this.superRender(ctx);
	}
})