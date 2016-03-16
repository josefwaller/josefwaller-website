var keysPressed = [];

var GamePlayer = Class({

	canvas: null,
	ctx: null,

	activeArea: {
		x: 1,
		y: 1
	},

	s: 100,

	player: null,

	enemies: [],

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
		});

		$(document.body).keyup(function(event){

			// checks that the key is in the array
			if (keysPressed.indexOf(event.key) !== -1){

				// removes the key
				keysPressed.splice(index, 1);

			}

		});

		this.canvas.focus();

		this.createGame();
	},

	update: function(){
		
		// draws the area the player is in
		var area = level[this.activeArea.x][this.activeArea.y];

		drawSprite(
			this.ctx,
			sprites.backgrounds[area.background],
			0,
			0,
			this.s);

		if (this.player !== null){
			// runs the player functions
			this.player.onKey(keysPressed, 1);
			this.player.update();
			this.player.draw(this.ctx);
		}

	},

	onKeyPress: function(event){
		console.log("ASDF");
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