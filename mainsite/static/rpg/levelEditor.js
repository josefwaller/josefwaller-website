level = [];

var LevelEditor = Class({

	canvas: null,
	ctx: null,

	w: 600,
	h: 0,

	areaSize: null,
	offsetX: 0,
	offsetY: 0,

	addingArea: false,

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

	isFocused: false,
	
	init: function(p) {

		this.canvas = $("#level-canvas");
		this.ctx = this.canvas[0].getContext("2d");

		this.h = (this.canvas.height() / this.canvas.width()) * this.w;

		this.canvas[0].width = this.w;
		this.canvas[0].height = this.h;

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

		for (var oX = 0; oX < 10; oX++){
			while (segment.length <= oX){
				segment.push([]);
			}
			for (var oY = 0; oY < 10; oY++){
				while (segment[oX].length <= oY){
					segment[oX].push(null);
				}
			}
		}

		if (this.h > this.w){
			this.offsetX = 0;
			this.offsestY = (this.h - this.w) / 2;
			this.areaSize = this.w / 3;
		}else {
			this.offsetY = 0;
			this.offsetX = (this.w - this.h) / 2;
			this.areaSize = this.h / 3;
		}

		$("#add-area").click(function() {
			levelEditor.addingArea = true;
		});
	},
	update: function(){
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.w;
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.h;

		this.drawGrid();
	},
	onMouseUp: function(){},
	onMouseHold: function(){},
	onClick: function(){

		if (!this.isZooming && !this.isUnzooming){
			
			if (!this.isFocused){

				// checks that the mouse is in the grid
				if (this.mouseX > this.offsetX && this.mouseX < this.offsetX + this.areaSize * 3){
					if (this.mouseY > this.offsetY && this.mouseY < this.offsetY + this.areaSize * 3){

						// Gets the best match
						var x = Math.floor((this.mouseX - this.offsetX) / this.areaSize);
						var y = Math.floor((this.mouseY - this.offsetY) / this.areaSize);

						this.focusArea(x, y);

					}
				}
			}else {
				this.unfocusArea();
			}
		}
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

				maxZoom = this.h / (this.areaSize);
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

				minZoom = this.h / (this.areaSize);
				maxZoom = 1;

				percentage = (new Date().getTime() - this.zoomTime) / duration;

				this.zoomMulti = minZoom + (maxZoom - minZoom) * percentage;

				this.scaleMulti.x = this.maxScale.x - (this.maxScale.x * percentage);
				this.scaleMulti.y = this.maxScale.y - (this.maxScale.y * percentage);
			}
		}

		for (var x = 0; x < level.length; x++){
			
			for (var y = 0; y < level[x].length; y++){
				if (level[x][y] === null){
					if (this.addingArea){
						ctx.fillStyle = "#aaaaaa"
					}
					ctx.fillStyle = "#000000";
					ctx.fillRect(
						this.offsetX + 5 + x * this.areaSize * this.zoomMulti + this.scaleMulti.x,
						this.offsetY + 5 + y * this.areaSize * this.zoomMulti + this.scaleMulti.y,
						this.areaSize * this.zoomMulti - 10,
						this.areaSize * this.zoomMulti - 10);
				}
			}
		}

		// Draws adding area overlay
	},
	drawArea: function(){

	},
	focusArea: function(x, y){

		this.isZooming = true;
		this.zoomTime = new Date().getTime();

		// The width of an area
		areaWidth = this.h;

		// sets the scales to initially cancel out the offset
		this.maxScale.x = - this.offsetX;
		this.maxScale.y = - this.offsetY;

		// Adds scale relative to how many areas on the side of the focused area
		this.maxScale.x -= areaWidth * x;
		this.maxScale.y -= areaWidth * y;

		// Centers the area
		this.maxScale.x += (this.w - areaWidth) / 2;
	},
	unfocusArea: function(){

		this.isUnzooming = true;
		this.zoomTime = new Date().getTime();

	}
})