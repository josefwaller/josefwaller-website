var spriteCanvas = Class({

	canvas: null,
	ctx: null,

	image: 0,

	init: function(p) {
		this.image = sprites[p.object][p.sprite];

		this.canvas = p.canvas;
		this.ctx = this.canvas[0].getContext("2d");

		this.canvas[0].width = this.image.length;
		this.canvas[0].height = this.image.length;
		console.log("ASDF")
	},

	draw: function() {

		for (x = 0; x < this.canvas.width; x++){
			for (y = 0; y < this.canvas.height; y++){

				if (this.image[x][y] !== null){
					ctx.fillStyle = this.image[x][y].hex;
					ctx.fillRect(x, y, 1, 1);
				}
			}
		}

	}

})