Rocket = Class({
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	vX: 0,
	vY: 0,

	isLanded: false,
	planetLanded: null,
	offsetX: 0,
	offsetY: 0,

	rotation: 0,

	init: function(p){
		this.x = p.x;
		this.y = p.y;
		this.vX = p.vX;
		this.vY = p.vY;

		this.h = 20;
		this.w = 10;

		this.mass = 200;

		this.color = p.color;

		this.rotation = angle;

		this.vY = force * Math.cos(this.rotation);
		this.vX = force * Math.sin(this.rotation);

	},

	update: function(){

		this.x += this.vX * time.deltaTime;
		this.y += this.vY * time.deltaTime;

		landedThisFrame = false;

		for (i = 0; i < planets.length; i++){
			p = planets[i]
			// Checks for collision
			disX = Math.abs((this.x + this.w) - p.x);
			disY = Math.abs((this.y + this.h) - p.y);
			dis = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));

			if (dis <= p.r){

				if (!this.isLanded){

					// lands on planet
					this.isLanded = true;
					this.vX = 0;
					this.vY = 0;
					this.planetLanded = p;
					this.offsetX = this.x - p.x;
					this.offsetY = this.y - p.y;
					landedThisFrame = true;
				}else {
					this.x = this.planetLanded.x + this.offsetX;
					this.y = this.planetLanded.y + this.offsetY;
				}

			}else {

				// Gets the angle
				theta = Math.asin(disY / dis)

				// Force of gravity 
				// Fg = G(m1m2)/(r^2)

				G = 6.67 * Math.pow(10, -4)
				Fg = (G * this.mass * p.mass) / Math.sqrt(dis, 2);

				// Gets the different axis' accelration
				FgX = Fg * Math.cos(theta);
				FgY = Fg * Math.sin(theta);

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

				//Adds Torque to rotation
			}
		}

		if (!landedThisFrame){
			this.isLanded = false;
		}

	},

	render: function(){

		centerX = this.x + this.w / 2;
		centerY = this.y + this.h / 2;

		ctx.save();

		ctx.translate(centerX, centerY)
		ctx.rotate(-this.rotation);
		ctx.translate(-centerX, -centerY)

		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);

		ctx.translate(centerX, centerY);
		ctx.rotate(this.rotation);
		ctx.translate(-centerX, -centerY);

	}
})