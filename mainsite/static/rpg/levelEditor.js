var level = [];

var objects;

var selectedElement = 0;

var createArea = false;

var LevelEditor = Class({

	canvas: null,
	ctx: null,

	w: 600,
	h: 317,

	areaSize: null,
	offsetX: 0,
	offsetY: 0,
	gridBorder: 2,

	addingArea: false,

	focusedArea: {
		x: 0,
		y: 0
	},

	objectSize: null,

	// used in zooming
	isZooming: false,
	isUnzooming: false,
	zoomTime: 0,
	zoomMulti: 1,
	scaleMulti: {
		x: 1,
		y: 1
	},
	maxScale: {
		x: 1,
		y: 1
	},

	alertBox: null,

	focusedAreaSize: 0,

	objectCanvases: [],

	isFocused: false,
	
	init: function(p) {

		this.canvas = $("#level-canvas");
		this.ctx = CTXPro({canvas: this.canvas, h: this.h, w: this.w});

		// Creates level with nothing
		for (var x = 0; x < 3; x++){
			while (level.length <= x){
				level.push([]);
			}
			for (var y = 0; y < 3; y++){
				while (level[x].length <= y){
					level[x].push(null);
				}
			}
		}

		// Creates example segment
		segment = [];

		for (var oX = 0; oX < 5; oX++){
			while (segment.length <= oX){
				segment.push([]);
			}
			for (var oY = 0; oY < 5; oY++){
				while (segment[oX].length <= oY){
					segment[oX].push(null);
				}
			}
		}

		this.alertBox = new AlertBox({
			w: this.w,
			h: this.h,
			title: "Test",
			text: "testing",
			buttons: [
				{
					text: "Create Area",
					onClick: function(){
						createArea = true;
					}
				}
			]
		});

		// Used for testing
		level[0][1] = $.extend(true, [], segment);
		level[0][1][3][3] = 0;

		if (this.h > this.w){
			this.offsetX = 0;
			this.offsestY = (this.h - this.w) / 2;
			this.areaSize = this.w / 3;
		}else {
			this.offsetY = 0;
			this.offsetX = (this.w - this.h) / 2;
			this.areaSize = this.h / 3;
		}

		this.focusedAreaSize = this.h;


		objects = [
			{
				name: "Player",
				object: "player",
				sprite: "runDownOne"
			},
			{
				name: "Enemy One",
				object: "enemyOne",
				sprite: "runDownOne"
			}
		];

		// sets the zoom out button to zoom out
		$("#zoom-out").click(function() {
			if (levelEditor.isFocused){
				levelEditor.unfocusArea();
			}
		});
	},
	update: function(){
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.w;
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.h;

		// Updates sprite canvases
		for (var i = 0; i < this.objectCanvases.length; i++){

			this.objectCanvases[i].draw();

		}

		if (createArea){
			this.createArea();
			createArea = false;
		}
		this.drawGrid();

		this.alertBox.draw(this.ctx, this.mouseX, this.mouseY);
	},
	fillObjectButtons: function(){

		// Adds the object canvases
		var btnGroup = $("#lvl-edtr-obj-btns");
		btnGroup.html("");

		for (var i = 0; i < objects.length; i++){

			var btn = $("<div class='btn btn-lg'></div>");

			var canvas = $("<canvas></canvas>");

			this.objectCanvases[i] = new SpriteCanvas({
				canvas: canvas,
				object: objects[i].object,
				sprite: objects[i].sprite
			});

			btn.append(canvas);
			btn.append("<br>" + objects[i].name);

			btn.click({levelEditor: this, i: i}, function(event){

				event.data.levelEditor.selectElement(event.data.i);

			})

			btnGroup.append(btn);

		}
	},
	onMouseUp: function(){},
	onMouseHold: function(){},
	onClick: function(){

		if (this.alertBox.isActive){

			this.alertBox.onClick(this.mouseX, this.mouseY);
			return;

		}

		if (!this.isZooming && !this.isUnzooming){

			if (!this.isFocused){

				// checks that the mouse is in the grid
				if (this.mouseX > this.offsetX && this.mouseX < this.offsetX + this.areaSize * 3){
					if (this.mouseY > this.offsetY && this.mouseY < this.offsetY + this.areaSize * 3){

						// Gets the best match
						var x = Math.floor((this.mouseX - this.offsetX) / this.areaSize);
						var y = Math.floor((this.mouseY - this.offsetY) / this.areaSize);

						if (level[x][y] !== null){

							this.focusArea(x, y);
							this.fillObjectButtons();

						}else {
							this.alertBox.activate();

							// remembers the area clicks
							this.focusedArea.x = x;
							this.focusedArea.y = y;
						}
					}
				}
			}else {

				// check for element placement

				if (this.mouseX > (this.w - this.focusedAreaSize) / 2){
					if (this.mouseX < this.w - (this.w - this.focusedAreaSize) / 2){
						if (this.mouseY > (this.h - this.focusedAreaSize) / 2){
							if (this.mouseY < this.h - (this.h - this.focusedAreaSize) / 2){

								// gets mouse Coords
								var x = Math.floor((this.mouseX - (this.w - this.focusedAreaSize) / 2) / this.focusedAreaSize * 5);
								var y = Math.floor((this.mouseY - (this.h - this.focusedAreaSize) / 2) / this.focusedAreaSize * 5);

								console.log(x, y)
								console.log(this.focusedArea)
								level[this.focusedArea.x][this.focusedArea.y][x][y] = selectedElement;
							}
						}
					}
				}

			}
		}
	},
	createArea: function(){

		level[this.focusedArea.x][this.focusedArea.y] = segment.slice();
		this.focusArea(this.focusedArea.x, this.focusedArea.y);

	},
	// Draws thel area map
	drawGrid: function(){

		ctx = this.ctx;

		// Draws background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, this.w, this.h);

		// Gets the next zooming factor

		var duration = 300;
		if (this.isZooming){

			if (new Date().getTime() - this.zoomTime > duration){

				this.isZooming = false;
				this.isFocused = true;

			}else {

				maxZoom = this.focusedAreaSize / (this.areaSize);
				minZoom = 1;

				percentage = (new Date().getTime() - this.zoomTime) / duration;

				this.zoomMulti = minZoom + (maxZoom - minZoom) * percentage;

				this.scaleMulti.x = this.maxScale.x * percentage;
				this.scaleMulti.y = this.maxScale.y * percentage;
			}
		}else if (this.isUnzooming){

			if (new Date().getTime() - this.zoomTime > duration){

				this.isUnzooming = false;
				this.isFocused = false;

				this.zoomMulti = maxZoom;
				this.scaleMulti.x = 0;
				this.scaleMulti.y = 0;

			}else {

				minZoom = this.focusedAreaSize / (this.areaSize);
				maxZoom = 1;

				percentage = (new Date().getTime() - this.zoomTime) / duration;

				this.zoomMulti = minZoom + (maxZoom - minZoom) * percentage;

				this.scaleMulti.x = this.maxScale.x - (this.maxScale.x * percentage);
				this.scaleMulti.y = this.maxScale.y - (this.maxScale.y * percentage);
			}
		}

		for (var x = 0; x < level.length; x++){
			
			for (var y = 0; y < level[x].length; y++){
				if (level[x][y] !== null){
					this.drawArea(
						x,
						y,
						this.offsetX + x * this.areaSize * this.zoomMulti + this.scaleMulti.x + this.gridBorder,
						this.offsetY + y * this.areaSize * this.zoomMulti + this.scaleMulti.y + this.gridBorder,
						this.areaSize * this.zoomMulti - 2 * this.gridBorder);
				}else {
					this.ctx.fillStyle = btnColors.color;
					this.ctx.fillRect(
					this.offsetX + x * this.areaSize * this.zoomMulti + this.scaleMulti.x + this.gridBorder / 2,
					this.offsetY + y * this.areaSize * this.zoomMulti + this.scaleMulti.y + this.gridBorder / 2,
					this.areaSize * this.zoomMulti - this.gridBorder,
					this.areaSize * this.zoomMulti - this.gridBorder);
				}
			}
		}
	},
	// draws a specific area
	drawArea: function(areaX, areaY, offX, offY, maxSize){

		// gets the area
		var area = level[areaX][areaY];

		// Draws the background sprite 
		this.drawSprite(sprites.backgrounds.one, offX, offY, maxSize);

		elementSize = maxSize / 5;

		// Cycles through and draws all relevent sprites
		for (var x = 0; x < area.length; x++){
			for (var y = 0; y < area.length; y++){

				if (area[x][y] !== null){

					var obj = objects[area[x][y]];

					this.drawSprite(
						sprites[obj.object][obj.sprite],
						offX + x * elementSize,
						offY + y * elementSize,
						elementSize);

				}

			}
		}

		// draws grid
		if (((this.isFocused && !this.isUnzooming) || this.isZooming)){

			if (this.focusedArea.x == areaX && this.focusedArea.y == areaY){

				for (var l = 0; l < area.length + 1; l++){

					if (((this.isFocused && !this.isUnzooming) || this.isZooming)){

						// Draws x line
						this.ctx.fillStyle = "#000000";
						this.ctx.fillRect(
							offX,
							offY + l * elementSize,
							maxSize,
							1);

						// Draws y line
						this.ctx.fillRect(
							offX + l * elementSize,
							offY,
							1,
							maxSize);
					}
				}

				// Draws highlighted pixel
				var pixelX = Math.floor((this.mouseX - offX) / elementSize);
				var pixelY = Math.floor((this.mouseY - offY) / elementSize);

				if (pixelY < 5 && pixelY >= 0){
					if (pixelX < 5 && pixelX >= 0){

						this.ctx.fillStyle = "#ffffff";
						this.ctx.fillRect(
							offX + pixelX * elementSize,
							offY + pixelY * elementSize,
							elementSize + 1,
							elementSize + 1);

					}
				}
			}
		}
	},
	drawSprite: function(sprite, offX, offY, s){

		var pixelSize = s / size;

		for (var x = 0; x < sprite.length; x++){

			for (var y = 0; y < sprite[x].length; y++){

				if (sprite[x][y] !== null){

					this.ctx.fillStyle = colors[sprite[x][y]].hex;
					this.ctx.fillRect(
						offX + pixelSize * x, 
						offY + pixelSize * y, 
						pixelSize, 
						pixelSize
						);
				}
			}
		}
	},
	selectElement: function(index){
		selectedElement = index;
	},
	focusArea: function(x, y){

		this.isZooming = true;
		this.isUnzooming = false;
		this.zoomTime = new Date().getTime();

		// sets the scales to initially cancel out the offset
		this.maxScale.x = - this.offsetX;
		this.maxScale.y = - this.offsetY;

		// Adds scale relative to how many areas on the side of the focused area
		this.maxScale.x -= this.focusedAreaSize * x;
		this.maxScale.y -= this.focusedAreaSize * y;

		// Centers the area
		this.maxScale.x += (this.w - this.focusedAreaSize) / 2;

		// records the focused area
		this.focusedArea.x = x;
		this.focusedArea.y = y;

		// displays the zoom ut button
		$("#zoom-out").show();
	},
	unfocusArea: function(){

		this.isUnzooming = true;
		this.zoomTime = new Date().getTime();

		$("#zoom-out").hide();
	}
})