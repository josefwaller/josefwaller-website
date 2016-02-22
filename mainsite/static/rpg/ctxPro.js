var CTXPro = Class({

	canvas: null,
	ctx: null,

	unit: 0,
	fillStyle: "#ffffff",

	globalAlpha: 1,
	font: "10px Arial",

	init: function(p) {

		this.ctx = p.canvas[0].getContext("2d");
		this.unit = p.canvas.width() / p.w;

		this.ctx.setTransform(this.unit, 0, 0, this.unit, 0, 0);

		// Sets inner dimension

		p.canvas.height((p.canvas.width() / p.w) * p.h);

		p.canvas[0].width = p.canvas.width();
		p.canvas[0].height = p.canvas.height();
	},	
	fillRect: function(x, y, w, h){

		this.ctx.globalAlpha = this.globalAlpha;

		this.ctx.fillStyle = this.fillStyle;
		this.ctx.fillRect(
			Math.round(x * this.unit), 
			Math.round(y * this.unit), 
			Math.round(w * this.unit), 
			Math.round(h * this.unit));
	},
	fillRoundedRect: function(x, y, w, h, r){

		// Draws two base rects
		this.ctx.fillStyle = this.fillStyle;
		this.fillRect(
			x + r,
			y,
			w - 2 * r,
			h);
		this.fillRect(
			x,
			y + r,
			w,
			h - 2 * r);

		// draws corners
		this.fillArc(x + r, y + r, r, 0, 2 * Math.PI);

		this.fillArc(x + w - r - 1, y + r, r, 0, 2 * Math.PI);

		this.fillArc(x + w - r - 1, y + h - r - 1, r, 0, 2 * Math.PI);

		this.fillArc(x + r, y + h - r - 1, r, 0, 2 * Math.PI);

	},
	drawImage: function(img, x, y, w, h){

		this.ctx.drawImage(
			img,
			Math.round(x * this.unit),
			Math.round(y * this.unit),
			Math.round(w * this.unit),
			Math.round(h * this.unit));
	},
	measureText: function(text, font){
		if (font !== null){
			this.ctx.font = font;
		}
		return this.ctx.measureText(text);
	},
	getFontString: function(size, font){
		return size + "px " + font;
	},
	setFont: function(size, font){
		this.font = Math.round(size * this.unit) + "px " + font;
		this.ctx.font = this.font;
	},
	fillText: function(text, x, y){


		this.ctx.textBaseline = "middle";

		this.ctx.fillStyle = this.fillStyle;
		this.ctx.font = this.font;
		this.ctx.fillText(
			text, 
			Math.round(x * this.unit), 
			Math.round(y * this.unit));
	},
	fillArc: function(x, y, r, sA, eA){

		this.ctx.fillStyle = this.fillStyle;
		this.ctx.beginPath();
		this.ctx.arc(
			Math.round(x * this.unit), 
			Math.round(y * this.unit), 
			Math.round(r * this.unit), 
			sA, 
			eA);
		this.ctx.fill();
	}
});