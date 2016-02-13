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
		})


	},
	update: function(){
		this.draw();
	},
	onMouseUp: function(){},
	onMouseHold: function(){},
	onClick: function(){},


	draw: function(){

		ctx = this.ctx;

		for (var x = 0; x < level.length; x++){
			console.log(level[x].length);
			for (var y = 0; y < level[x].length; y++){
				if (level[x][y] === null){
					if (this.addingArea){
						ctx.fillStyle = 
					}
					ctx.fillStyle = "#000000";
					ctx.fillRect(
						this.offsetX + 5 + x * this.areaSize,
						this.offsetY + 5 + y * this.areaSize,
						this.areaSize - 10,
						this.areaSize - 10);
				}
			}
		}

		// Draws adding area overlay
	}
})