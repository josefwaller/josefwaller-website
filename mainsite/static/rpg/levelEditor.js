var level = [];

var objects;

var selectedElement = 0;

var deleteArea = false;


// variables for buttons to change 
var createArea = false;
var changeBackground = false;
var erase;

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

	// the eraser button
	eraser: null,
	
	alertBox: null,

	focusedAreaSize: 0,
	
	// whether or not the user has created a player
	// used to determine whether the user can play or not
	hasPlayer: false,
	
	// the x and y of the area the player is in
	playerX: 0,
	playerY: 0,

	objectCanvases: [],
	backgroundCanvases: [],

	isFocused: false,

	// divs to hide and show
	focusToolsDiv: null,
	unfocusToolsDiv: null,

	// button group managers
	objectGroupManager: null,
	toolGroupManager: null,
	
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

		this.eraser = $("#lvl-edtr-eraser");
		// adds the eraser button
		this.eraser.click({levelEditor: this}, function(event){

			levelEditor.selectElement("eraser");

		});

		this.focusToolsDiv = $("#lvl-edtr-focus-tools");
		this.unfocusToolsDiv = $("#lvl-edtr-unfocus-tools");

		// Creates example segment
		segment = {
			elements: [],
			background: 1,
		}

		for (var oX = 0; oX < 5; oX++){
			while (segment.elements.length <= oX){
				segment.elements.push([]);
			}
			for (var oY = 0; oY < 5; oY++){
				while (segment.elements[oX].length <= oY){
					segment.elements[oX].push(null);
				}
			}
		}

		this.alertBox = new AlertBox({
			w: this.w,
			h: this.h,
			title: "Create Area",
			text: "Create an area here?",
			buttons: [
				{
					text: "Create Area",
					onClick: function(){
						createArea = true;
					}
				}
			]
		});

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
		
		// creates the objects from the sprites
		// will exclude eerything in this array
		var notElements = [
			"backgrounds"
		];
		
		objects = [];

		for (var i in sprites){

			// Copies sprites
			if ($.inArray(i, notElements) === -1){

				objects.push({
					name: i,
					object: i,
					sprite: Object.keys(sprites[i])[0],
					maxNum: 3,
					num: 0
				});

			}

			var index = objects.length - 1;

			// changes the max value if it needs to be changed
			switch (i){

				case "player":
					objects[index].maxNum = 1;
					break;

				case ("breakableBarrier" || "invincibleBarrier"):
					objects[index].maxNum = 20;
					break;
			}
		}
		

		// sets the zoom out button to zoom out
		this.focusToolsDiv.hide();

		$("#zoom-out").click(function() {
			if (levelEditor.isFocused){
				levelEditor.unfocusArea();
			}
		});

		$("#lvl-edtr-b-group").hide();
		$("#lvl-edtr-obj-btns").hide();

		// adds the remove area button
		$("#remove-area").click(function(event){
			levelEditor.removeArea();
		});
		
		this.createBackgroundButtons();
	},
	createBackgroundButtons: function(){
		

		// sets background buttons
		var backgroundBtns = $("#lvl-edtr-b-group");

		backgroundBtns.html("");

		for (var i = 1; i < Object.keys(sprites.backgrounds).length + 1; i++){

			var backgroundBtn = $("<a class='btn btn-lg lvl-edtr-background-btn' id='lvl-edtr-b" + i + "'></a>");

			var canvas = $("<canvas></canvas>");

			var backgroundNum = Object.keys(sprites.backgrounds)[i - 1];

			this.backgroundCanvases[i - 1] = new SpriteCanvas({
				object: "backgrounds",
				sprite: backgroundNum,
				canvas: canvas
			});

			// sets it to change background
			backgroundBtn.click({i: i}, function(event) {

				changeBackground = event.data.i;

			})

			backgroundBtn.append(canvas);
			backgroundBtn.append($("<br>"));
			backgroundBtn.append("Background " + backgroundNum);

			backgroundBtns.append(backgroundBtn);

		}

		this.backgroundGroupManager = new ButtonGroup({id: "lvl-edtr-b-group"});
	},
	update: function(){
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.w;
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.h;

		// Updates sprite canvases
		for (var i = 0; i < this.objectCanvases.length; i++){

			this.objectCanvases[i].draw();

		}

		for (var i = 0; i < this.backgroundCanvases.length; i++){

			this.backgroundCanvases[i].draw();
		}

		if (createArea){
			this.createArea();
			createArea = false;
		}

		if (changeBackground !== false){
			this.changeBackground(changeBackground);
			changeBackground = false;
		}

		if (deleteArea){

			level[this.focusedArea.x][this.focusedArea.y] = null;
			
			if (this.focusedArea.x === this.playerX && this.focusedArea.y === this.playerY){
				this.hasPlayer = false;
			}
			
			this.unfocusArea();

			deleteArea = false;

		}

		this.drawGrid();

		this.alertBox.draw(this.ctx, this.mouseX, this.mouseY);
	},
	fillObjectButtons: function(){

		// Adds the object canvases
		var btnGroup = $("#lvl-edtr-obj-btns");
		btnGroup.html("");

		// creates the button group for the object buttons
		this.objectGroupManager = new ButtonGroup({id: "lvl-edtr-obj-btns"});

		for (var i = 0; i < objects.length; i++){

			var btn = $("<a class='btn btn-lg'></a>");

			var canvas = $("<canvas></canvas>");

			this.objectCanvases[i] = new SpriteCanvas({
				canvas: canvas,
				object: objects[i].object,
				sprite: objects[i].sprite
			});

			btn.append(canvas);
			btn.append("<br>" + getNameFromCamel(objects[i].name));

			btn.click({levelEditor: this, i: i}, function(event){
			
				event.data.levelEditor.selectElement(event.data.i);

			})

			btnGroup.append(btn);

		}

		// selects the first element
		this.selectElement(0);
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

						}else {

							// alert box setup
							this.alertBox.activate();
							this.alertBox.title = "Create Area?";
							this.alertBox.text = "Create a new area?";
							this.alertBox.changeButtons([
								{
									text: "Create Area",
									onClick: function(){
										createArea = true;
									}
								}
							]);

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

								// gets whatever is on the space
								var formerElement = level[this.focusedArea.x][this.focusedArea.y].elements[x][y];

								if (selectedElement == "eraser"){
									level[this.focusedArea.x][this.focusedArea.y].elements[x][y] = null;

									// removes the former element
									if (formerElement !== null){
										objects[formerElement].num--;
										
										if (objects[formerElement].name === "player"){
											this.hasPlayer = false;
										}

									}
								}else {

									if (objects[selectedElement].num < objects[selectedElement].maxNum){

										level[this.focusedArea.x][this.focusedArea.y].elements[x][y] = selectedElement;
										objects[selectedElement].num++;
										
										if (objects[selectedElement].name === "player"){
											this.hasPlayer = true;
											this.playerX = this.focusedArea.x;
											this.playerY = this.focusedArea.y;
										}

										if (formerElement !== null){
											objects[formerElement].num--;

										}
									}
								}
							}
						}
					}
				}

			}
		}
	},
	createArea: function(){

		// creates a new segment for the area
		level[this.focusedArea.x][this.focusedArea.y] = $.extend(true, {}, segment);
		this.focusArea(this.focusedArea.x, this.focusedArea.y);

	},
	removeArea: function(){

		if (this.isFocused){

			this.alertBox.title = "Delete Area?";
			this.alertBox.text = "Are you sure you want to delte this area?";
			this.alertBox.changeButtons([
				{
					text: "Delete Area",
					onClick: function() {
						deleteArea = true;
					}
				}
			]);

			this.alertBox.activate();
		}

	},
	changeBackground: function(bIndex) {

		if (this.isFocused){

			level[this.focusedArea.x][this.focusedArea.y].background = bIndex;
			this.backgroundGroupManager.selectButton(bIndex - 1);

		}

	},
	// Draws the area map
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
		var area = level[areaX][areaY].elements;

		// Draws the background sprite 
		drawSprite(
			this.ctx,
			sprites.backgrounds[level[areaX][areaY].background],
			offX, 
			offY, 
			maxSize);
			
		// draws a slightly transparent black rectangle on top to darken the background
		this.ctx.fillStyle = "#000000";
		this.ctx.globalAlpha = 0.2;
		this.ctx.fillRect(offX, offY, maxSize, maxSize);
		this.ctx.globalAlpha = 1;
		
		elementSize = maxSize / 5;

		// Cycles through and draws all relevent sprites
		for (var x = 0; x < area.length; x++){
			for (var y = 0; y < area.length; y++){

				if (area[x][y] !== null){

					var obj = objects[area[x][y]];

					drawSprite(
						this.ctx,
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
						this.ctx.globalAlpha = 0.8;
						this.ctx.fillRect(
							offX + pixelX * elementSize,
							offY + pixelY * elementSize,
							elementSize + 1,
							elementSize + 1);
						this.ctx.globalAlpha = 1;

					}
				}
			}
		}
	},
	selectElement: function(index){
		selectedElement = index;
		
		if (index === "eraser"){
			this.objectGroupManager.deselect();
			this.eraser.attr("selected", "selected");
			
		}else {
			this.objectGroupManager.selectButton(index);
			this.eraser.removeAttr("selected");
		}
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

		// displays the zoom out button
		this.focusToolsDiv.css("visibility", "visible");

		// displays the object buttons
		this.fillObjectButtons();

		$("#lvl-edtr-b-group").css("visibility", "visible");
		$("#lvl-edtr-obj-btns").show();
		
		// changes the selected background button
		this.backgroundGroupManager.selectButton(level[x][y].background - 1);
		
		this.selectElement(0);
	},
	unfocusArea: function(){

		this.isUnzooming = true;
		this.zoomTime = new Date().getTime();

		this.focusToolsDiv.css("visibility", "hidden");

		$("#lvl-edtr-b-group").css("visibility", "hidden");
		$("#lvl-edtr-obj-btns").hide();
	},
	
	onLoad: function(){
		
		for (var i = 0; i < this.objectCanvases.length; i++){
			this.objectCanvases[i].draw();
		}
		for (var i = 0; i < this.backgroundCanvases.length; i++){
			this.backgroundCanvases[i].draw();
		}
		
		if (this.isFocused){
			
			this.selectElement(0);
		}
	}
});