var keysPressed = [];

// delta time
var delta;

var size = 16;
	
// the index of the current dialog
var currentDialog;

// whther or not the dialog is showing
var dialogIsShowing = false;

var GamePlayer = Class({

	canvas: null,
	ctx: null,

	hud: null,

	activeArea: {
		x: 1,
		y: 1
	},

	s: 100,

	player: null,
	goal: null,

	// lists of different entities
	items: [],
	enemies: [],
	missiles: [],
	npcs: [],
	barriers: [],

	// a list of the indexes
	missilesToRemove: [],

	lastTime: 0,

	isScrolling: false,
	scrollTime: null,
	scrollDuration: 500,
	scrollDirection: {
		x: 0,
		y: 0
	},

	isPaused: false,
	hasWon: false,
	winTime: 0,
	winDelay: 2000,

	init: function(p) {

		this.canvas = $("#game-canvas");
		this.ctx = CTXPro({
			canvas: this.canvas,
			w: this.s,
			h: this.s
		});

		// adds keys when pressed
		$(document.body).keydown(function(event){

			key = getKeyFromKeyCode(event.keyCode);

			// checks it has not already registered the key as pressed
			if (keysPressed.indexOf(key) === -1){

				// adds the key
				keysPressed.push(key);
			}

			// checks if the keys would scroll the window
		    if([32, 37, 38, 39, 40].indexOf(event.keyCode) !== -1 && playingGame) {
		        event.preventDefault();
		    }

		});

		$(document.body).keyup(function(event){

			key = getKeyFromKeyCode(event.keyCode);

			var index = keysPressed.indexOf(key);
			// checks that the key is in the array
			if (index !== -1){

				// removes the key
				keysPressed.splice(index, 1);

			}

		});

		this.canvas.focus();

		this.createGame();
	},

	update: function() {
		
		// gets delta time
		var d = new Date().getTime();
		delta = (d - this.lastTime) / 1000;
		this.lastTime = d;

		// checks if the player has won
		if (this.hasWon){
			if (new Date().getTime() - this.winTime >= this.winDelay){
				onWin();
			}
		}

		// draws the area the player is in
		var area = level[this.activeArea.x][this.activeArea.y];

		if (this.isScrolling){
			this.scroll();
		}

		if (!this.isScrolling){

			this.drawArea(
				0,
				0,
				this.activeArea.x,
				this.activeArea.y);	


			for (var i = 0; i < this.npcs.length; i++){
				if (this.entityIsInArea(this.npcs[i])){

					if (!this.isPaused){
						this.npcs[i].update();
					}
					this.npcs[i].draw(this.ctx);
				}
			}

			if (this.player !== null){

				if (!this.isPaused || this.hasWon || this.player.getIsPickingUpItem()){
					// runs the player functions
					this.player.onKey(keysPressed, 1);
					this.player.update();
					this.checkForPlayerScroll();

					// note that the player is drawn on top of everything
				}
			}

			// updates everything

			for (var i = 0; i < this.items.length; i++){

				if (this.entityIsInArea(this.items[i])){

					if (!this.isPaused){
						this.items[i].update();
					}
					this.items[i].draw(this.ctx);
				}
			}

			for (var i = 0; i < this.enemies.length; i++){

				if (this.entityIsInArea(this.enemies[i])){

					if (!this.isPaused){
						this.enemies[i].update();
					}
					this.enemies[i].draw(this.ctx);

				}

			}

			for (var i = 0; i < this.missiles.length; i++){

				if (this.entityIsInArea(this.missiles[i])){

					if (!this.isPaused){

						this.missiles[i].update();
					}
					this.missiles[i].draw(this.ctx);

				}

			}

			// draws barriers
			for (var i = 0; i < this.barriers.length; i++){

				if (this.entityIsInArea(this.barriers[i])){
					this.barriers[i].draw(this.ctx);
				}
			}

			if (this.entityIsInArea(this.goal)){
				this.goal.update();
				this.goal.draw(this.ctx);
			}

			// draws the plyer on top of everything
			this.player.draw(this.ctx);

			this.trimMissiles();

			this.hud.render();
			this.hud.onKeys(keysPressed);
		}
	},
	checkForPlayerScroll: function() {

		var playerPos = this.player.getPos();

		var directionX = 0;
		var directionY = 0;
		var futureCoords = this.player.getPos();

		// checks if it should scroll

		if (playerPos.x > this.s - this.player.getSize() || playerPos.x < 0){

			directionX = playerPos.x / Math.abs(playerPos.x);

			if (directionX === 1){
				futureCoords.x = 0;
			}else if (directionX === -1){
				futureCoords.x = this.s - this.player.getSize();
			}
		}
		if (playerPos.y > this.s - this.player.getSize() || playerPos.y < 0){

			directionY = playerPos.y / Math.abs(playerPos.y);

			if (directionY === 1){
				futureCoords.y = 0;
			}else if (directionY === -1){
				futureCoords.y = this.s - this.player.getSize();
			}
		}

		if (directionX !== 0 || directionY !== 0){

			// checks if the player would hit a barrier

			var canScroll = true;

			// checks the player does not hit any barriers
			for (var i = 0; i < this.barriers.length; i++){
				var b = this.barriers[i];

				if (b.getArea().x === this.activeArea.x + directionX){
					if (b.getArea().y === this.activeArea.y + directionY){

						var bPos = b.getPos();
						// ha ha bs
						var bS = b.getSize();

						var pS = this.player.getSize();

						// checks if the player would hit the barrier
						if (futureCoords.x < bPos.x + bS){
							if (futureCoords.x + pS > bPos.x){
								if (futureCoords.y < bPos.y + bS){
									if (futureCoords.y + pS > bPos.y){
										// prevents the player from scrolling
										canScroll = false;
										break;
									}
								}
							}
						}
					}
				}
			}

			if (canScroll){
				this.beginScroll(directionX, directionY);

			}
		}
	},

	entityIsInArea: function(entity) {

		var entityArea = entity.getArea();

		if (entityArea.x === this.activeArea.x &&  entityArea.y === this.activeArea.y){
			
			return true;
		}else{
			
			return false;
		}

	},
	scroll: function(){
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
				- xMovement,
				- yMovement,
				this.activeArea.x,
				this.activeArea.y)

			// draw the new area
			this.drawArea(
				(this.scrollDirection.x * this.s) - xMovement,
				(this.scrollDirection.y * this.s) - yMovement,
				this.activeArea.x + this.scrollDirection.x,
				this.activeArea.y + this.scrollDirection.y);
		}
	},

	beginScroll: function(addX, addY) {

		// checks if the area exists
		var canMoveToArea = false;

		// the destination indexes
		var destX = this.activeArea.x + addX;
		var destY = this.activeArea.y + addY;

		// checks that the area exists
		if (destX >= 0 && destX < level.length){
			 if (destY >= 0 && destY < level.length){
			 	if (level[destX][destY] !== null){

					canMoveToArea = true;
				}
			}
		}

		if (canMoveToArea){

			// sets up to scroll
			this.isScrolling = true;
				
			this.scrollDirection.x = addX;
			this.scrollDirection.y = addY;

			this.scrollTime = new Date().getTime();

		}else {

			//moves player back to boundaries

			// the max x and y the player can go
			var max = this.s - this.player.s;

			if (addX !== 0){

				// rounds the player's x coord

				this.player.setPos(Math.abs(Math.round(this.player.x / max) * max), null);

			}
			if (addY !== 0){

				// does the same as above only with Y
				this.player.setPos(null, Math.abs(Math.round(this.player.getPos().y / max) * max));
			}

		}
	},

	drawArea:function(x, y, areaX, areaY) {

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


	onWin: function(){

		this.isPaused = true;
		this.hasWon = true;
		this.winTime = new Date().getTime();
	},

	createGame: function() {

		// gets self for reference
		var self = this;

		this.hasWon = false;
		this.isPaused = false;

		// clears previous entities
		this.enemies = [];
		this.items = [];
		this.barriers = [];
		this.npcs = [];
		this.player = null;

		// creates the HUD
		this.hud = new HeadsUpDisplay({
			parent: self,
			w: this.s
		});

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
											s: blockSize,
											parent: self,
											area: {
												x: 0,
												y: 0
											}
										});

										this.activeArea.x = lX;
										this.activeArea.y = lY;

										break;

									// fall through for both weapons
									case "meleeWeapon":
									case "rangedWeapon":

										var type;

										if (objects[l[x][y]].name === "meleeWeapon"){

											type = "melee";
										}else {

											type = "ranged";
										}

										this.items.push(new Item({
											x: blockSize * x,
											y: blockSize * y,
											s: blockSize,
											type: type,
											parent: self,
											area: {
												x: lX,
												y: lY
											}
										}));

										break;

									// fall through for both meleeEnemies
									case "meleeEnemyOne":
									case "meleeEnemyTwo":

										var type;
										if (objects[l[x][y]].name === "meleeEnemyOne"){

											type = 1;

										}else {
											type = 2;
										}

										this.enemies.push(new MeleeEnemy({
											x: blockSize * x,
											y: blockSize * y,
											s: blockSize,
											area: {
												x: lX,
												y: lY
											},
											parent: self,
											type: type
										}));

										break;

									case "rangedEnemyOne":
									case "rangedEnemyTwo":

										var type;

										if (objects[l[x][y]].name === "rangedEnemyOne"){
											type = 1;
										}else{
											type = 2;
										}

										this.enemies.push(new RangedEnemy({
											x: blockSize * x,
											y: blockSize * y,
											s: blockSize,
											area: {
												x: lX,
												y: lY
											},
											parent: self,
											type: type
										}));

										break;

									case "npcOne":
									case "npcTwo":
									case "npcThree":

										var type;

										switch (objects[l[x][y]].name){
											case "npcOne":
												type = 1;
												break;

											case "npcTwo":
												type = 2;
												break;

											case "npcThree":
												type = 3;
												break;
										}

										this.npcs.push(new NPC({
											x: blockSize * x,
											y: blockSize * y,
											s: blockSize,
											area: {
												x: lX,
												y: lY
											},
											parent: self,
											type: type
										}))
										break;

									// fallthrough for both barriers
									case "breakableBarrier":
									case "invincibleBarrier":

										var isBreakable = (objects[l[x][y]].name === "breakableBarrier");
										this.barriers.push(new Barrier({
											x: blockSize * x,
											y: blockSize * y,
											s: blockSize,
											area: {
												x: lX,
												y: lY
											},
											parent: self,
											isBreakable: isBreakable
										}));

										break;

									case "goal":
										this.goal = new Goal({
											x: blockSize * x,
											y: blockSize * y,
											s: blockSize,
											area: {
												x: lX,
												y: lY
											},
											parent: self
										});
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

		this.lastTime = new Date().getTime();
	},

	addMissile: function(missile) {

		// adds it to the list
		this.missiles.push(missile);
	}, 
	removeMissile: function(missile) {

		var index = this.missiles.indexOf(missile);
		this.missilesToRemove.push(index);
	},
	trimMissiles: function() {

		for (var i = 0; i < this.missilesToRemove.length; i++){

			this.missiles.splice(this.missilesToRemove[i], 1);

		}

		this.missilesToRemove = [];
	},

	startDialog: function(num) {

		this.hud.startDialog(num - 1);
		this.isPaused = true;

	},
	pause: function(){
		this.isPaused = true;
	},
	unpause: function(){
		this.isPaused = false;
	},

	// get set 
	getEnemies: function() {
		return this.enemies;
	},
	getPlayer: function() {
		return this.player;
	},
	getActiveArea: function() {
		return this.activeArea;
	},
	getAreaSize: function(){
		return this.s;
	},
	getCTX: function(){
		return this.ctx;
	},
	getBarriers: function(){
		return this.barriers;
	}

});

