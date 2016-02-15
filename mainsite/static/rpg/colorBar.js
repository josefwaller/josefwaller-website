var ColorBar = Class({
	x: 0,
	y: 0,
	w: 0,
	h: 0,

	crosshairX: 0,
	crosshairY: 0,

	img: null,

	init: function(p) {

		this.x = p.x;
		this.y = p.y;
		this.w = p.w;
		this.h = p.h;

		this.crosshairX = this.x;
		this.crosshairY = this.y + this.h / 2;

		this.img = p.img;

	},

	draw: function(ctx, colors){


		if (this.img != null){
			ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
		}else {

			for (var i = 0; i < this.w; i++){

				percentage = (i / this.w);

				partPercentage = percentage * (colors.length - 1)

				index = Math.floor((colors.length - 1) * percentage)
				startColor = colors[index]
				if (percentage == 1){
					endcolor = colors[index];
				}else {
					endColor = colors[index + 1];
				}

				color = {
					red: Math.round((startColor.r * ((colors.length - 1) - partPercentage) + endColor.r * partPercentage)),
					green: Math.round((startColor.g * ((colors.length - 1) - partPercentage) + endColor.g * partPercentage)),
					blue: Math.round((startColor.b * ((colors.length - 1) - partPercentage) + endColor.b * partPercentage))
				};

				hexColor = "#" + toHex(color.red) + toHex(color.green) + toHex(color.blue);

				ctx.fillStyle = hexColor;
				ctx.fillRect(this.x + i, this.y, this.w - i, this.h);
			}
		}


		// Draws the crosshair
		crosshairLength = 10
		ctx.fillStyle = "#000000";
		ctx.fillRect(
			this.crosshairX + 2,
			this.crosshairY - 1,
			crosshairLength,
			2
		);
		ctx.fillRect(
			this.crosshairX - 2 - crosshairLength,
			this.crosshairY - 1,
			crosshairLength,
			2
		);
		ctx.fillRect(
			this.crosshairX - 1,
			this.crosshairY + 2,
			2,
			crosshairLength
		);
		ctx.fillRect(
			this.crosshairX - 1,
			this.crosshairY - 2 - crosshairLength,
			2,
			crosshairLength
		);

	},

	onHold: function(ctx, mouseX, mouseY, onSuccess){

		if (this.isSelected){

			// Checks if the mouse is on the gradiant
			// if not, places the crosshair at the appropriate end 
			if (mouseX > this.x){
				if (mouseX < this.x + this.w){
					outputX = mouseX;
				}else {

					outputX = this.x + this.w;
				}
			}else {
				outputX = this.x;
			}

			this.crosshairX = outputX;
			this.crosshairY = this.y + this.h / 2;

			percentage = (outputX - this.x) / this.w;
			onSuccess(percentage);
		}
	},

	checkForSelection: function(mouseX, mouseY){

		// Checks if the mouse is on the color gradient
		if (mouseX > this.x && mouseX < this.x + this.w){

			if (mouseY > this.y && mouseY < this.y + this.h){

				this.isSelected = true;
			}
		}
	},

	setCrosshairs: function(percentage) {
		this.crosshairX = this.x + this.w * percentage;
	}
})