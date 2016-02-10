var SpriteCanvas = Class({

	canvas: null,
	ctx: null,

	image: 0,

	// increaes the resolution to avoid blur
	res_mulitplier: 3,

	init: function(p) {

		this.image = sprites[p.object][p.sprite];

		this.canvas = p.canvas;
		this.ctx = this.canvas[0].getContext("2d");

		this.canvas[0].width = this.image.length * this.res_mulitplier;
		this.canvas[0].height = this.image.length * this.res_mulitplier;
	},

	draw: function() {

		ctx = this.ctx;
		ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);

		for (x = 0; x < this.image.length; x++){
			for (y = 0; y < this.image[x].length; y++){

				if (this.image[x][y] !== null){
					ctx.fillStyle = colors[this.image[x][y]].hex;
					ctx.fillRect(
						x * this.res_mulitplier, 
						y * this.res_mulitplier, 
						this.res_mulitplier, 
						this.res_mulitplier);
				}
			}
		}

	}

})