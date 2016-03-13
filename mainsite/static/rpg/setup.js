var sprites;
var background;

var screens;

var btnColors = {
	color: "#3399ff",
	text:"#ffffff",
	hover: "#4da6ff",
	dark: "#0066cc"
}

var colors = [
	{r:255, g:0, b:0, sat:0, bright:0, hue:0, hex:"#000000"},
	{r:255, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:255, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:255, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:255, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:255, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:255, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:255, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"}
]

var currentScreen;

var art;
var music;
var dialog;
var levelEditor;

var mouse = {
	pos : {
		x:0,
		y:0
	},
	click: false,
	middleClick: false,
	hold: false
}

function setup () {

	var loading = $("#loading");

	//hides the loading screen
	loading.addClass("loading-down-anim");

	// removes the loading screen when it is done animating
	loading.one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
		loading.html("");
	});

	$("#rpgmaker-container").show();

	// Sets up art canvas
	art = Art({size: 16});

	// sets up music canvas
	music = Music({});

	// sets up dialog
	dialog = Dialog({});

	// sets up level editor
	levelEditor = LevelEditor({});

	// Sets up changing screens
	$("#level-editor-btn").click({i:0}, changeScreen);
	$("#art-btn").click({i:1}, changeScreen);
	$("#music-btn").click({i:2}, changeScreen);
	$("#dialog-btn").click({i:3}, changeScreen);

	// note that the game button does not call changeScreen
	$("#game-btn").click(showGameScreen);

	// sets up the game screen
	var game = $("#game-canvas");
	var gameCont = $("#game");

	game.css("margin-top", (gameCont.height() - game.height()) / 2);


	// Sets screens
	screens = {
		levelEditor: $("#level-editor"),
		art: $("#art"),
		music: $("#music"),
		dialog: $("#dialog"),
		game: $("#game")
	}

	// Sets mouse position when it moves
	$(document).mousemove(function(event) {
		mouse.pos.x = event.pageX;
		mouse.pos.y = event.pageY;
	})

	// Sets mouse values in current situation
	$(document).mousedown(function(event){
		switch (event.which){
			case 1:
				mouse.down = true;
				mouse.click = true;
				break;

			case 2:
				mouse.middleClick = true;
				break;
		}
	})
	$(document).mouseup(function(event){
		mouse.down = false;
	})
	changeScreen(null, 0);
	window.setTimeout(update, 1000/60)

}

function changeScreen(event, i) {

	// Checks if it was a button click
	if (event !== null){
		i = event.data.i;
	}

	// Hides all the screens
	for (var s in screens){
		screens[s].hide();
	}

	// Chooses the appropriate screen

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

		case 3:
			screens.dialog.show();
			break;
	}

	// Records the current screen
	currentScreen = i;
}

function update() {
	managers = [
		levelEditor,
		art,
		music,
		dialog
	];

	// Resets the pointer
	$(document.body).css("cursor", "initial");

	managers[currentScreen].update();

	if (mouse.down){
		managers[currentScreen].onMouseHold();
	}else {
		managers[currentScreen].onMouseUp();
	}

	if (mouse.click){
		managers[currentScreen].onClick();

		mouse.click = false;
	}else if (mouse.middleClick){
		managers[currentScreen].onMiddleClick();

		this.mouse.middleClick = false;
	}

	window.setTimeout(update, 1000/60);
}

function showGameScreen(){

	// screens.game.className = "game-down-anim";
	screens.game.show();

}

// shows the loading screen
$(document.body).ready(function(){

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
});

// after loading, shows the stuff
$(window).on("load", function(){setup()});