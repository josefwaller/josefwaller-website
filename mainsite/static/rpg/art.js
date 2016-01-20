var Art = Class({
	canvas: null,
	ctx: null,

	w: 600,
	h: null,

	size: 0,

	init: function(size) {
		this.canvas = $("#art-canvas");
		this.ctx = this.canvas[0].getContext("2d");

		this.h = (this.canvas.height() / this.canvas.width()) * this.w

		this.canvas[0].width = this.w;
		this.canvas[0].height = this.h;

		this.size = size

		// Sets the button's colors
		colorButtons = $("#color-btns");
		console.log(colorButtons)
		for (i = 0; i < colorButtons.children().length; i++){
			div = $(colorButtons.children()[i]);
			
			div.css("background-color", colors[i])
			div.html(colors[i])
			div.click({colorIndex: i, a:div}, function(event){

				colorIndex = event.data.colorIndex
				colors[colorIndex] = prompt("Enter color");
				a = $("#color-btns").children().eq(colorIndex);
				a.html(colors[colorIndex])
				a.css({"background-color": colors[colorIndex]})
			})
		}
	},

	update: function() {
		this.draw();
	},

	draw: function() {

		// Gets ctx for reference
		ctx = this.ctx;

		// Draws background
		ctx.fillStyle = "#404040"
		ctx.fillRect(0, 0, this.w, this.h)

		// Draws white background
		offsetX = this.w * (1/8)
		offsetY = this.h * (1/20)
		pixelSize = (this.h - 2 * offsetY) / size;

		ctx.fillStyle = "#bcd5da";
		ctx.fillRect(offsetX, offsetY, this.size * pixelSize, this.size * pixelSize)

		// Draws grid
		for (i = 0; i <= this.size; i++){

			ctx.fillStyle = "#1e1e1e";

			// Draws x line
			ctx.fillRect(
				offsetX + pixelSize * i, 
				offsetY, 
				1, 
				this.size * pixelSize);

			// Draws y line
			ctx.fillRect(
				offsetX, 
				offsetY + pixelSize * i, 
				this.size * pixelSize, 
				1);

		}

		// Gets the pixel the mouse is hovering on
		mouseX = (mousePos.x - (pixelSize / 2) - this.canvas.offset().left) / this.canvas.width() * this.canvas[0].width
		mouseY = (mousePos.y - (pixelSize / 2) - this.canvas.offset().top) / this.canvas.height() * this.canvas[0].height

		if (mouseX > offsetX && mouseX < offsetX + (this.size - 1) * pixelSize){
			if (mouseY > offsetY && mouseY < offsetY + (this.size - 1) * pixelSize){
				// Draws highlighted pixel
				pixelX = Math.round((mouseX - offsetX) / pixelSize)
				pixelY = Math.round((mouseY - offsetY) / pixelSize)

				// Draws the highlighted pixel
				ctx.fillStyle = "#ffffff"
				ctx.fillRect(
					offsetX + pixelX * pixelSize,
					offsetY + pixelY * pixelSize,
					pixelSize + 1,
					pixelSize + 1)
			}
		}

	}
})