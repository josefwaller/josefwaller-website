var sprites;
var background;

var screens;

var colors = [
	{r:0, g:0, b:0, sat:100, bright:100, hue:0},
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

var mousePos = {
	x:0,
	y:0
}

function setup () {
	
	sprites = {
		player: [],
		enemy_one: [],
		enemy_two: [],
		chest: [],
		npc_one: [],
		npc_two: [],
		npc_three: [],
		item_one: [],
		item_two: [],
		item_three: [],

		door_one: [],
		door_two: [],
		key_one: [],
		key_two: []
	}

	// Fills the empty arrays
	size = 10
	for (s in sprites){
		while (sprites[s].length < size){
			var arr = []
			while (arr.length < size){
				arr.push(null)
			}
			sprites[s].push(arr)
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
		mousePos.x = event.pageX,
		mousePos.y = event.pageY
	})

	$(document).click(function(event){
		art.onClick();
	})

	window.setInterval(update, 1000/60)

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
}

$(document.body).ready(setup)