var ScrollBar = new Class({

	x: 0,
	y: 0,
	w: 0,
	h: 0,

	text: 0,

	value: 0,

	init: function(p) {

		this.x = p.x;
		this.y = p.y;
		this.w = p.w;
		this.h = p.h;

		this.text = p.text;

	},

	draw: function(ctx) {

		// Draws line
		ctx.fillStyle = "#000000";
		ctx.fillRect(
			this.x,
			Math.round(this.y + this.w / 2),
			this.w,
			1);

	}
})