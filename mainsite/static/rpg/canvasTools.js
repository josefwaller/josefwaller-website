var CanvasTools = Class({

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
	drawRoundedRect: function(x, y, w, h, r){

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
		this.ctx.font = font;
		return this.ctx.measureText(text);
	},
	setFont: function(size, font){
		this.font = Math.round(size * this.unit) + "px " + font;
		this.ctx.font = this.font;
	},
	fillText: function(text, x, y){

		this.ctx.fillStyle = this.fillStyle;
		this.ctx.font = this.font;
		this.ctx.fillText(
			text, 
			Math.round(x * this.unit), 
			Math.round(y * this.unit));
	}

});