var NoteGrid = Class({
	
	x: 0,
	y: 0,
	w: 0,
	h: 0,

	notesDown: 0,
	notesAcross: 0,

	noteWidth: 0,
	noteHeight: 0,

	lastTime: 0,
	musicSpeed: 0,
	barPosition: 0,

	init: function(p) {

		this.x = p.x;
		this.y = p.y;
		this.h = p.h;
		this.w = p.w;

		this.notesAcross = p.notesAcross;
		this.notesDown = p.notesDown;

		this.noteHeight = this.h / this.notesDown;
		this.noteWidth = this.w / this.notesAcross;
		
		this.startNote = p.startNote;

		this.lastTime = new Date().getTime();
		this.musicSpeed = 0.1;
		this.onCycleParam = p.onCycleParam;
	},

	update: function(){

		if (this.isActive){

			this.barPosition += this.musicSpeed * (new Date().getTime() - this.lastTime);

			// Checks if the bar has passed the edge of the grid
			if (this.barPosition > this.x + this.w){
				console.log(this.barPosition)
				music.changeBars(this.onCycleParam);
			}
		}
		this.lastTime = new Date().getTime();
	},

	onClick: function(mouseX, mouseY) {

		pixel = this.getSelectedPixel(mouseX, mouseY);

		if (pixel !== null){
			musicTracks[selectedTrack][pixel.x + this.startNote] = pixel.y;
			console.log("ASDF")
		}
	},
	draw: function(ctx, mouseX, mouseY) {

		ctx.fillStyle = "#000000";
		ctx.fillRect(
			0, 
			this.y, 
			this.noteWidth * this.notesAcross, 
			this.notesDown * this.noteHeight);


		// Draws all active notes

		ctx.fillStyle = "#66ff66";
		for (var x = 0; x < this.notesAcross; x++){

			if (musicTracks[selectedTrack][x + this.startNote] !== null){

				ctx.fillRect(
					this.x + this.noteWidth * x,
					this.y + this.noteHeight * (musicTracks[selectedTrack][x + this.startNote]),
					this.noteWidth,
					this.noteHeight);

			}

		}

		ctx.fillStyle = "#595959";

		for (var x = 0; x < this.notesAcross + 1; x++){

			if (x % 4 == 0){
				width = 4;
			}else {
				width = 2;
			}

			ctx.fillRect(
				this.noteWidth * x - 2,
				this.y,
				width,
				this.noteHeight * this.notesDown);
		}
		for (var y = 0; y < this.notesDown + 1; y++){
			ctx.fillRect(
				0,
				this.y + this.noteHeight * y,
				this.noteWidth * this.notesAcross,
				2);
		}

		// Draws bar
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(
			this.x + this.barPosition,
			this.y,
			2,
			this.noteHeight * this.notesDown);


		// Draws highlighted note
		pixel = this.getSelectedPixel(mouseX, mouseY);

		if (pixel !== null){
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(
				this.x + pixel.x * this.noteWidth - 1, 
				this.y + pixel.y * this.noteHeight, 
				this.noteWidth, 
				this.noteHeight - 1);
		}	
	},
	getSelectedPixel: function(mouseX, mouseY) {

		if (mouseX > this.x && mouseX < this.x + this.w){
			if (mouseY > this.y && mouseY < this.y + this.h){

				noteX = Math.floor((mouseX - this.x) / this.noteWidth);
				noteY = Math.floor((mouseY - this.y) / this.noteHeight);

				return {
					x: noteX,
					y: noteY
				};
			}
		}

		return null;
	},

})