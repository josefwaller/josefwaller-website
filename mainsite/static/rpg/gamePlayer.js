var GamePlayer = Class({

	canvas: null,
	ctx: null,

	init: function(p){

		this.canvas = $("#game-canvas");
		this.ctx = CTXPro({
			canvas: this.canvas,
			w: 100,
			h: 100
		});

	}

})