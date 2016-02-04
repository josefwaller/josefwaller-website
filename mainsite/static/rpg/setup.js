var sprites;
var background;

var screens;

var colors = [
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"}
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
			runDownOne: [],
			runDownTwo: [],
			runSideOne: [],
			runSideTwo: [],
			runUpOne: [],
			runUpTwo: []
		},
		enemyOne: {
			runDownOne: [],
			runDownTwo: [],
			attackDown: []
		}
	}

	// Fills the empty arrays
	size = 16
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
	art = Art({size: size});

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

	// Sets mouse position when it moves
	$(document).mousemove(function(event) {
		mouse.pos.x = event.pageX;
		mouse.pos.y = event.pageY;
	})

	// Sets mouse values in current situation
	$(document).mousedown(function(event){
		mouse.down = true;
		mouse.click = true;
	})
	$(document).mouseup(function(event){
		mouse.down = false;
	})
	changeScreen(null, 1);
	window.setInterval(update, 1000/60)

}

function changeScreen(event, i) {

	if (event !== null){
		i = event.data.i;
	}
	screens.levelEditor.hide();
	screens.art.hide();
	screens.music.hide();

	switch(i){
		case 0:
			screens.levelEditor.show();
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