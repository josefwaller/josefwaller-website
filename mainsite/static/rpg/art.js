var selectedColor = 0;
var selectedObject = "player";
var selectedSprite = "runDownOne";

// The animation to display
var selectedAnimation = 0;
// Sprite in animation to show
var selectedAnimationSprite = 0;

var animations = [
	["runSideOne", "runSideTwo"],
	["runUpOne", "runUpTwo"],
	["runDownOne", "runDownTwo"],
	["attackSide", "runSideOne"],
	["attackUp", "runUpOne"],
	["attackDown", "runDownOne"],

	// death
	["dieOne", "dieTwo"]
];


// used for buttons to tell classes to shift the drawing
var shift = [0, 0];

var Art = Class({
	canvas: null,
	ctx: null,

	w: 600,
	h: null,

	unit: 0,

	// The offset to draw the canvas
	offsetX: 0,
	offsetY: 0,

	// The number of pixels wide and high
	size: 0,
	// The size of a pixel the player can draw
	pixelSize: 0,

	// Mouse position
	mouseX: 0,
	mouseY: 0,

	backgroundColor: "#ffffff",

	// the different bars
	colorBar: null,
	saturationBar: null,
	brightnessBar: null,

	// The canvases inside the buttons that show the image
	spriteCanvases: {},
	objectCanvases: {},

	// the animation display coordinates
	animationDisplay: {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	},
	// The interval between switching sprites
	animationInterval: 1000 / 5,
	lastAnimTime: 0,

	// whether the sprite has an animation
	// if not, it just draws the sprite
	hasAnimation: false,

	// compass buttons
	compassButtons: [],

	// the position and size of the compass layouts
	compassX: 0,
	compassY: 0,
	compassSize: 0,

	// The buttons
	copyButton: null,
	mirrorButton: null,
	eraseButton: null,

	// Alert box for copying
	copyAlertBox: null,

	// Status variables
	isErasing: false,
	isCopying: false,
	isClickingCancel: false,

	// Used when the user copies a sprite
	// The object ot copy to
	copyObject: null,
	copySprite: null,

	colorButtonManager: null,
	spriteButtonManager: null,
	objectButtonManager: null,

	ct: null,

	// the sprite to display under another sprite
	hoverSprites: null,

	// The x coordinate between the area rendered by the canvas area and the bars and buttons
	// Future Josef, this is important, it divides the screen to minimize required rendering
	splitX: null,

	init: function(p) {

		// Gets canvas and ctx
		this.canvas = $("#art-canvas");

		// Sets width/height
		this.w = 700;
		this.h = 416;

		this.ct = CTXPro({canvas: $("#art-canvas"), w: this.w, h: this.h});

		// Sets the size
		this.size = p.size

		// sets up the sprite structure
		sprites = {
			player: {
				runDownOne: [],
				runDownTwo: [],
				attackDown: [],
				runSideOne: [],
				runSideTwo: [],
				attackSide: [],
				runUpOne: [],
				runUpTwo: [],
				attackUp: [],
				pickUpItem: [],
				win: [],
				dialog: [],
				life: [],
			},
			meleeEnemyOne: {
				runDownOne: [],
				runDownTwo: [],
				runSideOne: [],
				runSideTwo: [],
				runUpOne: [],
				runUpTwo: [],
				dieOne: [],
				dieTwo: []
			},
			meleeEnemyTwo: {
				runDownOne: [],
				runDownTwo: [],
				runSideOne: [],
				runSideTwo: [],
				runUpOne: [],
				runUpTwo: [],
				dieOne: [],
				dieTwo: []
			},
			rangedEnemyOne: {
				runDownOne: [],
				runDownTwo: [],
				shootDown: [],
				runSideOne: [],
				runSideTwo: [],
				shootSide: [],
				runUpOne: [],
				runUpTwo: [],
				shootUp: [],
				dieOne: [],
				dieTwo: [],
				missile: []
			},
			rangedEnemyTwo: {
				runDownOne: [],
				runDownTwo: [],
				runSideOne: [],
				runSideTwo: [],
				runUpOne: [],
				runUpTwo: [],
				dieOne: [],
				dieTwo: [],
				missile: []
			},
			npcOne: {
				stand: [],
				dialog: []
			},
			npcTwo: {
				stand: [],
				dialog: []
			},
			npcThree: {
				stand: [],
				dialog: []
			},
			meleeWeapon: {
				onGround: [],
				useUp: [],
				useSide: [],
				useDown: []
			},
			rangedWeapon: {
				onGround: [],
				useUp: [],
				useSide: [],
				useDown: [],
				missile: []
			},
			invincibleBarrier: {
				whole: []
			},
			breakableBarrier: {
				whole: [],
				breaking: [],
				broken: []
			},
			backgrounds: {
				1: [],
				2: [],
				3: [],
				4: [],
				5: []
			},
			goal: {
				onGround: [],
			}
		}

		// Fills the empty arrays for sprites
		for (s in sprites){

			for (index in sprites[s]){

				while (sprites[s][index].length < this.size){

					var arr = []
					while (arr.length < this.size){
						arr.push(null)
					}

					sprites[s][index].push(arr)
				}
			}
		}

		this.hoverSprites = {

			meleeWeapon: {
				useUp: {
					object: "player",
					sprite: "attackUp",
					shift: [0, size * 3/4]
				},
				useSide: {
					object: "player",
					sprite: "attackSide",
					shift: [size * 3/4, 0]
				},
				useDown: {
					object: "player",
					sprite: "attackDown",
					shift: [0, - size * 3/4]
				}
			}
		}

		// copies the hoverSprite for rangedWeapon from meleeWeapon
		this.hoverSprites.rangedWeapon = this.hoverSprites.meleeWeapon;
		this.hoverSprites.rangedWeapon.missile = {
			object: "rangedWeapon",
			sprite: "useSide",
			shift: [size * 3/4, 0]
		};
		
		// Sets offsets and pixelSize
		// Rounded so the canvas doesn't have to render anti-aliasing and is faster
		this.offsetX = Math.round(this.w * (1/10));
		this.offsetY = Math.round(this.h * (1/20));
		this.pixelSize = Math.round((this.h - 2 * this.offsetY) / this.size);
		
		// The x coord of everything beside the canvas
		x = Math.round(this.offsetX + this.pixelSize * this.size + 30);

		// Creates the bars
		this.colorBar = new ColorBar({
			x: x, 
			y: this.offsetY, 
			w: 200, 
			h: 20,
			img: $("#gradiant")[0]
		});

		this.saturationBar = new ColorBar({
			x: x, 
			y: this.offsetY + 30, 
			w: 200, 
			h: 20,
			img: null
		});

		this.brightnessBar = new ColorBar({
			x: x,
			y: this.offsetY + 60,
			w: 200,
			h: 20,
			img: null
		});

		// Creats the buttons
		this.copyButton = new Button({
			x: x,
			y: this.offsetY + 90,
			w: 200,
			h: (this.h - (this.offsetY + 90)) / 4 - 20,
			text: "Copy Sprite",

			onClick: function(){
				art.isCopying = true;

				// Saves the selected object and sprite so that they will be copied into
				art.copyObject = selectedObject;
				art.copySprite = selectedSprite;
				art.copyAlertBox.activate();
			}
		});

		this.mirrorButton = new Button({
			x: x,
			y: this.copyButton.y + this.copyButton.h + 10,
			w: 200,
			h: this.copyButton.h,
			text: "Mirror",
			onClick: function() {
				art.mirrorSprite();
			}
		})

		this.eraseButton = new Button({
			x: x,
			y: this.mirrorButton.y + this.mirrorButton.h + 10,
			w: 200,
			h: this.mirrorButton.h,
			text: "Remove",
			onClick: function() {
				art.eraseSprite();
			}
		})

		// Sets the animation display coordinates
		this.animationDisplay.x = x,
		this.animationDisplay.y = this.eraseButton.y + this.mirrorButton.h + 10;
		// width is only half to fit the compass
		this.animationDisplay.w = 100;
		this.animationDisplay.h = Math.round(this.mirrorButton.h);

		// Sets the offset and pixel size for the animation display
		if (this.animationDisplay.w > this.animationDisplay.h){
			this.animationDisplay.pixelSize = Math.round(this.animationDisplay.h / this.size);
			this.animationDisplay.offsetX = Math.round((this.animationDisplay.w - this.animationDisplay.h) / 2);
			this.animationDisplay.offsetY = 0;

		}else {
			this.animationDisplay.pixelSize = Math.round(this.animationDisplay.w / this.size);
			this.animationDisplay.offsetY = (this.animationDisplay.h - this.animationDisplay.w) / 2;
			this.animationDisplay.offsetX = 0;
		}

		// creates the compass for shifting the sprite up/down/left or right
		this.compassSize = 100 / 3;
		this.compassX = x + 100;
		this.compassY = this.mirrorButton.y + this.mirrorButton.h + 10;

		/*
			Should make a compass like this
			   /\
			 <    >
			   \/

		*/

		compassButtonCheckForMouse = function(mX, mY){

			// checks if the mouse is hovering

			var r = (100 / 3) / 2;

			// checks if the mouse is with the best fitting rectangle
			if (mX >= this.x - r && mX <= this.x + r){

				if (mY >= this.y - r && mY <= this.y + r){

					// for compass, makes sure it's not in the middle rect
					if (mX >= this.compassX + 2 * r && mX <= this.compassX + 2 * (2 * r)){
						if (mY >= this.compassY + 2 * r && mY <= this.compassY + 2 * (2 * r)){

							return false

						}
					}

					// Since it is an even line, the equation
					// y = r - x works, so x + y <= r
					var pointToMouseX = Math.abs(this.x - mX);
					var pointToMouseY = Math.abs(this.y - mY);

					// checks if x + y <= r
					if (pointToMouseX + pointToMouseY <= r){
						return true
					}
				}
			}

			return false;

		}

		compassButtonDraw = function(ctx, mX, mY){

			var r = (100 / 3) / 2;

			if (this.checkForMouseHover(mX, mY)){
				ctx.fillStyle = btnColors.hover;
				$(document.body).css("cursor", "pointer");
			}else {
				ctx.fillStyle = btnColors.color;
			}

			// draws a rotated rect
			ctx.beginPath();

			// top point
			ctx.moveTo(this.x, this.y - r);

			// right point
			ctx.lineTo(this.x + r, this.y);

			// down point
			ctx.lineTo(this.x, this.y + r);

			// left point
			ctx.lineTo(this.x - r, this.y);

			ctx.fill();

		}

		compassButtonCheckForClick = function(mX, mY){

			if (this.checkForMouseHover(mX, mY)){
				this.onClick();
			}

		}

		for (var i = 0; i < 4; i++){

			var offX;
			var offY;

			if (i % 2 === 0){

				offX = this.compassX + this.compassSize * 1.5;
				offY = this.compassY + (this.compassSize * ((i / 2) + 1));

			}else {

				offX = this.compassX + (this.compassSize * (2.5 - (i / 2)));
				offY = this.compassY + this.compassSize * 1.5;

			}

			this.compassButtons[i] = new Button({
					x: offX,
					y: offY,
					w: this.compassSize,
					h: this.compassSize,
					text: "",
					onClick: function(){

						// ((this.i + 1) % 4) / (this.i + 1) = 1 except when i = 3, where it equals 0
						// (this.i - Math.floor(this.i / 2)) = 0 for 0 and 1 for 1 and 1 for 2

						shift[(this.i + 1) % 2] = ((this.i + 1) % 4) / (this.i + 1) * (2 * (this.i - Math.floor(this.i / 2))) - 1;
					}
			});

			this.compassButtons[i].draw = compassButtonDraw;
			this.compassButtons[i].checkForMouseHover = compassButtonCheckForMouse;
			this.compassButtons[i].checkForClick = compassButtonCheckForClick;
			this.compassButtons[i].compassX = this.compassX;
			this.compassButtons[i].compassY = this.compassY;
			this.compassButtons[i].i = i;

		}

		// Creates the cancel button when copying
		text = "Cancel"

		this.copyAlertBox = new AlertBox({
			w: this.w,
			h: this.h,
			title: "Copy",
			text:"Choose a sprite to copy below."
		});

		// create the color buttons
		this.setColorButtons();

		// Adds the sprite buttons
		this.changeSpriteButtons();

		// Creates the object button groups
		objectButtonGroup = $("#art-objects-btns");
		for (i in sprites){

			// Creates button
			button = $("<a class='btn btn-lg' id='" + i + "'></a>");
			button.click({obj: i}, function(event) {

				obj = event.data.obj;
				art.changeSelectedObject(obj);

			})
			// Creates canvas
			canvas = $("<canvas id='" + i + "-canvas'></canvas>");

			objectButtonGroup.append(button);

			button.append(canvas);
			button.append("<br>" + getNameFromCamel(i));

			// Gets the first sprite
			spriteName = Object.keys(sprites[i])[0];

			// Creats manager
			this.objectCanvases[i] = SpriteCanvas({canvas: canvas, object: i, sprite: spriteName});
			this.objectCanvases[i].draw();

		}

		// creates a button manager
		this.colorButtonManager = new ButtonGroup({
			id: "color-btns"
		});

		this.objectButtonManager = new ButtonGroup({
			id:"art-objects-btns"
		});
		// Sets the animation display to update 
		this.lastAnimTime = new Date().getTime();

		// Selects the first object
		this.changeSelectedObject(selectedObject);

		// Sets the selected sprite
		this.changeSprite(selectedSprite);

		// Selects the color
		this.selectColor(0);

		this.splitX = this.offsetX + this.size * this.pixelSize + 15;

		//initially draws all quadrants
		this.drawCanvasArea();
		this.drawAnimation();
		this.drawSide();
	},
	update: function() {
		// Sets mouse position
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.w;
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.h;

		if (!this.isCopying){

			if (shift[0] !== 0 || shift[1] !== 0){
				// shifts the selected sprite
				var s = sprites[selectedObject][selectedSprite];
				sprites[selectedObject][selectedSprite] = this.getShiftedSprite(s, shift[0], shift[1]);
				shift = [0, 0];

				// draws the new sprite on the canvas
				this.drawCanvasArea();

				// redraws the buttons
				this.updateSelectedButtons();
			}

			// checks what it should draw
			if (this.mouseX < this.splitX){

				this.drawCanvasArea();
			} else {

				if (this.mouseY < this.animationDisplay.y){

					this.drawSide();
				}else {

					// draws the animation display for the buttons
					this.drawAnimation();
				}
			}

			if (new Date().getTime() - this.lastAnimTime > this.animationInterval){
				this.updateSpriteAnimations();
				this.drawAnimation();
				this.lastAnimTime = new Date().getTime();
			}
		}else {

			this.drawCanvasArea();
			this.drawSide();
			this.drawAnimation();
			this.copyAlertBox.draw(this.ct, this.mouseX, this.mouseY);

			// checks if it is still copying
			if (!this.copyAlertBox.isActive && !(this.copyAlertBox.isActivating || this.copyAlertBox.isDeactivating)){
				this.isCopying = false;

				// Switches back to selected object if the user copied a sprite from a different object
				this.changeSelectedObject(this.copyObject);
				this.changeSprite(this.copySprite);

				this.drawCanvasArea();
				this.drawSide();
				this.drawAnimation();
			}

		}
	},
	eraseSprite: function(){
		
		sprites[selectedObject][selectedSprite] = [];
		
		for (var x = 0; x < size; x++){
			
			sprites[selectedObject][selectedSprite].push([]);
			
			for (var y = 0; y < size; y++){
				
				sprites[selectedObject][selectedSprite].push(null);
			}
			
		}
		
	},
	onClick: function() {

		if (!this.isCopying){

			// Checks if the bars are selected
			this.colorBar.checkForSelection(this.mouseX, this.mouseY);
			this.saturationBar.checkForSelection(this.mouseX, this.mouseY);
			this.brightnessBar.checkForSelection(this.mouseX, this.mouseY);

			this.copyButton.checkForClick(this.mouseX, this.mouseY);
			this.mirrorButton.checkForClick(this.mouseX, this.mouseY);

			for (var i = 0; i < this.compassButtons.length; i++){
				this.compassButtons[i].checkForClick(this.mouseX, this.mouseY);
			}

		}

		this.copyAlertBox.onClick(this.mouseX, this.mouseY);
	},
	onMouseUp: function() {
		// Deselects all the bars
		this.colorBar.isSelected = false;
		this.saturationBar.isSelected = false;
		this.brightnessBar.isSelected = false;

		// Cancels
		if (this.isClickingCancel){
			this.isCopying = false;
			this.isClickingCancel = false;
		}
	},
	onMouseHold: function() {

		// Cannot change the color of the eraser
		if (!this.isErasing){

			// Used so that the user cannot draw on the canvas while changing color
			var changingColor = false;

			// Changes color hue
			this.colorBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage) {

				// gets rgb values
				red = getColorValue(7, 3, percentage);
				blue = getColorValue(1, 5, percentage);
				green = getColorValue(4, 9, percentage);

				// sets rgb
				colors[selectedColor].r = red;
				colors[selectedColor].g = green;
				colors[selectedColor].b = blue;

				colors[selectedColor].hue = percentage;

				//changes the color
				changeButtonColor();

				changingColor = true;
			});

			this.saturationBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage){

				saturation = percentage * 255;

				colors[selectedColor].sat = saturation;

				changeButtonColor();

				changingColor = true;

			});

			this.brightnessBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage){
				// Sets the proper brightness
				colors[selectedColor].bright = 255 * percentage;

				changeButtonColor();

				changingColor = true;
			})
		}

		// Checks if the mouse is on the canvas
		if (!changingColor && !this.isCopying){
			if (this.mouseX > this.offsetX && this.mouseX < this.offsetX + this.size * this.pixelSize){
				if (this.mouseY > this.offsetY && this.mouseY < this.offsetY + this.size * this.pixelSize){

					// adds a pixel
					pixel = this.getSelectedPixel();
					sprite = sprites[selectedObject][selectedSprite];

					if (!this.isErasing){
						sprite[pixel[0]][pixel[1]] = selectedColor;
					}else {
						sprite[pixel[0]][pixel[1]] = null;
					}

					this.updateSelectedButtons();

				}
			}
		}else if (changingColor){
			// Draws the image with new colors
			this.drawCanvasArea();
		}
	},
	drawCanvasArea: function() {

		ct = this.ct;

		// Draws background
		ct.fillStyle = this.backgroundColor;
		ct.fillRect(0, 0, this.splitX, this.h);

		if (selectedObject in this.hoverSprites){
			if (selectedSprite in this.hoverSprites[selectedObject]){
				// Draws underlaying Sprite
				ct.globalAlpha = 0.5;
				s = this.hoverSprites[selectedObject][selectedSprite];

				sprite = this.getShiftedSprite(sprites[s.object][s.sprite], s.shift[0], s.shift[1]);

				for (var x = 0; x < this.size; x++){
					for (var y = 0; y < this.size; y++){
						if (sprite[x][y] !== null){
							color = colors[sprite[x][y]];

							ct.fillStyle = color.hex;

							ct.fillRect(
								this.offsetX + this.pixelSize * x,
								this.offsetY + this.pixelSize * y,
								this.pixelSize + 1,
								this.pixelSize + 1
							);

						}
					}

				}
			}

			ct.globalAlpha = 1;
		}

		// draws current sprite

		for (x = 0; x < this.size; x++){
			for (y = 0; y < this.size; y++){

				if (sprites[selectedObject][selectedSprite][x][y] !== null){

					// Gets the color
					color = colors[sprites[selectedObject][selectedSprite][x][y]];

					// Draws the pixel
					ct.fillStyle = color.hex;
					ct.fillRect(
						this.offsetX + this.pixelSize * x,
						this.offsetY + this.pixelSize * y,
						this.pixelSize + 1,
						this.pixelSize + 1
					);

				}

			}
		}

		// // Draws grid

		ct.fillStyle = "#000000";
		ct.globalAlpha = 0.7;

		for (i = 0; i <= this.size; i++){

			// Draws x line
			ct.fillRect(
				this.offsetX + this.pixelSize * i, 
				this.offsetY, 
				1, 
				this.size * this.pixelSize);

			// Draws y line
			ct.fillRect(
				this.offsetX, 
				this.offsetY + this.pixelSize * i, 
				this.size * this.pixelSize, 
				1);
		}

		ct.globalAlpha = 1;

		// // Checks if the mouse is on the grid
		if (!this.isCopying){
			
			if (this.mouseX > this.offsetX && this.mouseX < this.offsetX + (this.size * this.pixelSize)){
				if (this.mouseY > this.offsetY && this.mouseY < this.offsetY + (this.size * this.pixelSize)){
					// Draws highlighted pixel

					pixel = this.getSelectedPixel();

					// Draws the highlighted pixel
					ct.fillStyle = "#ffffff"
					ct.fillRect(
						this.offsetX + pixel[0] * this.pixelSize,
						this.offsetY + pixel[1] * this.pixelSize,
						this.pixelSize + 1,
						this.pixelSize + 1);
				}
			}
		}
	},
	drawSide: function() {

		ct = this.ct;

		ct.fillStyle = this.backgroundColor;
		ct.fillRect(
			this.splitX,
			0,
			this.w - this.splitX,
			this.animationDisplay.y);

		// Draws bars/buttons
		this.colorBar.draw(ct);

		brightness = colors[selectedColor].bright;
		this.saturationBar.draw(ct, [{r:brightness, g:brightness, b:brightness}, colors[selectedColor]])

		black = {r: 0, g: 0, b:0};
		white = {r: 255, g: 255, b: 255}
		this.brightnessBar.draw(ct, [black, colors[selectedColor], white]);

		this.copyButton.draw(ct, this.mouseX, this.mouseY);
		this.mirrorButton.draw(ct, this.mouseX, this.mouseY);
		this.eraseButton.draw(ct, this.mouseX, this.mouseY);
	},
	drawAnimation: function() {

		var ct = this.ct;

		ct.fillStyle = this.backgroundColor;
		ct.fillRect(
			this.splitX,
			this.animationDisplay.y,
			this.w - this.splitX,
			this.h - this.animationDisplay.y);

		var animationSprite;

		if (this.hasAnimation){

			animationSprite = animations[selectedAnimation][selectedAnimationSprite];
		}else {
			animationSprite = selectedSprite;
		}

		// Draws animation display

		var sprite = sprites[selectedObject][animationSprite];


		drawSprite(
			ct,
			sprite,
			this.animationDisplay.x + this.animationDisplay.offsetX,
			this.animationDisplay.y + this.animationDisplay.offsetY,
			this.animationDisplay.h);

		// draws compass
		var x = this.compassX;
		var y = this.compassY;
		var s = this.compassSize;

		for (var i = 0; i < this.compassButtons.length; i++){
			this.compassButtons[i].draw(this.ct, this.mouseX, this.mouseY);
		}

		// draws smaller white rect
		ct.fillStyle = "#ffffff";
		ct.fillRect(
			x + s,
			y + s,
			s,
			s
		);
	},
	selectColor: function(colorIndex) {

		if (colorIndex == 8){

			this.isErasing = true;

		}else{
			this.isErasing = false;

			selectedColor = colorIndex;
		}

		this.colorButtonManager.selectButton(colorIndex);

		this.colorBar.setCrosshairs(colors[selectedColor].hue);
		this.saturationBar.setCrosshairs(colors[selectedColor].sat / 255);
		this.brightnessBar.setCrosshairs(colors[selectedColor].bright / 255);

		this.drawSide();
		this.drawCanvasArea();
	},
	getSelectedPixel: function() {

		// Gets the pixel
		pixelX = Math.round((this.mouseX - this.offsetX - (this.pixelSize/2)) / this.pixelSize);
		pixelY = Math.round((this.mouseY - this.offsetY - (this.pixelSize/2)) / this.pixelSize);

		return [pixelX, pixelY];
	},
	changeSpriteButtons: function() {

		// Resets all of the sprite buttons

		this.spriteCanvases = {};

		// Sets all the canvases in the sprite buttons

		this.spriteButtonManager = new ButtonGroup({
			id: "art-sprites-btns"
		})
		spriteButtonGroup = $("#art-sprites-btns");
		spriteButtonGroup.html("");

		for (i in sprites[selectedObject]){

			// Creates button
			button = $("<a class='btn btn-lg' id='" + selectedObject + "-" + i + "'></a>");
			button.click({sprite: i}, function(event) {

				art.changeSprite(event.data.sprite);

			})
			// Creates canvas
			canvas = $("<canvas id='" + selectedObject + "-" + i + "-canvas'></canvas>");

			spriteButtonGroup.append(button);

			button.append(canvas);

			// Gets the name from camelHumps
			var name = getNameFromCamel(i);

			button.append("<br>" + name);

			// Creats manager
			this.spriteCanvases[i] = SpriteCanvas({canvas: canvas, object: selectedObject, sprite: i});
			this.spriteCanvases[i].draw();
		}

		// sets the first as selected
		if (!this.isCopying){
			this.changeSprite(Object.keys(sprites[selectedObject])[0]);
		}
	},
	changeSprite: function(spriteIndex) {

		// Changes the sprite or copies it

		if (this.isCopying){

			// The previous object was saved as copyObject and copySprite
			// The sprite just selected is selectedObject and spriteIndex


			// Loops through and copys the sprite
			for (x = 0; x < sprites[selectedObject][spriteIndex].length; x++){
				for (y = 0; y < sprites[selectedObject][spriteIndex][x].length; y++){
					sprites[this.copyObject][this.copySprite][x][y] = sprites[selectedObject][spriteIndex][x][y];
				}
			}


			// resets the alert box
			// Note when this is done, it will set copying to false
			this.copyAlertBox.deActivate();
			// this.isCopying = false;
			// this.drawCanvasArea();
			// this.drawSide();
			// this.drawAnimation();

		}else {
			
			selectedSprite = spriteIndex;
			this.spriteButtonManager.selectButton(Object.keys(sprites[selectedObject]).indexOf(spriteIndex));

			// Changes the animation preview
			this.changeAnimation();

			// updates the canvas
			this.drawCanvasArea();

		}
	},
	changeSelectedObject: function(objIndex) { 

		// Changes the selected button
		this.objectButtonManager.selectButton(Object.keys(sprites).indexOf(objIndex));

		// Changes the selected Object
		selectedObject = objIndex;

		// Sets the selected sprite
		selectedSprite = Object.keys(sprites[selectedObject])[0];

		this.changeAnimation();
		this.updateSpriteAnimations();

		this.objectCanvases[selectedObject].draw();
		this.changeSpriteButtons();
	},
	changeAnimation: function(){


		// Changes the animation display sprites
		var foundAnimation = false;

		for (var i = 0; i < animations.length; i++){
			if ($.inArray(selectedSprite, animations[i]) !== -1){

				this.hasAnimation = true;
				selectedAnimation = i;
				foundAnimation = true;
				break;
			}
		}

		if (!foundAnimation){

			this.hasAnimation = false;

		}
	},
	setColorButtons: function(){

		// Sets the button's colors
		colorButtons = $("#color-btns");
		colorButtons.html("");

		for (i = 0; i < colors.length; i++){

			// Creates button for the color
			div = $("<a class='btn btn-lg'></a>");
			colorButtons.append(div);

			// Selected div to show when selected
			selectedDiv = $("<div class='selected-div'></div>");
			div.append(selectedDiv);
			
			// Sets the text color so it is visible
			if (colors[i].bright < 128){
				div.css("color", "#ffffff");
			}else {
				div.css("color", "#000000");
			}

			// Sets teh background color
			div.css("background-color", colors[i].hex);
			div.append(colors[i].hex);

			div.click({colorIndex: i}, function(event){

				art.selectColor(event.data.colorIndex);
			})
		}

		// Creates the eraser button
		eraserDiv = $("<a class='btn btn-lg' id='eraser'>Eraser</a>");
		eraserDiv.click(function(event) {
			art.selectColor(8);
		})
		eraserDiv.css("background-color", "#66ccff");
		eraserDiv.css("color", "#ffffff");
		colorButtons.append(eraserDiv);

	},
	updateSelectedButtons: function() {
		// Updates the current selected sprite and object button canvases
		this.objectCanvases[selectedObject].draw();
		this.spriteCanvases[selectedSprite].draw();
	},
	updateAllButtons: function() {
		// Updates all the button canvases
		// When a color is changed, something that affects all sprites
		for (i in this.objectCanvases){
			
			this.objectCanvases[i].draw();
		}
		for (i in this.spriteCanvases){
			this.spriteCanvases[i].draw();
		}
	},
	updateSpriteAnimations: function() {

		// Changes the sprite to draw in the animation display
		if (this.hasAnimation){


			selectedAnimationSprite += 1;

			if (selectedAnimationSprite >= animations[selectedAnimation].length){

				selectedAnimationSprite = 0;

			}
		}
	},
	mirrorSprite: function() {

		// Gets the sprite and makes a new array that will be the cloned copy
		sprite = sprites[selectedObject][selectedSprite];
		spriteCopy = [];

		// Cycles though and gets the clone
		for (x = 0; x < sprite.length; x++){

			spriteCopy[x] = sprite[sprite.length - 1 -x].slice();

		}

		// Cycles through and copies the mirrored sprite into the sprite
		// Needs to pass by value, not by reference
		for (x = 0; x < sprite.length; x++){
			sprites[selectedObject][selectedSprite][x] = spriteCopy[x].slice();
		}

		// draws
		this.drawCanvasArea();

		// Updates the buttons
		this.updateSelectedButtons();
	},
	getShiftedSprite: function(sprite, x, y){

		// shifts the selected sprite by one pixel

		// the new sprite to replace the current one
		var newSprite = [];

		// reference of the current sprite
		var s = sprite;

		// checks if it needs to shift5 along the x coord
		if (x !== 0){

			// creates an example empty x line
			var empty = [];

			// fills empty with null
			while(empty.length < this.size){
				empty.push(null);
			}

			// Cycles through and copies the value of the x line before or after it
			for (var i = 0; i < s.length; i++){

				// checks if the x coordinate exists
				// otherwise it is at the end
				if (i - x >= 0 && i - x < s.length){

					// copies the value
					newSprite.push(s[i - x]);
				}else {

					// copies the empty line
					newSprite.push($.extend([], empty, true));
				}

			}

		}

		// checks if it need to shift by y
		if (y !== 0){

			// cycles through
			for (var i = 0; i < s.length; i++){

				// creates a new x array
				newSprite.push([]);

				// cycles through and copies the next y value
				for (var z = 0; z < s[i].length; z++){

					// checks if it is not near the edges
					if (z - y >= 0 && z - y < s[i].length){

						// adds the next value
						newSprite[i].push(s[i][z - y]);

					}else {

						// adds an empty pixel
						newSprite[i].push(null);
					}
					
				}
			}


		}

		// sets sprites to new sprite
		return newSprite;
	},
	onLoad: function(){
		
		this.updateAllButtons();
		
		this.changeSelectedObject("player");
		this.changeSprite("runDownOne");
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

	art.updateAllButtons();
}

function getNameFromCamel (name){

	// Capitalizes the first letter
	name = name.charAt(0).toUpperCase() + name.slice(1);

	alphabet = "abcdefghijklmnopqrstuvwxyz";
	
	// Cycles through and checks if it shoudl insert a space
	for (var n = 1; n < name.length; n++){

		// Check if it is uppercase
		if (name.charAt(n).toUpperCase() === name.charAt(n) && alphabet.indexOf(name.charAt(n).toLowerCase()) !== -1){
			// Gets the first part (starts at zero)
			firstPart = name.slice(0, n - name.length);
			// Gets the second part
			secondPart = name.slice(n);
			// adds them
			name = firstPart + " " + secondPart;
			// Adds one to n, since a space was created
			n++;
		}
	}
	return name;
}