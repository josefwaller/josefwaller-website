var selectedColor = 0;
var selectedObject = "player";
var selectedSprite = "runOne";


var Art = Class({
	canvas: null,
	ctx: null,

	w: 600,
	h: null,

	red: 0,
	blue: 0,
	green: 0,

	offsetX: 0,
	offsetY: 0,

	size: 0,
	pixelSize: 0,

	mouseX: 0,
	mouseY: 0,

	barX: 0,
	barY: 0,
	barW: 0,
	barH: 0,

	colorBar: null,
	saturationBar: null,
	brightnessBar: null,

	spriteCanvases: {},
	objectCanvases: {},

	init: function(size) {

		this.canvas = $("#art-canvas");
		this.ctx = this.canvas[0].getContext("2d");

		this.h = (this.canvas.height() / this.canvas.width()) * this.w

		this.canvas[0].width = this.w;
		this.canvas[0].height = this.h;

		this.size = size
		this.offsetX = this.w * (1/10)
		this.offsetY = this.h * (1/20)
		this.pixelSize = (this.h - 2 * this.offsetY) / this.size;

		this.colorBar = new ColorBar({
			x: this.offsetX + this.pixelSize * this.size + 30, 
			y: this.offsetY, 
			w: 200, 
			h: 20,
			img: $("#gradiant")[0]
		});

		this.saturationBar = new ColorBar({
			x: this.offsetX + this.pixelSize * this.size + 30, 
			y: this.offsetY + 100, 
			w: 200, 
			h: 20,
			img: null
		});

		this.brightnessBar = new ColorBar({
			x: this.offsetX + this.pixelSize * this.size + 30,
			y: this.offsetY + 200,
			w: 200,
			h: 20,
			img: null
		});

		// Sets the button's colors
		colorButtons = $("#color-btns");

		for (i = 0; i < colorButtons.children().length; i++){
			div = $(colorButtons.children()[i]);
			
			if (colors[i].bright < 50){
				div.css("color", "#ffffff")
			}
			div.css("background-color", colors[i])
			div.html(colors[i])
			div.click({colorIndex: i}, function(event){

				art.selectColor(event.data.colorIndex);
			})
		}

		// Sets all the canvases in the sprite buttons
		spriteButtonGroup = $("#art-sprites-btns");
		for (i in sprites[selectedObject]){

			// Creates button
			button = $("<a class='btn btn-lg' id='" + i + "'></a>");
			button.click({sprite: i}, function(event) {

				sprite = event.data.sprite;
				selectedSprite = sprite;

			})
			// Creates canvas
			canvas = $("<canvas id='" + i + "-canvas'></canvas>");

			spriteButtonGroup.append(button);

			button.append(canvas);
			button.append("<br>" + i);

			// Creats manager
			this.spriteCanvases[i] = spriteCanvas({canvas: canvas, object: selectedObject, sprite: i});
			this.spriteCanvases[i].draw();
		}

		objectButtonGroup = $("#art-objects-btns");
		for (i in sprites){

			// Creates button
			button = $("<a class='btn btn-lg' id='" + i + "'></a>");
			button.click({sprite: i}, function(event) {

				sprite = event.data.sprite;
				selectedSprite = sprite;

			})
			// Creates canvas
			canvas = $("<canvas id='" + i + "-canvas'></canvas>");

			objectButtonGroup.append(button);

			button.append(canvas);
			button.append("<br>" + i);

			// Gets the first sprite
			spriteName = Object.keys(sprites[i])[0];

			// Creats manager
			this.spriteCanvases[i] = spriteCanvas({canvas: canvas, object: i, sprite: spriteName});
			this.spriteCanvases[i].draw();

		}
	},

	update: function() {
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.canvas[0].width
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.canvas[0].height

		this.draw();

	},
	onClick: function() {
		this.colorBar.checkForSelection(this.mouseX, this.mouseY);
		this.saturationBar.checkForSelection(this.mouseX, this.mouseY);
		this.brightnessBar.checkForSelection(this.mouseX, this.mouseY);

		// Checks if the mouse is on the canvas
		if (this.mouseX > this.offsetX && this.mouseX < this.offsetX + this.size * this.pixelSize){
			if (this.mouseY > this.offsetY && this.mouseY < this.offsetY + this.size * this.pixelSize){
				pixel = this.getSelectedPixel();
				sprite = sprites[selectedObject][selectedSprite];
				sprite[pixel[0]][pixel[1]] = selectedColor;

				this.spriteCanvases[selectedSprite].draw();

			}
		}
	},
	onMouseUp: function() {
		this.colorBar.isSelected = false;
		this.saturationBar.isSelected = false;
		this.brightnessBar.isSelected = false;
	},
	onMouseHold: function(){

		this.colorBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage) {

			red = getColorValue(7, 3, percentage);
			blue = getColorValue(1, 5, percentage);
			green = getColorValue(4, 9, percentage);

			colors[selectedColor].r = red;
			colors[selectedColor].g = green;
			colors[selectedColor].b = blue;

			colors[selectedColor].hue = percentage;

			changeButtonColor();
		});

		this.saturationBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage){

			saturation = percentage * 255;

			colors[selectedColor].sat = saturation;

			changeButtonColor();

		});

		this.brightnessBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage){
			// Sets the proper brightness
			colors[selectedColor].bright = 255 * percentage;

			changeButtonColor();
		})
	},
	draw: function() {

		// Gets ctx for reference
		ctx = this.ctx;

		// Draws background
		ctx.fillStyle = "#404040";
		ctx.fillRect(0, 0, this.w, this.h);

		// Draws white background

		ctx.fillStyle = "#bcd5da";
		ctx.fillRect(
			this.offsetX, 
			this.offsetY, 
			this.size * this.pixelSize, 
			this.size * this.pixelSize
		);

		// Draws grid
		for (i = 0; i <= this.size; i++){

			ctx.fillStyle = "#1e1e1e";

			// Draws x line
			ctx.fillRect(
				this.offsetX + this.pixelSize * i, 
				this.offsetY, 
				1, 
				this.size * this.pixelSize);

			// Draws y line
			ctx.fillRect(
				this.offsetX, 
				this.offsetY + this.pixelSize * i, 
				this.size * this.pixelSize, 
				1);

		}

		//draws current sprite

		for (x = 0; x < this.size; x++){
			for (y = 0; y < this.size; y++){

				if (sprites[selectedObject][selectedSprite][x][y] !== null){

					// Gets the color
					color = colors[sprites[selectedObject][selectedSprite][x][y]];

					// Draws the pixel
					ctx.fillStyle = color.hex;
					ctx.fillRect(
						this.offsetX + this.pixelSize * x,
						this.offsetY + this.pixelSize * y,
						this.pixelSize,
						this.pixelSize
					);

				}

			}
		}

		// Checks if the mouse is on the grid
		if (this.mouseX > this.offsetX && this.mouseX < this.offsetX + (this.size * this.pixelSize)){
			if (this.mouseY > this.offsetY && this.mouseY < this.offsetY + (this.size * this.pixelSize)){
				// Draws highlighted pixel

				pixel = this.getSelectedPixel();

				// Draws the highlighted pixel
				ctx.fillStyle = "#ffffff"
				ctx.fillRect(
					this.offsetX + pixel[0] * this.pixelSize,
					this.offsetY + pixel[1] * this.pixelSize,
					this.pixelSize + 1,
					this.pixelSize + 1);
			}
		}

		this.colorBar.draw(ctx);

		brightness = colors[selectedColor].bright;

		this.saturationBar.draw(ctx, [{r:brightness, g:brightness, b:brightness}, colors[selectedColor]])

		black = {r: 0, g: 0, b:0};
		white = {r: 255, g: 255, b: 255}
		this.brightnessBar.draw(ctx, [black, colors[selectedColor], white]);
	},
	selectColor: function(colorIndex) {
		selectedColor = colorIndex;

		this.colorBar.setCrosshairs(colors[selectedColor].hue);
		this.saturationBar.setCrosshairs(colors[selectedColor].sat / 255);
		this.brightnessBar.setCrosshairs(colors[selectedColor].bright / 255);
	},
	getSelectedPixel: function(){

		// Gets the pixel
		pixelX = Math.round((this.mouseX - this.offsetX - (this.pixelSize/2)) / this.pixelSize);
		pixelY = Math.round((this.mouseY - this.offsetY - (this.pixelSize/2)) / this.pixelSize);

		return [pixelX, pixelY];
	}
})

