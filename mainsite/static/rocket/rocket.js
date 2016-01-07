Rocket = Class({
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	vX: 0,
	vY: 0,

	init: function(p){
		this.x = p.x;
		this.y = p.y;
		this.vX = p.vX;
		this.vY = p.vY;

		this.h = 20;
		this.w = 10;

		this.mass = 200;

		this.color = p.color;

	},

	update: function(){
		this.x += this.vX * time.deltaTime;
		this.y += this.vY * time.deltaTime;

		for (i = 0; i < planets.length; i++){
			p = planets[i]
			// Checks for collision
			disX = Math.abs(this.x - p.x);
			disY = Math.abs(this.y - p.y);
			dis = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));

			if (dis <= 2 * this.r || dis <= 2 * p.r){
				// if (this.mass >= p.mass){
				// 	this.mass += p.mass;
				// 	this.vX = ((this.vX * this.mass) + (p.vX * p.mass)) / (p.mass - this.mass)
				// 	this.vY = ((this.vY * this.mass) + (p.vY * p.mass)) / (p.mass - this.mass)
					
				// 	totalArea = Math.PI * Math.pow(this.r, 2) + Math.PI * Math.pow(p.r, 2)
				// 	this.r = Math.sqrt(totalArea / Math.PI)
				// 	console.log(Math.sqrt((Math.PI * Math.pow(p.r, 2)) / Math.PI))
				// 	planets[i] = null;
				// }
			}else {

				// Gets the angle
				if (disY > disX){
					theta = Math.asin(disX / disY)
				}else {
					theta = Math.asin(disY / disX)
				}

				// Force of gravity 
				// Fg = G(m1m2)/(r^2)

				G = 6.67 * Math.pow(10, -4)
				Fg = (G * this.mass * p.mass) / Math.sqrt(dis, 2) * (Math.abs(dis) / dis);

				// Gets the different axis' accelration
				FgX = Fg * Math.sin(theta);
				FgY = Fg * Math.cos(theta);

				if (this.x > p.x){
					this.vX -= FgX / this.mass * time.deltaTime;
				}else {
					this.vX += FgX / this.mass * time.deltaTime;
				}
				if (this.y > p.y){
					this.vY -= FgY / this.mass * time.deltaTime;
				}else {
					this.vY += FgY / this.mass * time.deltaTime;
				}
			}
		}

	},

	render: function(){

		ctx.fillStyle = this.color;

		ctx.fillRect(this.x, this.y, this.w, this.h);

	}
})