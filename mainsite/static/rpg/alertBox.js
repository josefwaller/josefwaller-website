var close = false;

var AlertBox = Class({

	x: 0,
	y: 0,
	w: 0,
	h: 0,

	text: "",

	color: null,
	textColor: null,

	fontSize: null,

	isActivating: false,
	isActive: false,
	isDA: false,

	activateTime: 0,
	activateDuration: 500,

	closeButton: null,

	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.w = p.w;
		this.h = p.h;

		this.color = btnColors.dark;
		this.textColor = "#ffffff";
		this.fontSize = 20;

		this.title = p.title;
		this.text = p.text;

		this.closeButton = new Button({
			x: this.x + (this.w * 3/8),
			y: this.y + this.h - 40,
			w: this.w * 1/4,
			h: 40,
			text: "Cancel",
			onClick: function(p){
				close = true;
			},
			param: this
		});
	},

	draw: function(ctx, mX, mY){

		ctx.fillStyle = this.color;

		if (close){
			close = false;
			this.deActivate();
		}

		if (this.isActive){
			ctx.fillRoundedRect(
				this.x,
				this.y,
				this.w,
				this.h,
				10);
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

			this.closeButton.draw(ctx, mX, mY);

		}else if (this.isActivating){

			var percentage = (new Date().getTime() - this.activateTime) / this.activateDuration;


			ctx.fillStyle = this.color;

			ctx.fillRoundedRect(
				this.x + (this.w - (this.w * percentage)) / 2,
				this.y + (this.h - (this.h * percentage)) / 2,
				this.w * percentage,
				this.h * percentage,
				5);

			if (percentage >= 1){
				this.isActivating = false;
				this.isActive = true;
			}

		}else if (this.isDA){

			var percentage = (new Date().getTime() - this.activateTime) / this.activateDuration;


			ctx.fillRoundedRect(
				this.x + (this.w * percentage) / 2,
				this.y + (this.h * percentage) / 2,
				this.w - this.w * percentage,
				this.h - this.h * percentage,
				5 - 5 * percentage);

			if (percentage >= 1){
				this.isDA = false;
				this.isActive = false;
			}
		}

	},

	onClick: function(mX, mY){
		this.closeButton.checkForClick(mX, mY);

		console.log(this.isDA);
	},

	activate: function(){

		this.isActivating = true;
		this.activateTime = new Date().getTime();

	},

	deActivate: function(){
		this.activateTime = new Date().getTime();
		this.isDA = true;
		this.isActive = false;
		this.isActivating = false;
	}
});