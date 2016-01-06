Planet = Class({

	x: 0,
	y: 0,
	r: 0,
	v: {
		x: 0,
		y: 0
	},
	mass: 0,
	color: 0,

	// Initializes the class
	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.mass = p.mass;
		this.r = p.radius;
		this.v = {
			x: p.velocity_x,
			y: p.velocity_y
		};

		this.color = p.color;

	},

	// Moves in accordance with velocity
	update: function(){
		this.x += this.v.x * time.deltaTime;
		this.y += this.v.y * time.deltaTime;
	},

	// Draws the planet
	render: function(){

		if (0 < this.x + this.r && this.x - this.r < canvas.width){
			if (0 < this.y + this.r && this.y - this.r < canvas.height){
				
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}
})