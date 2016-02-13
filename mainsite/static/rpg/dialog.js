// All the dialogs
var dialogs = []
// The selected dialog
var selectedDialog = 0;

var Dialog = Class({
	
	// the parent div
	parentDiv: null,

	// managers to update the canvas
	canvasManagers: [],

	init: function(p){

		this.parentDiv = $("#dialog-container");

		numOfDialogs = 3;

		// Dialogs switch between player and npc[selectedDialog]
		while(dialogs.length < numOfDialogs){
			dialogs.push([]);
		}

		// Sets all the buttons to switch between dialogs
		for (var i = 0; i < 3; i++){
			$("#dialog-" + (i + 1)).click({i: i}, function(event) {
				dialog.selectDialog(event.data.i);
			})
		}

		// Updates the dialog div
		this.updateDialogs();

	},

	update: function() {
		for (var i = 0; i < this.canvasManagers.length; i++){
			this.canvasManagers[i].draw();
		}
	},

	updateDialogs: function() {

		// Clears canvas managers
		this.canvasManagers = [];

		// Clears div
		this.parentDiv.html("");

		for (var i = 0; i < dialogs[selectedDialog].length; i++){

			// Creates HTML elements
			var div = $("<div class='dialog-line'></div>");
			var portraitDiv = $("<div class='dialog-line-portrait'></div>");
			var canvas = $("<canvas></canvas>");
			var inputContainer = $("<div class='dialog-line-input-container'></div>");
			var input = $("<input type='text' class='dialog-line-input'>");

			// Sets the existing dialog
			input.val(dialogs[selectedDialog][i]);

			// Records new dialog
			input.change({line: i}, function(event) {
				i = event.data.line;
				dialogs[selectedDialog][i] = $(this).val();
			})

			// Appends the divs
			div.append(portraitDiv);
			div.append(inputContainer);
			inputContainer.append(input);
			portraitDiv.append(canvas);
			this.parentDiv.append(div);

			var object;

			// Checks if it should be an NPC
			if (i % 2 == 0){

				portraitDiv.append("NPC");

				switch (selectedDialog){
					case 0: 
						object = "npcOne";
						break;
					case 1: 
						object = "npcTwo";
					 	break;
					 case 2:
					 	object = "npcThree";
					 	break;

				}
			}else {
				
				portraitDiv.append("Player");
				object = "player";
			}

			// sets the manager
			this.canvasManagers[i] = SpriteCanvas({
				object: object,
				sprite: "dialog",
				canvas: canvas
			});

			this.canvasManagers[i].draw();
		}

		// Adds the 'Add a dialog' button
		button = $("<button class='dialog-add-button'></button>");
		button.click(function(){
			dialog.addDialog();
		});
		button.text("Add a line");

		this.parentDiv.append(button);

		// Adds the remove dialog button
		button = $("<button class='dialog-remove-button'></button>");
		button.click(function(){
			dialog.removeDialog();
		});
		button.text("Remove a line");

		this.parentDiv.append(button);
	},
	addDialog: function() {
		dialogs[selectedDialog].push("");
		this.updateDialogs();
	},
	removeDialog: function() {
		dialogs[selectedDialog].pop();
		this.updateDialogs();
	},

	selectDialog: function(index) {

		selectedDialog = index;
		dialog.updateDialogs();

		// Sets selected button
		for (var i = 0; i < 3; i++){

			var div = $("#dialog-" + (i + 1));

			if (i == index){
				div.attr("selected", "true");
			}else {
				div.removeAttr("selected");
			}
		}
	},

	// Filler functions
	onMouseUp:function(){},
	onMouseHold:function(){},
	onClick:function(){}
})