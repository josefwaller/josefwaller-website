var Goal = Class({
	SUPERCLASS: Entity,

	spriteSetName: "goal",
	sprites: [
		"onGround"
	],

	init: function(p){
	},

	update: function(){
		var player = this.parent.getPlayer();

		if (this.checkForCollision(player)){
			player.onWin();
			this.parent.onWin();
		}
	},
	draw: function(ctx){
		this.superRender(ctx);
	}
});