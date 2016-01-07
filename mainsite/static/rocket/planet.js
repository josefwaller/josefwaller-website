Planet = Class({

	x: 0,
	y: 0,
	r: 0,
	v_x: 0,
	v_y: 0,
	mass: 0,
	color: 0,

	// Initializes the class
	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.mass = p.mass;
		this.r = p.radius;
		this.v_x = p.velocity_x / 1000;
		this.v_y = p.velocity_y / 1000;
		this.color = p.color;

		this.id = planets.length
	},

	// Moves in accordance with velocity
	update: function(){
		this.x += this.v_x * time.deltaTime;
		this.y += this.v_y * time.deltaTime;

		for (i = 0; i < planets.length; i++){
			p = planets[i]
			if (p !== null && this.id != p.id){
				// Checks for collision
				dis_x = Math.abs(this.x - p.x);
				dis_y = Math.abs(this.y - p.y);
				dis = Math.sqrt(Math.pow(dis_x, 2) + Math.pow(dis_y, 2));

				if (dis <= 2 * this.r || dis <= 2 * p.r){
					if (this.mass >= p.mass){
						this.mass += p.mass;
						this.v_x = ((this.v_x * this.mass) + (p.v_x * p.mass)) / (p.mass - this.mass)
						this.v_y = ((this.v_y * this.mass) + (p.v_y * p.mass)) / (p.mass - this.mass)
						
						totalArea = Math.PI * Math.pow(this.r, 2) + Math.PI * Math.pow(p.r, 2)
						this.r = Math.sqrt(totalArea / Math.PI)
						console.log(Math.sqrt((Math.PI * Math.pow(p.r, 2)) / Math.PI))
						planets[i] = null;
					}
				}else {

					// Gets the angle
					if (dis_y > dis_x){
						theta = Math.asin(dis_x / dis_y)
					}else {
						theta = Math.asin(dis_y / dis_x)
					}

					// Force of gravity 
					// Fg = G(m1m2)/(r^2)

					G = 6.67 * Math.pow(10, -4)
					Fg = (G * this.mass * p.mass) / Math.sqrt(dis, 2) * (Math.abs(dis) / dis);

					// Gets the different axis' accelration
					Fg_x = Fg * Math.sin(theta);
					Fg_y = Fg * Math.cos(theta);

					if (this.x > p.x){
						this.v_x -= Fg_x / this.mass * time.deltaTime;
					}else {
						this.v_x += Fg_x / this.mass * time.deltaTime;
					}
					if (this.y > p.y){
						this.v_y -= Fg_y / this.mass * time.deltaTime;
					}else {
						this.v_y += Fg_y / this.mass * time.deltaTime;
					}
				}
			}
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