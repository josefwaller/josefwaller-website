var RangedEnemy = Class({
	SUPERCLASS: Enemy,

	spriteSetName: "rangedEnemyOne",

	lastShootTime: 0,
	shootDelay: 600,

	init: function(p){

	},

	update: function(){

		// finds the player
		var player = this.parent.getPlayer();

		// gets the player's position
		var playerPos = player.getPos();

		var canShoot = false;
		var missileX = 0;
		var misileY = 0;
		var missileDirection = 0;

		// checks if it has waited long enough from the last shot
		var newTime = new Date().getTime();
		if (newTime - this.lastShootTime >= this.shootDelay){


			// checks if it is inline to shoot a missile vertically

			if (Math.abs(playerPos.x - this.x) < this.s){

				// sets up to shoot a missile vertically
				canShoot = true;
				missileX = this.x;

				if (playerPos.y > this.y){

					missileY = this.y + this.s;
					missileDirection = this.dirs.down;

				}else {
					missileY = this.y - this.s;
					missileDirection = this.dirs.up;
				}


			// checks if it is inline to shoot horizontally
			}else if (Math.abs(playerPos.y - this.y) < this.s){

				// sets up to shoot a missile
				canShoot = true;
				missileY = this.y;

				if (playerPos.x > this.x){

					missileY = this.y + this.s;
					missileDirection = this.dirs.right;

				}else {
					missileX = this.x - this.s;
					missileDirection = this.dirs.left;
				}

			} 

			// checks if it is inline
			if (canShoot){

				// shoots
				this.parent.addMissile(new Missile({
					x: missileX,
					y: missileY,
					s: this.s,
					isEnemy: true,
					type: "rangedEnemyOne",
					direction: missileDirection,
					area: this.area,
					parent: this.parent
				}));
			}

			this.lastShootTime = newTime;
		}


		// checks whether it would be quicker to move vertically or horizontally to reach them

			// moves vertically

			// moves horizontally
	},

	draw: function(ctx){
		this.superRender(ctx);
	}
})