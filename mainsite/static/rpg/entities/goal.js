var Goal = Class({
	SUPERCLASS: Entity,

	spriteSetName: "goal",
	sprites: [
		"onGround"
	],

	used: false,

	init: function(p){
	},

	update: function(){
		var player = this.parent.getPlayer();

		if (!this.used){
			if (this.checkForCollision(player)){
				player.onWin();
				this.parent.onWin();
				this.used = true;
			}
		}
	},
	draw: function(ctx){
		this.superRender(ctx);
	}
});