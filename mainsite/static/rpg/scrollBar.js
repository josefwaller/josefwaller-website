var ScrollBar = new Class({

	x: 0,
	y: 0,
	w: 0,
	h: 0,

	text: 0,

	value: 0.5,
	radius: 10,

	isSelected: false,

	init: function(p) {

		this.x = p.x;
		this.y = p.y;
		this.w = p.w;
		this.h = p.h;

		this.text = p.text;

	},
	onClick: function(mouseX, mouseY){

		x = this.x + this.value * this.w;
		y = this.y + this.h / 2;

		distanceX = Math.abs(x - mouseX);
		distanceY = Math.abs(y - mouseY);

		distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

		if (distance <= this.radius){
			this.isSelected = true;
		}

	},

	onMouseHold: function(mouseX, mouseY){
		if (this.isSelected){
			x = mouseX - this.x;
			value = x / this.w;

			if (value < 0){
				value = 0;
			}else if (value > 1){
				value = 1;
			}
			this.value = value;
			return this.value;
		}

		return false;
	},

	draw: function(ctx) {

		// Draws text
		ctx.font = "10px 'Press Start 2P'";
		ctx.fillText(this.text, this.x + (this.w - ctx.measureText(this.text).width) / 2, this.y);

		// Draws line
		ctx.fillStyle = "#000000";
		ctx.fillRect(
			this.x,
			Math.round(this.y + this.h / 2),
			this.w,
			2);

		circleX = this.x + (this.value * this.w);
		circleY = this.y + this.h / 2;

		// Draws circle
		ctx.beginPath();
		ctx.arc(circleX, circleY, this.radius, 0, 2 * Math.PI);
		ctx.fill();

	}
})