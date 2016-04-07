var HeadsUpDisplay = Class({
		
	canvas: null,
	ctx: null,
	
	w: 0,
	h: 0,

	padding: 1,

	parent: null,

	// a 2 dimensional array
	// formated like so
	// Each line is split into an array of segments, 
	// each to be printed on their own line so that 
	// the text does not overflow
	dialogLines: [],

	dialogPadding: 2,

	dialogFontSize: 3,
	dialogFont: "Press Start 2P",

	// the current line of dialog the user is viewing
	// not to be confused with the current segment
	currentDialogLine: 0,

	// the name of the npc doing the dialog
	npcName: "npcOne",

	// whther or not the player is holding down 'Q'
	lastKeys: [],

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

				// gets the x and y dimensions
				var x = this.w - (this.padding + itemSize) - i * itemSize;
				var y = this.padding;

				// draws the tool's sprite
				drawSprite(
					this.ctx,
					sprites[tools[i] + "Weapon"].onGround,
					x,
					y,
					itemSize);

				// checks if this tool is the selected tool
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

		if (this.isRunningDialog){

			var ctx = this.parent.getCTX();
			var s = this.parent.getAreaSize();

			// draws the black backgrond
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, s * 3 / 4, s, s * 1 / 4);

			// draws the image
			var sprite;

			if (this.currentDialogLine % 2 === 1){
				sprite = sprites.player.dialog;
			}else{
				sprite = sprites[this.npcName].dialog;
			}
				
			drawSprite(
				ctx,
				sprite,
				this.dialogPadding,
				s * 3 / 4 + this.dialogPadding,
				s * 1 / 4 - 2 * this.dialogPadding);

			// draws the text
			var textX = s * 1/4 + this.dialogPadding;

			for (var i = 0; i < this.dialogLines[this.currentDialogLine].length; i++){

				// gets the y coord
				var y = s * 3/4 + this.dialogPadding;

				// draws the text
				ctx.setFont(this.dialogFontSize, this.dialogFont);
				ctx.fillStyle = "#ffffff";
				ctx.fillText(
					this.dialogLines[this.currentDialogLine][i],
					textX,
					y + (this.dialogFontSize * 1.1) * i + this.dialogFontSize * 0.5);

			}

		// draws the prompt for dialog if the player can talk to somebody
		}else if (this.parent.getPlayer().getHasDialog()){

			var fontSize = this.parent.s / 30;
			var font = "Press Start 2P";
			var ctx = this.parent.getCTX();

			var y = this.parent.s / 3;

			ctx.setFont(fontSize, font);

			var size = ctx.measureText("Press Q", ctx.getFontString(fontSize, font)).width;
			var x = (this.parent.s - size) / 2;

			ctx.fillStyle = "#ffffff";
			ctx.fillBorderedText("Press Q", x, y, 0.3, "#000000", "#ffffff");
		}
	},

	onKeys: function(keys){

		// checks if q is pressed
		if (keys.indexOf("q") !== -1){

			// checks that q was not pressed last frame
			if (this.lastKeys.indexOf("q") === -1){

				this.currentDialogLine++;

				// checks if the dialog is done
				if (this.currentDialogLine >= this.dialogLines.length){

					this.isRunningDialog = false;
					this.parent.unpause();
				}
			}
		}

		this.lastKeys = keys.slice();
	},

	startDialog: function(n){

		this.isRunningDialog = true;

		// resets dialog
		this.dialogLines = [];
		this.currentDialogLine = 0;

		// adds 'Q' to lastKeys so that it does not skip the first line
		this.lastKeys = ['q']

		// gets the dialog
		var thisDialog = dialogs[n];

		// used for measuring the text
		var ctx = this.parent.getCTX();

		// for each line, creates a new array in dialogLines
		for (var i = 0; i < thisDialog.length; i++){

			this.dialogLines.push([""]);

			// gets the line split into words
			var words = thisDialog[i].split(" ");

			// the index of the current segment
			var segmentIndex = 0;

			// gets the dimensions
			var maxSize = (this.parent.getAreaSize() * 3 / 4 - 2 * this.dialogPadding);

			for (var w = 0; w < words.length; w++){

				// checks if the word will fit on the line
				if (ctx.measureText(this.dialogLines[i][segmentIndex] + " " + words[w], ctx.getFontString(this.dialogFontSize, this.dialogFont)).width <= maxSize){
					this.dialogLines[i][segmentIndex] += " " + words[w];
				}else {
					// starts a new line
					this.dialogLines[i].push(words[w]);
					segmentIndex++;
				}
			}
		}

		// records which NPC it should use for the picture
		switch (n){
			case 0:
				this.npcName = "npcOne";
				break;

			case 1:
				this.npcName = "npcTwo";
				break;

			case 2:
				this.npcName = "npcThree";
				break;
		}

	}
})