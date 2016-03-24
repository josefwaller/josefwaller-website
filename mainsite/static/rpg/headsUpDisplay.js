var HeadsUpDisplay = Class({
		
	canvas: null,
	ctx: null,
	
	w: 0,
	h: 0,

	padding: 1,

	parent: null,

	init: function(p){

		this.parent = p.parent;

		this.w = p.w;
		this.h = p.w * 1/8;

		this.canvas = $("#game-hud-canvas");
		this.ctx = CTXPro({
			canvas: this.canvas,
			w: this.w,
			h: this.h
		});

	},

	render: function(ctx){

		// draws a black bar at the top
		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(0, 0, this.w, this.h);

		// draws the player's hearts

		var player = this.parent.getPlayer();
		var lives = player.getNumOfLives();
		var itemSize = this.h - 2 * this.padding;
		var sprite = sprites.player.life;

		for (var i = 0; i < lives; i++){
			drawSprite(
				this.ctx,
				sprite,
				this.padding + i * (itemSize + this.padding),
				this.padding,
				itemSize);
		}

		// draws the tools
		var selectedTool = player.getSelectedTool();
		var hasTool = player.getTools();

		var tools = [
			"ranged",
			"melee"
		];

		// cycles through for each tool and draws it

		for (var i = 0; i < tools.length; i++){

			// draws the tool
			if (hasTool[tools[i]]){
				var x = this.w - (this.padding + itemSize) - i * itemSize;
				var y = this.padding;

				drawSprite(
					this.ctx,
					sprites[tools[i] + "Weapon"].onGround,
					x,
					y,
					itemSize);

				if (selectedTool === tools[i]){

					this.ctx.fillStyle = "#ffffff";
					this.ctx.borderRect(
						x - 0.1,
						y - 0.1,
						itemSize + 0.2,
						itemSize + 0.2,
						0.1);

				}

			}
		}

	}
})