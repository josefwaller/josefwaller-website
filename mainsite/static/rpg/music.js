var musicTracks = {
	layerOne: [],
	layerTwo: [],
	layerThree: []
};

var volumes = {
	layerOne: 1,
	layerTwo: 1,
	layerThree: 1,
	master: 1
};

var selectedLayer = "layerOne";

var barSpeed = 0.1;

var Music = Class({

	canvas: null,
	ctx: null,

	w: 600,
	h: null,

	notesAcross: 0,
	notesDown: 0,

	topNoteGrid: null,
	botNoteGrid: null,

	volumeScrollBar: null,
	masterScrollBar: null,

	pauseButton: null,
	clearLayerButton: null,

	isPaused: false,

	init: function(p) {

		this.canvas = $("#music-canvas");

		this.w = 700;
		this.h = 416

		this.ctx = CTXPro({canvas: this.canvas, w: this.w, h: this.h});

		// 8 notes per bar times 8 bars
		this.notesAcross = 8 * 8;
		this.notesDown = 8;

		this.noteWidth = this.w / this.notesAcross;
		this.noteHeight = 100 / this.notesDown;

		this.topNoteGrid = NoteGrid({
			x: 10,
			y: 10,
			w: this.w - 20,
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
			x: 10,
			y: 120,
			w: this.w - 20,
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

		// Sets the buttons to change the selected layer
		btnIds = ["l1-btn", "l2-btn", "l3-btn"];
		layers = ["layerOne", "layerTwo", "layerThree"];

		for (var i = 0; i < btnIds.length; i++){
			l = layers[i];

			$("#" + btnIds[i]).click({layer: l}, function(event) {
				music.changeLayer(event.data.layer);
			})
		}

		// Top layer of settings
		var paddingWidth = 15;
		var y = 270;

		this.volumeScrollBar = new ScrollBar({
			x: paddingWidth,
			y: y,
			w: this.w / 3 - 2 * paddingWidth,
			h: 30,
			text: "Volume"
		});

		this.speedScrollBar = new ScrollBar({
			x: this.w / 3 + paddingWidth,
			y: y,
			w: this.w / 3 - 2 * paddingWidth,
			h: 30,
			text: "Speed"
		});

		this.pauseButton = new Button({
			x: this.w * 2/3 + paddingWidth,
			y: y,
			w: this.w / 3 - 2 * paddingWidth,
			h: 30,
			text: "Stop",
			color: btnColors.color,
			textColor: btnColors.text,
			hoverColor: btnColors.hover,
			font: "Raleway",
			fontSize: 11,
			textY: null,

			onClick: function(){music.onPauseClick()}
		})

		// Bottom layer
		this.masterScrollBar = new ScrollBar({

			x: paddingWidth,
			y: y + 30 + paddingWidth,
			w: this.w / 2 - 2 * paddingWidth,
			h: 30,
			text: "Master Volume"
		})

		this.clearLayerButton = new Button({
			x: this.w * 1/2 + paddingWidth,
			y: y + 30 + paddingWidth,
			w: this.w / 2 - 2 * paddingWidth,
			h: 30,
			text: "Clear Layer",
			color: btnColors.color,
			textColor: btnColors.text,
			hoverColor: btnColors.hover,
			font: "Raleway",
			fontSize: 11,
			textY: null,
			onClick: function(){music.clearLayer()}
		})


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
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.w;
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.h;

		this.topNoteGrid.update();
		this.botNoteGrid.update();

		this.draw();
	},
	onClick: function() {
		this.topNoteGrid.onClick(this.mouseX, this.mouseY);
		this.botNoteGrid.onClick(this.mouseX, this.mouseY);

		this.volumeScrollBar.onClick(this.mouseX, this.mouseY);
		this.speedScrollBar.onClick(this.mouseX, this.mouseY);
		this.masterScrollBar.onClick(this.mouseX, this.mouseY);

		this.pauseButton.checkForClick(this.mouseX, this.mouseY);
		this.clearLayerButton.checkForClick(this.mouseX, this.mouseY);
	},
	onMouseHold: function() {
		
		if (this.volumeScrollBar.onMouseHold(this.mouseX, this.mouseY)){
			volumes[selectedLayer] = this.volumeScrollBar.value;
		}

		if (this.speedScrollBar.onMouseHold(this.mouseX, this.mouseY)){
			if (this.speedScrollBar.value === 0){
				this.speedScrollBar.value = 0.001;
			}
			barSpeed = this.speedScrollBar.value / 5;
		}

		if (this.masterScrollBar.onMouseHold(this.mouseX, this.mouseY)){

			volumes.master = this.masterScrollBar.value;
		}
	},
	onMouseUp: function() {
		this.volumeScrollBar.isSelected = false;
		this.speedScrollBar.isSelected = false;
	},
	onMiddleClick: function() {
		if (this.topNoteGrid.checkForBarMovement(this.mouseX, this.mouseY)){

			this.botNoteGrid.barPosition = 0;
			this.botNoteGrid.isActive = false;
			this.botNoteGrid.stopNotes();

		}else if (this.botNoteGrid.checkForBarMovement(this.mouseX, this.mouseY)){

			this.topNoteGrid.barPosition = 0;
			this.topNoteGrid.isActive = false;
			this.topNoteGrid.stopNotes();
		}
	},
	draw: function(p) {

		ctx = this.ctx;

		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, this.w, this.h);

		this.topNoteGrid.draw(ctx, this.mouseX, this.mouseY);
		this.botNoteGrid.draw(ctx, this.mouseX, this.mouseY);

		this.volumeScrollBar.draw(ctx);
		this.speedScrollBar.draw(ctx);

		this.masterScrollBar.draw(ctx);

		this.pauseButton.draw(ctx, this.mouseX, this.mouseY);
		this.clearLayerButton.draw(ctx, this.mouseX, this.mouseY);
	},
	onPauseClick: function(){

		if (this.isPaused){
			this.topNoteGrid.isActive = true;
			this.topNoteGrid.barPosition = 0;
			this.isPaused = false;
			this.pauseButton.text = "Stop";
		}else {
			this.topNoteGrid.isActive = false;
			this.botNoteGrid.isActive = false;
			this.isPaused = true;
			this.pauseButton.text = "Start";
		}
	},
	changeLayer: function(layer){
		selectedLayer = layer;
		this.volumeScrollBar.value = volumes[selectedLayer];
		
		// Sets selected
		$("#l1-btn").removeAttr("selected");
		$("#l2-btn").removeAttr("selected");
		$("#l3-btn").removeAttr("selected");

		switch (layer){
			case "layerOne":
				$("#l1-btn").attr("selected", "true");
				break;
			case "layerTwo":
				$("#l2-btn").attr("selected", "true");
				break;
			case "layerThree":
				$("#l3-btn").attr("selected", "true");
				break;

		}
	},
	clearLayer: function(){
	
		for (var i = 0; i < this.notesAcross; i++){
			musicTracks[selectedLayer][i] = null;
		}
	}
})