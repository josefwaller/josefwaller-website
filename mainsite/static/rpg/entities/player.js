var Player = new Class({

	SUPERCLASS: Entity,

	spriteSetName: "player",

	// all the sprites this entity uses
	sprites: [
		"runDownOne",
		"runDownTwo",
		"runSideOne",
		"runSideTwo",
		"runUpOne",
		"runUpTwo",
		"attackDown",
		"attackSide",
		"attackUp"
	],

	// the different animations
	animations: {
		runDown: [
			0,
			1
		],
		runSide: [
			2,
			3
		],
		runUp: [
			4,
			5
		],
		attackDown: [
			6
		],
		attackSide: [
			7
		],
		attackUp:  [
			8
		],
		die: [
			0,
			2,
			4,
			2
		]
	},

	currentAnimation: [0],

	hasTool: {
		ranged: false,
		melee: false
	},

	numOfLives: 3,

	selectedTool: null,

	isAttacking: false,
	lastKeys: false,
	attackTime: 0,
	attackDuration: 150,

	currentSpriteIndex: 0,

	lastAnimChange: 0,

	speed: 70,

	translate: {
		x: 0,
		y: 0
	},

	animationDelay: 150,

	isMoving: false,

	isDying: false,
	deathTime: 0,
	deathDelay: 1000,

	isBlinking: false,
	blinkTime: 0,
	blinkDuration: 150,
	numOfBlinks: 6,

	isShowing: true,

	mirror: false,

	hasDialog: false,
	dialogNum: null,

	init: function(p){

		lastAnimChange = new Date().getTime();

	},

	onKey: function(keys, delta){

		// takes an array of keys
		for (var i = 0; i < keys.length; i++){

			switch(keys[i]){

				case "ArrowLeft":
					
					this.translate.x = -1;
					break;

				case "ArrowUp":

					this.translate.y = -1;
					break;

				case "ArrowDown":

					this.translate.y = 1;
					break;

				case "ArrowRight":

					this.translate.x = 1;
					break;

				// checks for attacking
				case " ":

					if (this.lastKeys.indexOf(" ") === -1){
						
						if (!this.isAttacking && !this.isDying){

							this.isAttacking = true;
							this.attackTime = new Date().getTime();

							// gets the sprite
							this.currentSpriteIndex = 0;

							switch (this.direction){
								case this.dirs.down:
									this.currentAnimation = this.animations.attackDown;
									break

								// fall through for both sides
								case this.dirs.right:
								case this.dirs.left:
									this.currentAnimation = this.animations.attackSide;
									break

								case this.dirs.up:
									this.currentAnimation = this.animations.attackUp;
									break;

								default:
									console.log(this.direction)
							}

							// checks if the player is using the ranged weapon, then it should create a missile
							if (this.selectedTool === "ranged"){

								// gets the x and y offset for spawning a missile if needed
								var offX = 0;
								var offY = 0;

								switch (this.direction){
									case this.dirs.up:
										offY = - this.s;
										break;

									case this.dirs.left:
										offX = - this.s;
										break;

									case this.dirs.down:
										offY = this.s;
										break;

									case this.dirs.right:
										offX = this.s;
										break;
								}

								this.parent.addMissile(new Missile({
									x: this.x + offX,
									y: this.y + offY,
									s: this.s,
									parent: this.parent,
									type: "rangedWeapon",
									area: this.parent.getActiveArea(),
									direction: this.direction,
									isEnemy: false
								}));

							}
						}

					}
					break;

				// checks for tool switching
				case "q":


					if (this.lastKeys.indexOf("q") === -1){
						if (!this.hasDialog){

							if (this.selectedTool === "ranged" && this.hasTool.melee){
								this.selectedTool = "melee";
							}else if (this.hasTool.ranged){
								this.selectedTool = "ranged";
							}
						}else {
							this.parent.startDialog(this.dialogNum);
						}
					}

					break;

			}
		}

		this.lastKeys = keys.slice();

	},

	update: function(){

		// Checks if dead
		// if not, checks if dying
		// if not, checks for movement

		if (this.isDying){

			// checks if it has finished dying and the game should restart
			if (new Date().getTime() - this.deathTime >= this.deathDelay){

				this.parent.createGame();

			}

			this.checkForAnimChange();

			if (this.currentSpriteIndex === 3){
				this.mirror = true;
			}else{
				this.mirror = false;
			}

		}else {

			// checks if it should change the blink
			if (this.isBlinking){

				var time = new Date().getTime();

				// checks if it is done blinking
				if (time - this.blinkTime > this.blinkDuration * this.numOfBlinks){
					this.isBlinking = false;
					this.isShowing = true;
				}else{

					// gets whether or not it should show
					var timeSince = time - this.blinkTime;
					var blinksSince = Math.round(timeSince / this.blinkDuration);

					if (blinksSince % 2 === 0){

						this.isShowing = false;

					}else {
						this.isShowing = true;
					}
				}

			}

			// checks for attacking
			if (this.isAttacking){

				// checks it has a weapon
				if (this.hasTool.melee || this.hasTool.ranged){

					// gets the attack position
					var attackOrigin = this.getPos();
					var maxOffset = this.s * 3 / 4;

					switch (this.direction){

						case this.dirs.up:
							attackOrigin.y -= maxOffset;
							break;

						case this.dirs.down:
							attackOrigin.y += maxOffset;
							break;

						case this.dirs.left:
							attackOrigin.x -= maxOffset;
							break;

						case this.dirs.right:
							attackOrigin.x += maxOffset;
							break;
					}

					// checks if an enemy is there
					for (var i = 0; i < this.parent.getEnemies().length; i++){

						var e = this.parent.getEnemies()[i];

						if (e.getArea().x === this.parent.getActiveArea().x && e.getArea().y === this.parent.getActiveArea().y){

							var eS = e.getSize();
							var eP = e.getPos()

							if (eP.x + eS > attackOrigin.x){
								if (eP.x < attackOrigin.x + this.s){
									if (eP.y + eS > attackOrigin.y){
										if (eP.y < attackOrigin.y + this.s){

											e.onHit();

										}
									}
								}
							}
						}
					}
				}

				// check if player is done attacking
				var time = new Date().getTime();
				if (time - this.attackTime > this.attackDuration && !this.spaceIsDown){

					this.isAttacking = false;

					// changes animation
					switch (this.direction){
						case this.dirs.down: 
							this.currentAnimation = this.animations.runDown;
							break;

						// fall through for both left and right
						case this.dirs.left:
						case this.dirs.right:
							this.currentAnimation = this.animations.runSide;
							break;

						case this.dirs.up:
							this.currentAnimation = this.animations.runUp;
							break;
					}
				}

			}else {

				// checks for movement
				if (this.translate.x !== 0 || this.translate.y !== 0){

					this.mirror = false;

					// moves accoring to tranlate
					this.move(this.translate.x, this.translate.y);

					// checks for animation
					switch(this.translate.y){
						case 1:
							// running down
							this.currentAnimation = this.animations.runDown;
							this.direction = this.dirs.down;
							break;

						case -1:
							// running up
							this.currentAnimation = this.animations.runUp;
							this.direction = this.dirs.up;
							break

					}

					// running sideways
					if (this.translate.x !== 0){

						this.currentAnimation = this.animations.runSide;

						if (this.translate.x == 1){
							this.mirror = true;
							this.direction = this.dirs.right;
						}else{
							this.direction = this.dirs.left;
						}
					}

					this.checkForAnimChange();

				}

				this.translate = {
					x: 0,
					y: 0
				};
			}
		}

	},

	onHit: function(){

		if (!this.isDying && !this.isBlinking){

			this.numOfLives--;

			if (this.numOfLives > 0){

				this.isBlinking = true;
				this.blinkTime = new Date().getTime();

			}else{

				this.isDying = true;
				this.currentAnimation = this.animations.die;
				this.deathTime = new Date().getTime();
			}
		}
	},
 
	draw: function(ctx){ 

		if (this.isShowing){

			this.superRender(ctx);

			if (this.isAttacking && !this.isDying){

				// checks for the weapon
				if (this.selectedTool !== null){

					// the offset at which to draw the tool
					var toolOffsetX = 0;
					var toolOffsetY = 0;

					// the maximum offset, just need the proper direction
					var toolOffset = (this.s * 3/4);

					// gets the direction
					var direction;

					switch (this.direction){

						case this.dirs.up:
							direction = "Up";
							toolOffsetY = - toolOffset;
							break;

						case this.dirs.left:
							direction = "Side";
							toolOffsetX = - toolOffset;
							break;

						case this.dirs.right:
							direction = "Side";
							toolOffsetX = toolOffset;
							break;

						case this.dirs.down:
							direction = "Down";
							toolOffsetY = toolOffset;
							break;

					}
					// draws the tool
					var toolSprite;

					if (this.hasTool.melee && this.selectedTool === "melee"){
						toolSprite = sprites.meleeWeapon["use" + direction];

					}else if (this.hasTool.ranged && this.selectedTool === "ranged"){
						toolSprite = sprites.rangedWeapon["use" + direction];

					}else {
						console.error("Invalid selectedTool");
					}

					toolSprite = toolSprite.slice();
					if (this.mirror){
						toolSprite.reverse();
					}

					// draws the tool
					drawSprite(
						ctx,
						toolSprite,
						this.x + toolOffsetX,
						this.y + toolOffsetY,
						this.s);

				}

			}
		}

	},
	move: function(x, y){
		if (!this.isAttacking){

			// checks it does not hit a barrier

			// records its previous location so that it can move back if needed
			var prevX = this.x;
			var prevY = this.y;

			// moves
			this.x += this.speed * x * delta;
			this.y += this.speed * y * delta;

			var s = this.parent.getAreaSize();

			// checks that the player does not run out of bounds
			// stops him/her one pixel out, so that it will still 
			// trigger the scroll
			// if the player cannot scroll because there is a barrier there
			// this stops him/her from running off of the screen
			if (this.x < -1){
				this.x = -1;
			}else if (this.x > s + 1){
				this.x = s + 1;
			}

			if (this.y < -1){
				this.y = -1;
			}else if (this.y > s + 1){
				this.y = s + 1;
			}

			// checks it does not hit a barrier
			var bars = this.parent.getBarriers();
			for (var i = 0; i < bars.length; i++){
				var b = bars[i];
				if (this.isInSameArea(b)){
					if (this.checkForCollision(b)){
						this.x = prevX;
						this.y = prevY;
						break;
					}
				}
			}
		}
	},

	// gets set functions
	getNumOfLives: function(){
		return this.numOfLives;
	},
	getSelectedTool: function(){
		return this.selectedTool;
	},
	getTools: function(){
		return this.hasTool;
	},
	setHasDialog: function(hasDialog, dialogNum){
		this.hasDialog = hasDialog;
		this.dialogNum = dialogNum;
	},
	getHasDialog: function(){
		return this.hasDialog;
	},
	getDialogNum: function(){
		return this.getDialogNum;
	}
})