function checkEntitiesForCollision(xOne, yOne, sOne, spriteOne, xTwo, yTwo, sTwo, spriteTwo){


	if (xOne + sOne > xTwo){
		if (xOne < xTwo + sTwo){
			if (yOne + sOne > yTwo){
				if (yOne < yTwo + sTwo){

					// the blocks are colliding, so it checks if any pixels collide as well
					var pixelSize = sTwo / size;
					var offX = Math.floor(Math.abs(xTwo - xOne) / pixelSize);
					var offY = Math.floor(Math.abs(yTwo - yOne) / pixelSize);

					// the indexsOne to start and end at
					// the only relevent pixels, the onsOne that have a chance of hitting each other
					var startX;
					var startY;
					var endX;
					var endY;
					
					if (xOne > xTwo){
						// if the entity is farther right than thios entity, it can skip the first offX pixels
						startX = offX;
						endX = size;

					}else if (xTwo > xOne){

						startX = 0;
						endX = size - offX;

					}else {
						startX = 0;
						endX = size;
					}

					// dosOne the same for Y
					if (yOne > yTwo){
						startY = offY;
						endY = size;
					}else if (yTwo > yOne){
						startY = 0;
						endY = size - offY;
					}else {
						startY = 0;
						endY = size;
					}

					// gets the current sprite
					var thisSprite = spriteTwo;
					var otherSprite = spriteOne;

					// cyclsOne through and checks if any pixels hit
					for (var thisX = startX; thisX < endX; thisX++){
						for (var thisY = startY; thisY < endY; thisY++){

							if (thisSprite[thisX][thisY] !== null){

								for (var otherX = size - startX - 1; otherX >= 0; otherX--){
									for (var otherY = size - startY - 1; otherY >= 0; otherY--){

										if (otherSprite[otherX][otherY] !== null){

											// check if the pixels hit
											var thisPixelOffX = xTwo + thisX * pixelSize;
											var thisPixelOffY = yTwo + thisY * pixelSize;

											var otherPixelOffX = xOne + otherX * pixelSize;
											var otherPixelOffY = yOne + otherY * pixelSize;

											// checks if they hit
											if (thisPixelOffX < otherPixelOffX + pixelSize){
												if (thisPixelOffX + pixelSize > otherPixelOffX){
													if (thisPixelOffY < otherPixelOffY + pixelSize){
														if (thisPixelOffY + pixelSize > otherPixelOffY){
															return true;
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}