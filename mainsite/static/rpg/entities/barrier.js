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

	onHit: function(){
		if (this.isBreakable && this.health > 0){
			this.health -= 1;

			// changes sprite
			this.currentAnimation = [2 - this.health];
		}
	},

	draw: function(ctx){
		this.superRender(ctx);
	},

	// get set
	getHealth: function(){
		return this.health;
	}
})