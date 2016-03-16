var SpriteCanvas = Class({

	canvas: null,
	ctx: null,

	object: null,
	sprite: null,

	// increaes the resolution to avoid blur
	res_mulitplier: 3,

	init: function(p) {

		this.object = p.object;
		this.sprite = p.sprite;

		this.canvas = p.canvas;
		this.ctx = this.canvas[0].getContext("2d");

		this.canvas[0].width = size * this.res_mulitplier;
		this.canvas[0].height = size * this.res_mulitplier;
	},

	draw: function() {

		ctx = this.ctx;
		ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);

		var image = sprites[this.object][this.sprite];

		for (x = 0; x < image.length; x++){
			for (y = 0; y < image[x].length; y++){

				if (image[x][y] !== null){
					ctx.fillStyle = colors[image[x][y]].hex;
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