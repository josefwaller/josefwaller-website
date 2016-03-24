var CTXPro = Class({

	canvas: null,
	ctx: null,

	unit: 0,
	fillStyle: "#ffffff",

	globalAlpha: 1,
	font: "10px Arial",

	init: function(p) {

		this.canvas = p.canvas;
		this.ctx = p.canvas[0].getContext("2d");
		this.unit = p.canvas.width() / p.w;

		this.ctx.setTransform(this.unit, 0, 0, this.unit, 0, 0);

		// Sets inner dimension

		p.canvas.height((p.canvas.width() / p.w) * p.h);

		p.canvas[0].width = p.canvas.width();
		p.canvas[0].height = p.canvas.height();
	},
	resizeCanvas: function(x, y){

		var ratio;

		if (x == null){

			ratio = this.canvas.height() / this.canvas.width();

			x = y * ratio;

		}else {

			ratio = this.canvas.width() / this.canvas.height();

			y = x * ratio;
		}

		this.canvas.width(x * this.unit);
		this.canvas.height(y * this.unit);

		this.canvas[0].width = x;
		this.canvas[0].height = y;

	},
	fillRect: function(x, y, w, h){

		this.ctx.globalAlpha = this.globalAlpha;

		this.ctx.fillStyle = this.fillStyle;
		this.ctx.fillRect(
			Math.ceil(x * this.unit), 
			Math.ceil(y * this.unit), 
			Math.ceil(w * this.unit), 
			Math.ceil(h * this.unit));
	},
	fillRoundedRect: function(x, y, w, h, r){

		// Round to nearest units

		x = Math.round(x * this.unit);
		y = Math.round(y * this.unit);
		w = Math.round(w * this.unit);
		h = Math.round(h * this.unit);
		r = Math.round(r * this.unit);

		// Draws two base rects
		this.ctx.fillStyle = this.fillStyle;
		
		// draws the rect
		this.ctx.beginPath();

		// starts at top right corner after the curve
		this.ctx.moveTo(x + r, y);

		// top line
		this.ctx.lineTo(x + w - r, y);

		// top right corner
		this.ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);

		// right line
		this.ctx.lineTo(x + w, y + h - r);

		// bottom right corner
		this.ctx.arc(x + w - r, y + h - r, r, 0 * Math.PI, 0.5 * Math.PI);

		// bottom line
		this.ctx.lineTo(x + r, y + h);

		// bottom left corner
		this.ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, 1 * Math.PI);

		// left line
		this.ctx.lineTo(x, y + r);

		// top left corner
		this.ctx.arc(x + r, y + r, r, 1 * Math.PI, 1.5 * Math.PI);

		this.ctx.fill();

	},
	fillTriangle: function(x, y, s, isSideways){


		x = Math.round(x * this.unit);
		y = Math.round(y * this.unit);
		s = Math.round(s * this.unit);

		this.ctx.fillStyle = this.fillStyle;

		this.ctx.beginPath();
		if (isSideways){

			this.ctx.moveTo(x + (s / 2), y);
			this.ctx.lineTo(x - (s / 2), y + (s / 2));
			this.ctx.lineTo(x - (s / 2), y - (s / 2));

		}else {

			this.ctx.moveTo(x, y - (s / 2));
			this.ctx.lineTo(x + (s / 2), y + (s / 2));
			this.ctx.lineTo(x - (s / 2), y + (s / 2));
		}

		this.ctx.fill();

		console.log(x, y, s);

	},
	borderRect: function(x, y, w, h, thick){

		// top line
		this.fillRect(
			x,
			y,
			w,
			thick);

		// right line
		this.fillRect(
			x + w - thick,
			y,
			thick,
			h);

		// bottom line
		this.fillRect(
			x,
			y + h - thick,
			w,
			thick);

		// left line
		this.fillRect(
			x,
			y,
			thick,
			h);

	},
	moveTo: function(x, y){
		this.ctx.moveTo(
			Math.round(x * this.unit),
			Math.round(y * this.unit)
		);
	},
	lineTo: function(x, y){
		this.ctx.lineTo(
			Math.round(x * this.unit),
			Math.round(y * this.unit)
		);
	},
	beginPath: function(){
		this.ctx.beginPath();
	},
	fill: function(){
		this.ctx.fillStyle = this.fillStyle;
		this.ctx.fill();
	},
	arc: function(x, y, r, sA, eA) {

		this.ctx.arc(
			x, 
			y, 
			r,
			sA * Math.PI, 
			eA * Math.PI);
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
			Math.ceil(x * this.unit), 
			Math.ceil(y * this.unit), 
			Math.ceil(r * this.unit), 
			sA, 
			eA);
		this.ctx.fill();
	}
});