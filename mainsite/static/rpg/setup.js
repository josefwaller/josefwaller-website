var sprites;
var background;

var screens;

// The ID of the current game, so that when saving it will overwrite
var currentGameID = null;

// the current game's password, so that the user does nbot have to enter it in every time
var password = null;

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
var dialog;
var levelEditor;
var game;


var mouse = {
	pos : {
		x:0,
		y:0
	},
	click: false,
	hold: false
}

var size = 16;

var playingGame = false;

function setup () {


	//hides the loading screen
	hideLoading();

	$("#rpgmaker-container").show();
	// Sets up art canvas
	art = Art({size: size});

	// sets up music canvas
	// music = Music({});

	// sets up dialog
	dialog = Dialog({});

	// sets up level editor
	levelEditor = LevelEditor({});

	// sets up the game player
	game = GamePlayer({});

	// Sets up changing screens
	$("#level-editor-btn").click({i:0}, changeScreen);
	$("#art-btn").click({i:1}, changeScreen);
	// $("#music-btn").click({i:2}, changeScreen);
	$("#dialog-btn").click({i:2}, changeScreen);

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
		// music: $("#music"),
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
			screens.dialog.show();
			break;
	}

	// Records the current screen
	currentScreen = i;
}

function update() {

	if (!alert.getIsShowing()){
		
		if (playingGame){

			m = game;

		}else {


			// gets all the managers
			managers = [
				levelEditor,
				art,
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

		}
	}
	
	this.mouse.click = false;

	// sets to update again
	window.setTimeout(update, 1000/60);
}

function showGameScreen(){

	// checks that an area exists
	var areaExists = false;
	
	for (var x = 0; x < level.length; x++){
		for (var y = 0; y < level[x].length; y++){
			if (level[x][y] !== null){
				areaExists = true;
			}
		}
	}
	if (!areaExists){
		alert.show("Please create an area before playing", [], null);
		return;
	}
		
	// checks that a player exists
	if (!levelEditor.hasPlayer){
		alert.show("Please create a player before playing", [], null);
		return;
	}
	
	// removes the up anim
	if (screens.game.hasClass("up-anim")){
		screens.game.removeClass("up-anim");
	}
	// adds the down animation
	screens.game.addClass("down-anim");

	// shows the game screen
	screens.game.show();

	playingGame = true;

	game.createGame();
}
function hideGameScreen(){

	if (screens.game.hasClass("down-anim")){
		screens.game.removeClass("down-anim");
	}
	screens.game.addClass("up-anim");
	screens.game.show();

	playingGame = false;
}
function saveGame(){

	// gets the save data
	var toSave = {
		level: level, 
		sprites: sprites,
		colors: colors,
		dialog: dialogs
	}

	// Checks if it is a loaded game
	if (currentGameID !== null){

		toSave.id = currentGameID;

	}
	if (password === null){
		alert.show("Please create a password", ["Password"], function(obj){
			toSave.password = obj.Password;
			sendSaveData(toSave);
		});
	}else {
		toSave.password = password;
		sendSaveData(toSave);
	}
			
	
}
function sendSaveData(data){
	
	alert.show("Saving..", [], null);
	alert.showLoading();
	// sends the data to the server
	
	$.ajax({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		},
		url: "/rpgmaker_save/",
		type: "POST",
		data: JSON.stringify(data),
		success: function (res){
			
			res = JSON.parse(res);
			alert.hideLoading();

			if (res.status == 'failure'){

				alert.show("Error: please contact the admin at josef@josefwaller.com", [], null)
			}else if (res.status === "badpass"){
				
				alert.show("Error: The password and ID do not match", [],  null);
			}else if (res.status === "nopass"){
				
				alert.show("Please enter a password", [], null);
				
			}else if (res.status === "wrongpass"){
				
				alert.show("The password and GameID do not match", [], null);
				
			}else if (res.status === "ok"){

				if (currentGameID === null){
					
					alert.show("Your code is " + res.id, [], null);
					currentGameID = res.id;
					password = data.password;
					
				}else {
					alert.show("Successfully Saved", [], null);
				}
			}
		}

	});
}
function loadGame(){

	var data;

	if (currentGameID === null || password === null){
		
	}
	alert.show("Please enter an id and password:", ["ID", "Password"], function(obj){
		
		var id = obj.ID;
		var thisPassword = obj.Password;

		// shows the loading symbol
		alert.showLoading();

		$.ajax({
			beforeSend: function(xhr, settings) {
				if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
					xhr.setRequestHeader("X-CSRFToken", csrftoken);
				}
			},
			url: "/rpgmaker_get/",
			type: "POST",
			data: JSON.stringify({
				id: id,
				password: thisPassword}),
			success: function (res){
					
				// now i have to do stuff with this
				var data = JSON.parse(res);

				if (data.status == 'failure'){

					alert.show("Error: please contact the admin at josef@josefwaller.com", [], null)
					
				}else if (data.status === "notexist"){
				
					alert.show("No Setup was found at that ID", [], null);
					
				}else if (data.status === "notvalid"){
					
					alert.show("Please enter a valid integer", [], null);
					
				}else if (data.status === "wrongpass"){
					
					alert.show("The password for the ID is wrong", [], null);
					
				}else {
					
					// checks for each sprite if it is null
					for (var object in data.sprites){
						for (var sprite in data.sprites[object]){

							if (data.sprites[object][sprite] === null){

								// creates a null filled sprite

								var empty = [];

								for (var x = 0; x < size; x++){
									empty.push([]);
									for (var y = 0; y < size; y++){

										empty[x].push(null);

									}
								}
								
								sprites[object][sprite] = empty.slice();

							}else {

								sprites[object][sprite] = data.sprites[object][sprite];

							}

						}
					}

					// does everything else
					colors = data.colors;
					art.setColorButtons();

					// updates the sprite canvases
					// keep after adding color
					art.updateAllButtons();
					
					level = data.level;
					
					// Add counting entities here

					dialogs = data.dialog;
					dialog.updateDialogs();

					// changes specific things when loading
					// Note: Must show all screens so that they can scale their elements properly
					
					for (var s in screens){
						screens[s].show();
					}
					
					levelEditor.onLoad();
					art.onLoad();
					dialog.onLoad();
					
					levelEditor.update();
					art.update()
					dialog.update();

					for (var s in screens){
						screens[s].hide();
					}

					// saves the current game
					currentGameID = id;
					password = thisPassword;
					
					// shows the default screen
					changeScreen(null, currentScreen);
					
					alert.hide();
					
				}
			}
		})
	});

}
function sendLoadData(){
	
}
function onWin(){
	hideGameScreen();
	isPlayingGame = false;
}

// shows the loading screen
$(document.body).ready(function(){
	setUpLoading();
});

// after loading, shows the stuff
$(window).on("load", function(){setup()});