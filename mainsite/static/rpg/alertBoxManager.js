var alert;

var AlertBoxManager = Class({
	
	// the parent container
	container: null,
	
	// the actual box
	element: null,
	
	// the text element inside the box
	text: null,
	
	// the input element inside the box
	inputContainer: null,
	
	// the different <input> elements
	inputs: [],
	
	// the different labels for returning
	labels: [],
	
	// the div which contains the loading symbol
	loading: null,
	
	// the button
	button: null,
	
	// the callback function
	callback: null,
	
	// whether it is showing or not
	isShowing: false,

	init: function(p){
	
		// gets all the elements
		this.container = $("#alert-box-container");
		this.element = $("#alert-box");
		this.text = $("#alert-box-text");
		this.button = $("#alert-box-btn");
		this.inputContainer = $("#alert-box-input-container");
		this.loading = $("#alert-box-loading");
		
		// makes the button hide it
		this.button.click(function(){
			alert.hide();
		});
		
		this.container.hide();
		
		this.isShowing = false;
		
	},
	
	//  shows the box
	show: function(message, labels, callback){

		// removes the up anim
		if (this.container.hasClass("up-anim")){
			this.container.removeClass("up-anim");
		}
		
		this.container.show();
		
		
		this.text.text(message);
		// adds the down animation
		this.container.addClass("down-anim");
		
		// gives all the labels their own input box
		this.labels = [];
		this.inputContainer.html("");
		for (var i = 0; i < labels.length; i++){
			
			// adds it to local copy 
			this.labels.push(labels[i]);
			
			// adds a new line to the input container
			this.inputContainer.append(labels[i] + ": ");
			this.inputs[i] = $("<input class='alert-box-input'></input>");
			this.inputContainer.append(this.inputs[i]);
			this.inputContainer.append($("<br>"));
		}
		
		// records the callback
		this.callback = callback;
		
		this.isShowing = true;
		
	},

	hide: function(){
		
		// removes the up anim
		if (this.container.hasClass("down-anim")){
			this.container.removeClass("down-anim");
		}
		// adds the down animation
		this.container.addClass("up-anim");
		
		// creates a return object 
		var returnObj = {};
		
		for (var i = 0; i < this.labels.length; i++){
			returnObj[this.labels[i]] = this.inputs[i].val();
		}
		
		// runs the callback
		if (this.callback !== null && this.callback !== undefined){
			this.callback(returnObj);
		}
		
		// hides all inputs
		for (var i = 0; i < this.inputs.length; i++){
			this.inputs[i].hide();
		}
		

		// removes the loading screen when it is done animating
		this.container.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
	 		alert.isShowing = false;
			alert.hideLoading();
		});
		
	},
	
	showLoading: function(){
		
		createLoading(this.loading);
	},
	
	hideLoading: function(){
		
		this.loading.html("");
		
	},
	
	getIsShowing: function(){
		return this.isShowing;
	}
});

$(window).on("load", function(){

	alert = new AlertBoxManager({});
});