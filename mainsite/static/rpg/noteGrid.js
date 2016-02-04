var NoteGrid = Class({
	
	x: 0,
	y: 0,
	w: 0,
	h: 0,

	init: function(p) {

		this.x = p.x;
		this.y = p.y;
		this.h = p.h;
		this.w = p.w;

		this.notesAcross = p.notesAcross;
		this.notesDown = p.notesDown;

		this.noteHeight = this.h / this.notesDown;
		this.noteWidth = this.w / this.notesAcross;
	},

	draw: function(ctx) {

		offsetY = 5;

		ctx.fillStyle = "#dddddd";
		ctx.fillRect(
			0, 
			offsetY, 
			this.noteWidth * this.notesAcross, 
			this.notesDown * this.noteHeight);


		ctx.fillStyle = "#000000";

		for (var x = 0; x < this.notesAcross + 1; x++){

			if (x % 4 == 0){
				width = 4;
			}else {
				width = 2;
			}

			ctx.fillRect(
				this.noteWidth * x - 2,
				offsetY,
				width,
				this.noteHeight * this.notesDown);
		}
		for (var y = 0; y < this.notesDown + 1; y++){
			ctx.fillRect(
				0,
				offsetY + this.noteHeight * y,
				this.noteWidth * this.notesAcross,
				2);
		}
	}

})