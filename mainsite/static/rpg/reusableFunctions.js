function drawSprite(ctx, sprite, offX, offY, s){

	// draws a sprite on the ctx at the x,y coord with size s

	var pixelSize = s / size;

	for (var x = 0; x < sprite.length; x++){

		for (var y = 0; y < sprite[x].length; y++){

			if (sprite[x][y] !== null){

				ctx.fillStyle = colors[sprite[x][y]].hex;
				ctx.fillRect(
					offX + pixelSize * x, 
					offY + pixelSize * y, 
					pixelSize, 
					pixelSize
					);
			}
		}
	}
}
function setUpObjects(){

	var objectNames = [
		"player",
		"meleeEnemyOne",
		"meleeEnemyTwo",
		"rangedEnemyOne",
		"rangedEnemyTwo",
		"npcOne",
		"npcTwo",
		"npcThree",
		"meleeWeapon",
		"rangedWeapon",
		"invincibleBarrier",
		"breakableBarrier",
		"goal"
		
	];
	
	objects = [];

	for (var i in objectNames){

		// creates a new object
		objects.push({
			name: objectNames[i],
			object: objectNames[i],
			sprite: Object.keys(sprites[objectNames[i]])[0],
			maxNum: 3,
			num: 0
		});

		var index = objects.length - 1;

		// changes the max value if it needs to be changed
		switch (i){

			case "player":
				objects[index].maxNum = 1;
				break;

			case ("breakableBarrier" || "invincibleBarrier"):
				objects[index].maxNum = 20;
				break;
		}
	}
		
}
function setUpLoading(){
	

	// gets loading divs
	var loading = $("#loading");
	var loadingCont = $("#loading-container");

	// shows the loading screen and hides the rest
	loading.show();
	$("#rpgmaker-container").hide();

	// sets the margin for the vetically aligned div
	loadingCont.css("margin-top", (loading.height() - loadingCont.height()) / 2);

	// sets up animation cicle thingy
	var parent = $("#loading-circle");
	parent.html("");
	
	createLoading(parent);
}
function getKeyFromKeyCode(keyCode){

	// returns a string representation of the key
	// note Jquery event.key does not work in Chrome or IE8

	switch (keyCode){

		case 37:
			return "ArrowLeft";

		case 38:
			return "ArrowUp";

		case 39:
			return "ArrowRight";

		case 40:
			return "ArrowDown";

		case 32:
			return " ";

		case 81:
			return "q";

	}

}

function createLoading(parent) {

	// creates 8 dots
	for (var i = 0; i < 8; i++){

		// creates dot and container elements
		var outerContainer = $("<div id='loading-circle-fixed-container'></div>");
		var container = $("<div id='loading-circle-container'></div>");

		// sets the css
		container.css("animation-delay", (i / 10) + "s");

		// appends things to other things
		outerContainer.append(container);
		container.append($("<div id='loading-circle-dot'></div>"));
		parent.append(outerContainer);

	}
	
}