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
			this.hoverColor = p.hoverColor;
		}else {
			this.color = null;
		}
		if (p.text){
			this.text = p.text;
			this.textColor = p.textColor;
			this.hoverTextColor = p.hoverTextColor;
			this.font = p.font;
			this.textY = p.textY;

			if (p.textY === null){

				this.textY = this.y + this.h / 2;
			}

			if (p.fontSize !== null){
				this.font = p.fontSize + "px " + this.font;
				// 20px 'Press Start 2P' for example

				this.textY += p.fontSize / 2;
			}
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

	draw: function(ctx, mouseX, mouseY) {

		if (this.color !== null){

			color = this.color;
			if (this.x <= mouseX && this.x + this.w > mouseX){
				if (this.y <= mouseY && this.y + this.h > mouseY){

					color = this.hoverColor;
				}
			}
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}

		if (this.text){
			color = this.textColor;
			if (this.x <= mouseX && this.x + this.w > mouseX){
				if (this.y <= mouseY && this.y + this.h > mouseY){

					color = this.hoverColor;
				}
			}
			ctx.fillStyle = this.textColor;
			ctx.font = this.font;
			x = this.x + (this.w - ctx.measureText(this.text).width) / 2;
			y = this.textY;

			ctx.fillText(this.text, x, y);
		}
	}
})