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
	}

});