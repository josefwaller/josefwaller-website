var keysPressed = [];

// delta time
var delta;

var GamePlayer = Class({

	canvas: null,
	ctx: null,

	activeArea: {
		x: 1,
		y: 1
	},

	s: 100,

	player: null,

	lastTime: 0,

	enemies: [],

	isScrolling: false,
	scrollDirection: null,
	scrollTime: null,
	scrollDuration: 1000,
	scrollDirection: {
		x: 0,
		y: 0
	},

	init: function(p){

		this.canvas = $("#game-canvas");
		this.ctx = CTXPro({
			canvas: this.canvas,
			w: this.s,
			h: this.s
		});

		// adds keys when pressed
		$(document.body).keydown(function(event){

			// checks it has not already registered the key as pressed
			if (keysPressed.indexOf(event.key) === -1){

				// adds the key
				keysPressed.push(event.key);
			}

			// checks if the keys would scroll the window
		    if([32, 37, 38, 39, 40].indexOf(event.keyCode) !== -1) {
		        event.preventDefault();
		    }

		});

		$(document.body).keyup(function(event){

			var index = keysPressed.indexOf(event.key);
			// checks that the key is in the array
			if (index !== -1){

				// removes the key
				keysPressed.splice(index, 1);

			}

		});

		this.canvas.focus();

		this.createGame();
	},

	update: function(){
		
		var d = new Date().getTime();
		delta = (d - this.lastTime) / 1000;
		this.lastTime = d;

		// draws the area the player is in
		var area = level[this.activeArea.x][this.activeArea.y];

		if (this.isScrolling){

			var percentage = (new Date().getTime() - this.scrollTime) / this.scrollDuration;

			// checks if it is done scrolling
			if (percentage > 1){

				this.activeArea.x += this.scrollDirection.x;
				this.activeArea.y += this.scrollDirection.y;
				this.isScrolling = false;

				switch(this.scrollDirection.x){

					case -1:
						this.player.x = (this.s - this.player.s) - 1;
						break;

					case 1:
						this.player.x = 1;
						break;

					case 0:

						switch (this.scrollDirection.y){

							case -1:
								this.player.y = this.s - this.player.s - 1;
								break;

							case 1:
								this.player.y = 1;
								break;
						}

				}

			}else {

				var xMovement = this.s * percentage * this.scrollDirection.x;
				var yMovement = this.s * percentage * this.scrollDirection.y;

				// draws the old area
				this.drawArea(
					-xMovement,
					-yMovement,
					this.activeArea.x,
					this.activeArea.y)

				// draw the new area
				this.drawArea(
					(this.scrollDirection.x * this.s) - xMovement,
					(this.scrollDirection.y * this.s) - yMovement,
					this.activeArea.x + this.scrollDirection.x,
					this.activeArea.y + this.scrollDirection.y);
			}

		}
		if (!this.isScrolling){

			this.drawArea(
				0,
				0,
				this.activeArea.x,
				this.activeArea.y);	


			if (this.player !== null){
				// runs the player functions
				this.player.onKey(keysPressed, 1);
				this.player.update();
				this.player.draw(this.ctx);

				// checks if it should scroll

				if (this.player.x > this.s - this.player.s || this.player.x < 0){
					
					this.scroll(this.player.x / Math.abs(this.player.x), 0);

				}else if (this.player.y > this.s - this.player.s || this.player.y < 0){

					this.scroll(0, this.player.y / Math.abs(this.player.y));
				}
			}
		}

	},

	scroll: function(addX, addY){

		// checks if the area exists
		var maxPlayer = this.s - this.player.s - 1;
		var minPlayer = 1;
		switch(true){

			case (this.activeArea.x + addX >= level.length):
				this.player.x = maxPlayer;
				return;

			case (this.activeArea.x + addX < 0):
				this.player.x = minPlayer;
				return;

			case (this.activeArea.y + addY >= level.length):
				this.player.y = maxPlayer
				return;

			case (this.activeArea.y + addY < 0):
				this.plauer.y = minPlayer;
				return;

		}

		// sets up to scroll
		this.isScrolling = true;
			
		this.scrollDirection.x = addX;
		this.scrollDirection.y = addY;

		this.scrollTime = new Date().getTime();
	},

	drawArea:function(x, y, areaX, areaY){

		area = level[areaX][areaY];

		drawSprite(
			this.ctx,
			sprites.backgrounds[area.background],
			x,
			y,
			this.s);

		// draws a semi transparent black layer to darken background
		// so that the sprites show up more
		this.ctx.globalAlpha = 0.1;
		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(
			x,
			y,
			this.s,
			this.s);
		this.ctx.globalAlpha = 1;

	},

	onClick:function(){},
	onMouseUp: function(){},
	onMouseHold: function(){},
	onMiddleClick: function(){},

	createGame: function(){

		// creates the game from the level
		for (var lX = 0; lX < level.length; lX++){
			for (var lY = 0; lY < level[lX].length; lY++){

				// checks that there is an area there
				if (level[lX][lY] !== null){

					var l = level[lX][lY].elements;

					var blockSize = this.s / l.length;

					// goes through the level and creates things
					for (var x = 0; x < l.length; x++){
						for(var y = 0; y < l[x].length; y++){


							// checks that there is an object there
							if (l[x][y] !== null){

								switch(objects[l[x][y]].name){

									case "player":
										// Adds the player at the location

										this.player = new Player({
											x: blockSize * x,
											y: blockSize * y,
											s: blockSize
										})

										break;


									default:
										console.log(objects[l[x][y]].name)

								}
							}

						}
					}
				}
			}
		}
	}

});