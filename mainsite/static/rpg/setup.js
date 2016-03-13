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
var game;


var mouse = {
	pos : {
		x:0,
		y:0
	},
	click: false,
	middleClick: false,
	hold: false
}

var size = 16;

var playingGame = false;

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
	art = Art({size: size});

	// sets up music canvas
	music = Music({});

	// sets up dialog
	dialog = Dialog({});

	// sets up level editor
	levelEditor = LevelEditor({});

	// sets up the game player
	game = GamePlayer({});

	// Sets up changing screens
	$("#level-editor-btn").click({i:0}, changeScreen);
	$("#art-btn").click({i:1}, changeScreen);
	$("#music-btn").click({i:2}, changeScreen);
	$("#dialog-btn").click({i:3}, changeScreen);

	// note that the game button does not call changeScreen
	$("#game-btn").click(showGameScreen);

	//sets up load and save screens
	$("#save").click(saveGame);
	$("#load").click(loadGame);

	// sets up the game screen
	var gameScreen = $("#game");
	var gameCont = $("#game-cont");

	gameCont.css("margin-top", (gameScreen.height() - gameCont.height()) / 2);

	$("#game-quit-btn").click(hideGameScreen);


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
	});

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
	});

	$(document).mouseup(function(event){
		mouse.down = false;
	});

	// sets screen to default
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

	if (playingGame){

		m = game;

	}else {


		// gets all the managers
		managers = [
			levelEditor,
			art,
			music,
			dialog
		];

		m = managers[currentScreen];
	}

	// Resets the pointer
	$(document.body).css("cursor", "initial");

	// updates
	m.update();

	// runs any mouse-related functions
	if (mouse.down){
		m.onMouseHold();
	}else {
		m.onMouseUp();
	}

	if (mouse.click){

		m.onClick();

		mouse.click = false;

	}else if (mouse.middleClick){

		m.onMiddleClick();

		this.mouse.middleClick = false;

	}

	// sets to update again
	window.setTimeout(update, 1000/60);
}

function showGameScreen(){

	// removes the up anim
	if (screens.game.hasClass("game-up-anim")){
		screens.game.removeClass("game-up-anim");
	}
	// adds the down animation
	screens.game.addClass("game-down-anim");

	// shows the game screen
	screens.game.show();

	playingGame = true;
}
function hideGameScreen(){

	if (screens.game.hasClass("game-down-anim")){
		screens.game.removeClass("game-down-anim");
	}
	screens.game.addClass("game-up-anim");
	screens.game.show();

	playingGame = false;
}
// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));

}
function saveGame(){

	console.log("ASDF");

	// gets the save data
	var toSave = {
		level: level, 
		sprites: sprites,
		colors: colors,
		notes: musicTracks,
		musicSettings: ({
			volumes: volumes,
			speed: barSpeed
		}),
		dialog: dialogs
	}

	// sends the data to the server
	$.ajax({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		},
		url: "/rpgmaker_save/",
		type: "POST",
		data: JSON.stringify(toSave),
		success: function (res){
			console.log(res);
		}

	})


	// $.ajax({
	// 	beforeSend: function(xhr, settings) {
	// 		if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	// 			xhr.setRequestHeader("X-CSRFToken", csrftoken);
	// 		}
	// 	},
	// 	url: "/evolution_save/",
	// 	type: "POST",
	// 	contentType: "text/plain",
	// 	data: JSON.stringify(toSave),
	// 	success: function (response){
	// 		if (response == "failure"){
	// 			alert("Failed to save code. Please contact the admin at josef@josefwaller.com")
	// 		}else{
	// 			alert("Your code is " + response)
	// 		}
	// 	}
	// })
}
function loadGame(){

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