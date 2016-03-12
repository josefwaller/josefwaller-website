// Whether or not a button is hovering
var hover = false;

var Button = new Class({
	x: 0,
	y: 0,
	w: 0,
	h: 0,

	color: null,

	onClick: null,

	font: null,
	fontSize: 0,

	param: null,

	init: function(p) {
		this.x = p.x;
		this.y = p.y;
		this.w = p.w;
		this.h = p.h;

		this.color = btnColors.color;
		this.hoverColor = btnColors.hover;

		this.text = p.text;
		this.textColor = btnColors.text;

		if (p.param !== null){
			this.param = p.param;
		}

		this.font = "Raleway";

		this.fontSize = 11;

		this.onClick = p.onClick;
	},

	checkForClick: function(mouseX, mouseY){

		if (this.x <= mouseX && this.x + this.w > mouseX){

			if (this.y <= mouseY && this.y + this.h > mouseY){

				if (this.param !== null){

					this.onClick(this.param);

				}else {
					
					this.onClick();
				}
			}
		}

	},

	draw: function(ctx, mouseX, mouseY) {

		color = this.color;

		// checks if the mouse is over the button

		if (this.x <= mouseX && this.x + this.w > mouseX){
			if (this.y <= mouseY && this.y + this.h > mouseY){

				// changes to hover color
				color = this.hoverColor;

				// changes the mouse to pointer
				$(document.body).css("cursor", "pointer");
			}
		}

		// Fills the initial rect  
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.w, this.h);

		// Draws text if it has any
		if (this.text){
			color = this.textColor;
			if (this.x <= mouseX && this.x + this.w > mouseX){
				if (this.y <= mouseY && this.y + this.h > mouseY){

					color = this.hoverColor;
				}
			}

			// Draws text
			ctx.fillStyle = this.textColor;
			ctx.setFont(this.fontSize, this.font);
			
			x = this.x + (this.w - ctx.measureText(this.text, this.fontSize + "px " + this.font).width) / 2;
			y = this.y + this.h / 2;
			ctx.fillText(this.text, x, y);
		}
	}
})