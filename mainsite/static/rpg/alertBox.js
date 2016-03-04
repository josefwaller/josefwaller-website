var close = false;

var AlertBox = new Class({

	x: 0,
	y: 0,
	w: 0,
	h: 0,

	// Radius
	r: 10,

	text: "",

	color: null,
	textColor: null,

	fontSize: null,

	// Plays the zooming in effect
	isActivating: false,
	// Is zoomed in, just draw
	isActive: false,
	// should zoom out
	isDeactivating: false,

	activateTime: 0,
	activateDuration: 500,

	buttons: [],

	closeButton: null,

	init: function(p){

		this.x = p.w / 6,
		this.y = p.h / 5,
		this.w = p.w * (2/3),
		this.h = p.h / 4,

		this.color = btnColors.dark;
		this.textColor = "#ffffff";
		this.fontSize = 20;

		this.title = p.title;
		this.text = p.text;

		this.buttons = [];

		this.changeButtons(p.buttons);
	},

	changeButtons: function(b) {

		this.buttons = [];
		
		var btnW = this.w / 4;
		var btnH = this.h / 4;
		var btnY = this.y + this.h * 3/4 - 5;

		if (b === undefined){
			// Adds default close button
			this.buttons.push(this.closeButton = new Button({
				x: this.x + (this.w * 3/8),
				y: btnY,
				w: btnW,
				h: btnH,
				text: "Cancel",
				onClick: function(){
					close = true;
				}
			}));

		}else {

			var buttonOffsetX = this.x + (this.w - ((b.length + 1) * btnW)) / 2;

			for (var i = 0; i < b.length; i++){
				this.buttons.push(new Button({
					x: buttonOffsetX + i * btnW,
					y: btnY,
					h: btnH,
					w: btnW,
					text: b[i].text,
					param: b[i].onClick,
					onClick: function(p){
						p();
						close = true;
					}
				}));
			}

			// Adds default close button
			this.buttons.push(new Button({
				x: buttonOffsetX + b.length * btnW,
				y: btnY,
				w: btnW,
				h: btnH,
				text: "Cancel",
				onClick: function(){
					close = true;
				}
			}));
		}
	},

	draw: function(ctx, mX, mY){

		ctx.fillStyle = this.color;

		// checks if it should deactivate
		if (close){
			close = false;
			this.deActivate();
		}

		// draws itself defaults
		if (this.isActive){

			ctx.fillRoundedRect(
				this.x,
				this.y,
				this.w,
				this.h,
				this.r);
			// Draws title
			ctx.setFont(this.fontSize, "Raleway");
			ctx.fillStyle = this.textColor;
			ctx.fillText(
				this.title,
				this.x + (this.w - ctx.measureText(this.title, ctx.getFontString(this.fontSize, "Raleway")).width) / 2,
				this.y + this.fontSize);

			// Draws text
			ctx.setFont(11, "Raleway");

			ctx.fillText(
				this.text,
				this.x + (this.w - ctx.measureText(this.text, ctx.getFontString(this.fontSize / 2, "Raleway")).width) / 2,
				this.y + this.h / 2);

			for (var i = 0; i < this.buttons.length; i++){
				this.buttons[i].draw(ctx, mX, mY)
			}

		}else if (this.isActivating){

			var percentage = (new Date().getTime() - this.activateTime) / this.activateDuration;


			ctx.fillStyle = this.color;

			ctx.fillRoundedRect(
				this.x + (this.w - (this.w * percentage)) / 2,
				this.y + (this.h - (this.h * percentage)) / 2,
				this.w * percentage,
				this.h * percentage,
				this.r * percentage);

			if (percentage >= 1){
				this.isActivating = false;
				this.isActive = true;
			}

		}else if (this.isDeactivating){

			var percentage = (new Date().getTime() - this.activateTime) / this.activateDuration;

			// checks for deactivation
			if (percentage >= 1){
				this.isDeactivating = false;
				this.isActive = false;
			}else {

				// draws it shrinking
				ctx.fillRoundedRect(
					this.x + (this.w * percentage) / 2,
					this.y + (this.h * percentage) / 2,
					this.w - this.w * percentage,
					this.h - this.h * percentage,
					this.r - this.r * percentage);
			}
		}

	},

	onClick: function(mX, mY){
		if (this.isActive){

			console.log("Active");

			for (var i = 0; i < this.buttons.length; i++){
				this.buttons[i].checkForClick(mX, mY);
			}
		}
	},

	activate: function(){

		this.isActivating = true;
		this.activateTime = new Date().getTime();

	},

	deActivate: function(){
		this.activateTime = new Date().getTime();
		this.isDeactivating = true;
		this.isActive = false;
		this.isActivating = false;
	}
});