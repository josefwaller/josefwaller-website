var Barrier = Class({
	SUPERCLASS: Entity,

	spriteSetName: "",
	sprites: [],
	animations: {
		whole: [0]
	},

	health: 2,
	isBreakable: false,

	init: function(p){

		this.isBreakable = p.isBreakable;
		
		if (this.isBreakable){
			this.spriteSetName = "breakableBarrier";
			this.sprites = [
				"whole",
				"breaking",
				"broken"
			];
		}else {
			this.spriteSetName = "invincibleBarrier";
			this.sprites = [
				"whole"
			];
		}

	},

	draw: function(ctx){
		this.superRender(ctx);
	}
})