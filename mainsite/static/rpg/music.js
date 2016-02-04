var musicTrakcs = [];

var Music = Class({

	canvas: null,
	ctx: null,

	w: 600,
	h: null,

	notesAcross: 0,
	notesDown: 0,

	noteGrid: null,

	init: function(p) {

		this.canvas = $("#music-canvas");
		this.ctx = this.canvas[0].getContext("2d");

		this.h = (this.canvas.height() / this.canvas.width()) * this.w

		this.canvas[0].width = this.w;
		this.canvas[0].height = this.h;

		this.notesAcross = 8 * 4;
		this.notesDown = 8;

		this.noteWidth = this.w / this.notesAcross;
		this.noteHeight = 100 / this.notesDown;

		this.noteGrid = NoteGrid({
			x: 0,
			y: 0,
			w: this.w,
			h: 200,
			noteHeight: this.noteHeight,
			noteWidth: this.noteWidth
		});

		this.draw();

	},

	update: function() {
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.canvas[0].width;
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.canvas[0].height;

		this.draw();
	},
	onClick: function() {

	},
	onMouseHold: function() {

	},
	onMouseUp: function() {

	},
	draw: function(p) {

		ctx = this.ctx;

		ctx.fillStyle = "#aaaaaa";
		ctx.fillRect(0, 0, this.w, this.h);

		this.noteGrid.draw(ctx);

		// Draws highlighted note
		noteX = Math.round((this.mouseX + 5) / this.notesAcross) * this.notesAcross;
		noteY = Math.round(this.mouseY / this.notesDown) * this.notesDown;

		ctx.fillStyle = "#ffffff";
		ctx.fillRect(noteX, noteY, this.noteWidth, this.noteHeight);

	}
})