function getColorValue(startPoint, endPoint, percentage){

	start = startPoint;
	end = endPoint;
	loops = false;
	if (start > end){
		if (percentage < (end/9) || percentage > (start/9)){
			loops = true
		}
	}

	if (percentage < (end/9) && percentage > (start/9) || loops){

		// Cehcks for blending
		if ((end/9) > percentage && percentage > ((end - 1)/9)){

			color = Math.round(255 * ( 1 - (percentage - ((end - 1)/9)) / (1/9)))

		}else if (start/9 < percentage && (start + 1) / 9 > percentage){

			color = Math.round(255 * ((percentage - ((start)/9)) / (1/9)))

		}else {
			color = 255;
		}
	}else {
		color = 0;
	}

	return color;
}

function toHex(color) {

	c = color.toString(16);
	if (c.length < 2){
		c = "0" + c;
	}

	return c;
}

function getFullHexColor(color) {

	percentage = (color.sat / 255)

	finishedColor = {
		r: Math.round((color.bright * (1 - percentage) + color.r * percentage)),
		g: Math.round((color.bright * (1 - percentage) + color.g * percentage)),
		b: Math.round((color.bright * (1 - percentage) + color.b * percentage))
	};

	return "#" + toHex(finishedColor.r) + toHex(finishedColor.g) + toHex(finishedColor.b);
}

function changeButtonColor() {

	// Gets the color in hex vaLUE
	hexColor = getFullHexColor(colors[selectedColor])

	// Gets the button
	div = $(colorButtons.children()[selectedColor]);
	
	// Changes the background color
	div.css("background-color", hexColor);

	// Sets the text
	div.html(hexColor);

	// Changes the text color
	if (colors[selectedColor].bright < 128){
		div.css("color", "#ffffff");
	}else {
		div.css("color", "#000000")
	}

	// Sets the color hex value
	colors[selectedColor].hex = hexColor;

	//Sets all the sprite canvases colors
	for (i in art.spriteCanvases){

		art.spriteCanvases[i].draw();
	}
}