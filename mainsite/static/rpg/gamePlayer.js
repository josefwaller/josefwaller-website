var GamePlayer = Class({

	canvas: null,
	ctx: null,

	activeArea: {
		x: 1,
		y: 1
	},

	s: 100,

	init: function(p){

		this.canvas = $("#game-canvas");
		this.ctx = CTXPro({
			canvas: this.canvas,
			w: this.s,
			h: this.s
		});

	},

	update: function(){
		
		// draws the area the player is in
		var area = level[this.activeArea.x][this.activeArea.y];

		drawSprite(
			this.ctx,
			sprites.backgrounds[area.background],
			0,
			0,
			this.s);

	},

	onClick:function(){},
	onMouseUp: function(){},
	onMouseHold: function(){},
	onMiddleClick: function(){}

});