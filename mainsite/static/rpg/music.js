var musicTracks = {
	trackOne: [],
	trackTwo: [],
	trackThree: []
};

var selectedTrack = "trackOne";

var Music = Class({

	canvas: null,
	ctx: null,

	w: 600,
	h: null,

	notesAcross: 0,
	notesDown: 0,

	topNoteGrid: null,
	botNoteGrid: null,

	activeNoteGrid: "top",

	init: function(p) {

		this.canvas = $("#music-canvas");
		this.ctx = this.canvas[0].getContext("2d");

		this.h = (this.canvas.height() / this.canvas.width()) * this.w

		this.canvas[0].width = this.w;
		this.canvas[0].height = this.h;

		// 8 notes per bar times 8 bars
		this.notesAcross = 8 * 8;
		this.notesDown = 8;

		this.noteWidth = this.w / this.notesAcross;
		this.noteHeight = 100 / this.notesDown;

		this.topNoteGrid = NoteGrid({
			x: 0,
			y: 10,
			w: this.w,
			h: 100,
			notesAcross: this.notesAcross / 2,
			notesDown: this.notesDown,

			// The first note on the bar
			// Notes go from here to notesAcross
			startNote: 0,
			onCycle: this.changeBars,
			onCycleParam: 0
		});

		this.botNoteGrid = NoteGrid({
			x: 0,
			y: 120,
			w: this.w,
			h: 100,
			notesAcross: this.notesAcross / 2,
			notesDown: this.notesDown,

			// The first note on the bar
			// Notes go from here to notesAcross
			startNote: this.notesAcross / 2,
			onCycle: this.changeBars,
			onCycleParam: 1
		})

		this.topNoteGrid.isActive = true;

		// Fills the array with empty notes
		for (var track in musicTracks){

			for (var i = 0; i < this.notesAcross; i++){
				musicTracks[track][i] = null;
			}
		}

		this.draw();

	},

	changeBars: function(i) {

		switch(i) {
			case 0:
				this.botNoteGrid.barPosition = 0;
				this.botNoteGrid.isActive = true;
				this.topNoteGrid.isActive = false;
				break;

			case 1:
				this.topNoteGrid.barPosition = 0;
				this.botNoteGrid.isActive = false;
				this.topNoteGrid.isActive = true;
				break;
		}
		
	},

	update: function() {
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.canvas[0].width;
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.canvas[0].height;

		this.topNoteGrid.update();
		this.botNoteGrid.update();

		this.draw();
	},
	onClick: function() {
		this.topNoteGrid.onClick(this.mouseX, this.mouseY);
		this.botNoteGrid.onClick(this.mouseX, this.mouseY);
	},
	onMouseHold: function() {

	},
	onMouseUp: function() {

	},
	draw: function(p) {

		ctx = this.ctx;

		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, this.w, this.h);

		this.topNoteGrid.draw(ctx, this.mouseX, this.mouseY);
		this.botNoteGrid.draw(ctx, this.mouseX, this.mouseY);

	}
})