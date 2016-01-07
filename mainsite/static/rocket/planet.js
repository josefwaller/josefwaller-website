Planet = Class({

	x: 0,
	y: 0,
	r: 0,

	inOrbit: false,
	orbitHeight: null,
	orbitParent: null,
	orbitV: 0,
	orbitDegree: 0,

	vX: 0,
	vY: 0,

	mass: 0,
	color: 0,

	// Initializes the class
	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.mass = p.mass;
		this.r = p.radius;
		this.vX = p.vX / 1000;
		this.vY = p.vY / 1000;
		this.color = p.color;

		if (p.orbitParent != null){

			this.orbitParent = p.orbitParent;
			this.orbitHeight = p.orbitHeight;
			this.orbitV = p.orbitV / 1000;
			this.inOrbit = true;
		}
	},

	// Moves in accordance with velocity
	update: function(){

		// Planets are on a fixed orbit

		if (this.inOrbit){
			// Positive velocity is clockwise, negative is anticlockwise
			radians = this.orbitV / (2 * Math.PI * this.orbitParent.r);

			this.orbitDegree += radians;

			console.log(this.orbitDegree)

			yAddon = this.orbitHeight * Math.sin(this.orbitDegree);
			xAddon = this.orbitHeight * Math.cos(this.orbitDegree);

			this.x = this.orbitParent.x + xAddon;
			this.y = this.orbitParent.y + yAddon;

		}
	},

	// Draws the planet
	render: function(){

		if (0 < this.x + this.r && this.x - this.r < canvas.width){
			if (0 < this.y + this.r && this.y - this.r < canvas.height){
				
				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}
})