var ButtonGroup = Class({

	btnGroup: null,

	selectedBtn: null,

	init: function(p) {

		this.btnGroup = $("#" + p.id);

	},

	selectButton: function(id){

		$(this.btnGroup.children()[this.selectedBtn]).removeAttr("selected");

		// Selects a button and sets the crosshairs appropriatly
		this.selectedBtn = id;
		$(this.btnGroup.children()[this.selectedBtn]).attr("selected", "true");

		this.checkForJustification();
		
	},

	checkForJustification: function(){

		// checks if the buttons do not fill up the whole div tag
		// if so, they should be justified

		// sets it to default 

		this.btnGroup.attr("class", "btn-group-horizontal");

		var totalWidth = 0;

		var allFitWidth = true;
		var widthForEach = this.btnGroup.width() / this.btnGroup.children().length;

		for (var i = 0; i < this.btnGroup.children().length; i++){

			var child = $(this.btnGroup.children()[i]);

			if (child.width() > widthForEach){

				allFitWidth = false;
				break;

			}

			totalWidth += child.width();

		}

		if (totalWidth < this.btnGroup.width() && allFitWidth){

			this.btnGroup.attr("class", "btn-group btn-group-justified");

		}

	}

});