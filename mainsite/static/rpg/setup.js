var sprites;
var background;

var screens;

var colors = [
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:null},
	{r:0, g:0, b:0, sat:100, bright:100},
	{r:0, g:0, b:0, sat:100, bright:100},
	{r:0, g:0, b:0, sat:100, bright:100},
	{r:0, g:0, b:0, sat:100, bright:100},
	{r:0, g:0, b:0, sat:100, bright:100},
	{r:0, g:0, b:0, sat:100, bright:100},
	{r:0, g:0, b:0, sat:100, bright:100},
]

var currentScreen;
var art;

var mouse = {
	pos : {
		x:0,
		y:0
	},
	click: false,
	hold: false
}

function setup () {
	
	sprites = {
		player: {
			runOne: [],
			runTwo: []
		},
		enemy_one: {
			runOne: [],
			runTwo: []
		}
	}

	// Fills the empty arrays
	size = 10
	for (s in sprites){

		for (index in sprites[s]){

			while (sprites[s][index].length < size){

				var arr = []
				while (arr.length < size){
					arr.push(null)
				}

				sprites[s][index].push(arr)
			}
		}
	}

	// Sets up art canvas
	art = Art(size);

	// Sets up changing screens
	$("#level-editor-btn").click({i:0}, changeScreen)
	$("#art-btn").click({i:1}, changeScreen)
	$("#music-btn").click({i:2}, changeScreen)

	// Sets screens
	screens = {
		levelEditor: $("#level-editor"),
		art: $("#art"),
		music: $("#music")
	}

	$(document).mousemove(function(event) {
		mouse.pos.x = event.pageX,
		mouse.pos.y = event.pageY
	})

	$(document).mousedown(function(event){
		mouse.down = true;
		mouse.click = true;
	})
	$(document).mouseup(function(event){
		mouse.down = false;
	})

	window.setInterval(update, 1000/30)

}

function changeScreen(event) {
	i = event.data.i;
	screens.levelEditor.hide();
	screens.art.hide();
	screens.music.hide();

	switch(i){
		case 0:
			screens.levelEditor.show();
			console.log("ASDF")
			break;
		case 1:
			screens.art.show();
			break;
		case 2:
			screens.music.show();
			break;
	}
}

function update() {
	art.update();

	if (mouse.down){
		art.onMouseHold();
	}else {
		art.onMouseUp();
	}

	if (mouse.click){
		art.onClick();

		mouse.click = false;
	}
}

$(document.body).ready(setup)