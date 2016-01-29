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
	},

	draw: function() {

		ctx = this.ctx;
		ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);

		for (x = 0; x < this.canvas[0].width; x++){
			for (y = 0; y < this.canvas[0].height; y++){

				if (this.image[x][y] !== null){
					ctx.fillStyle = colors[this.image[x][y]].hex;
					ctx.fillRect(x, y, 1, 1);
				}
			}
		}

	}

})