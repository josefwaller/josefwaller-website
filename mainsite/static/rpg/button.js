var Button = new Class({
	x: 0,
	y: 0,
	w: 0,
	h: 0,

	color: null,

	onClick: null,

	init: function(p) {
		this.x = p.x;
		this.y = p.y;
		this.w = p.w;
		this.h = p.h;

		if (p.color !== null){
			this.color = p.color;
		}else {
			this.color = null;
		}
		if (p.text){
			this.text = p.text;
			this.font = p.font;
			this.textColor = p.textColor;
		}

		this.onClick = p.onClick;
	},

	checkForClick: function(mouseX, mouseY){

		if (this.x <= mouseX && this.x + this.w > mouseX){
			if (this.y <= mouseY && this.y + this.h > mouseY){
				this.onClick();
			}
		}

	},

	draw: function(ctx) {

		if (this.color !== null){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}

		if (this.text){
			ctx.fillStyle = this.textColor;
			ctx.font = this.font;
			x = this.x + (this.w - ctx.measureText(this.text).width) / 2;
			y = this.y + 20;

			ctx.fillText(this.text, x, y);
		}
	}
})