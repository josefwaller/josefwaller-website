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

	notes: {
		layerOne: [],
		layerTwo: [],
		layerThree: []
	},

	lastNote: {},

	isActive: false,

	init: function(p) {

		this.x = Math.round(p.x);
		this.y = Math.round(p.y);
		this.h = Math.round(p.h);
		this.w = p.w;

		this.notesAcross = p.notesAcross;
		this.notesDown = p.notesDown;

		this.noteHeight = Math.round(this.h / this.notesDown);
		this.noteWidth = this.w / this.notesAcross;
		
		this.startNote = p.startNote;

		this.lastTime = new Date().getTime();
		this.musicSpeed = 0.1;
		this.onCycleParam = p.onCycleParam;

		this.notes.layerOne = [
			$("#sound-l1-8"),
			$("#sound-l1-7"),
			$("#sound-l1-6"),
			$("#sound-l1-5"),
			$("#sound-l1-4"),
			$("#sound-l1-3"),
			$("#sound-l1-2"),
			$("#sound-l1-1")
		];
		this.notes.layerTwo = [
			$("#sound-l2-8"),
			$("#sound-l2-7"),
			$("#sound-l2-6"),
			$("#sound-l2-5"),
			$("#sound-l2-4"),
			$("#sound-l2-3"),
			$("#sound-l2-2"),
			$("#sound-l2-1")
		];
		this.notes.layerThree = [
			$("#sound-l3-8"),
			$("#sound-l3-7"),
			$("#sound-l3-6"),
			$("#sound-l3-5"),
			$("#sound-l3-4"),
			$("#sound-l3-3"),
			$("#sound-l3-2"),
			$("#sound-l3-1")
		];

		this.lastNote = {
			layerOne: 1,
			layerTwo: 1,
			layerThree: 2
		};
	},

	update: function(){

		if (this.isActive){

			this.barPosition += barSpeed * (new Date().getTime() - this.lastTime);

			// Checks if the bar has passed the edge of the grid
			if (this.barPosition > this.w){
				music.changeBars(this.onCycleParam);

				this.isActive = false;
				
				this.stopNotes();
			}else {

				// Checks if it should be playing a note
				this.playNote();
			}
		}

		this.lastTime = new Date().getTime();
	},

	// Plays a note if the bar should
	playNote: function() {

		for (layer in musicTracks){

			note = this.getNote(layer);

			lastNote = this.lastNote[layer];

			if (note !== lastNote){

				if (note !== null){
					// Plays the new note
					this.notes[layer][note][0].volume = volumes[layer] * volumes.master;
					this.notes[layer][note][0].play();

				}

				// Stops the old note
				if (lastNote !== null){
					// Resets the old note
					this.notes[layer][lastNote][0].pause();
					this.notes[layer][lastNote][0].currentTime = 0;
				}

				this.lastNote[layer] = note;
			}
		}

	},
	// Stops all notes
	stopNotes: function() {

		for (layer in musicTracks){
		
			for (var i = 0; i < this.notes[layer].length; i++){
				this.notes[layer][i][0].pause();
				this.notes[layer][i][0].currentTime = 0;
			}
		}
	},
	// Gets the current note
	getNote: function(layer) {

		if (this.barPosition > this.w){
			return null;
		}

		percentage = this.barPosition / this.w;
		index = Math.floor(this.notesAcross * percentage) + this.startNote;
		note = musicTracks[layer][index];

		return note;
	},

	onClick: function(mouseX, mouseY) {

		pixel = this.getSelectedPixel(mouseX, mouseY);

		if (pixel !== null){

			note = musicTracks[selectedLayer][pixel.x + this.startNote];

			if (note !== pixel.y){

				musicTracks[selectedLayer][pixel.x + this.startNote] = pixel.y;

			}else {

				musicTracks[selectedLayer][pixel.x + this.startNote] = null;
			}
		}
	},
	draw: function(ctx, mouseX, mouseY) {

		// draws background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(
			this.x, 
			this.y, 
			this.w, 
			this.h);


		// Draws all active notes

		ctx.fillStyle = "#66ff66";
		for (var x = 0; x < this.notesAcross; x++){

			for (layer in musicTracks){

				// Chooses color
				color = "";
				switch (layer){
					case "layerOne":
						color = "#66ff66";
						break;

					case "layerTwo":
						color = "#ff9933";
						break;

					case "layerThree":
						color = "#ff66cc";
						break;
				}

				ctx.fillStyle = color;

				if (layer == selectedLayer){
					ctx.globalAlpha = 1;
				}else {
					ctx.globalAlpha = 0.5;
				}

				if (musicTracks[layer][x + this.startNote] !== null){

					ctx.fillRect(
						this.x + this.noteWidth * x,
						this.y + this.noteHeight * (musicTracks[layer][x + this.startNote]),
						this.noteWidth,
						this.noteHeight);

				}

				ctx.globalAlpha = 1;
			}

		}


		// Draws highlighted note
		pixel = this.getSelectedPixel(mouseX, mouseY);

		if (pixel !== null){
			ctx.fillStyle = "#aaaaaa";
			ctx.fillRect(
				Math.round(this.x + pixel.x * this.noteWidth), 
				Math.round(this.y + pixel.y * this.noteHeight), 
				Math.round(this.noteWidth), 
				Math.round(this.noteHeight));
		}	

		// draws the grid
		ctx.fillStyle = "#000000";

		for (var x = 0; x < this.notesAcross + 1; x++){

			if (x % 4 == 0){
				width = 2;
			}else {
				width = 1;
			}

			ctx.fillRect(
				Math.round(this.x + this.noteWidth * x - width / 2),
				Math.round(this.y),
				Math.round(width),
				Math.round(this.noteHeight * this.notesDown));
		}
		for (var y = 0; y < this.notesDown + 1; y++){

			width = 1;
			ctx.fillRect(
				Math.round(this.x),
				Math.round(this.y + this.noteHeight * y - width / 2),
				Math.round(this.noteWidth * this.notesAcross),
				width);
		}

		if (this.isActive){
			// Draws bar
			ctx.fillStyle = "#000000";
			ctx.fillRect(
				Math.round(this.x + this.barPosition),
				this.y,
				2,
				Math.round(this.noteHeight * this.notesDown));

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

	checkForBarMovement: function(mouseX, mouseY){
		if (mouseX > this.x && mouseX < this.x + this.w){
			if (mouseY > this.y && mouseY < this.y + this.h){

				this.barPosition = mouseX - this.x;
				this.isActive = true;

				return true;
			}
		}

		return false;
	}

})