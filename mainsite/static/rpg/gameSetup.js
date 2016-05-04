var sprites = {};
var level;
var dialog;
var colors;

var objects;

var game;

var endBox = {
	container: null,
	buttonGroup: null,
	canvas: null,
	textBox: null
}

var playingGame = true;

function startGame(){
	
	endBox.container = $("#end-box-container");
	endBox.butttonGroup = $("#end-box-button-cont");
	endBox.canvas = $("#end-box-canvas");
	endBox.textBox = $("#end-box-text");
	
	endBox.container.hide();
	endBox.container.addClass("up-anim");
	
	endBox.canvas.height($("#end-box").height() - 20);
	endBox.canvas.width(endBox.canvas.height());
	
	// gets the game info
	$.ajax({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		},
		type: "POST",
		url: "/rpgmaker_get/",
		data: JSON.stringify({
			id: gameID
		}),
		success: function(res){
		
			var data = JSON.parse(res);
			
			if (data.status === "success"){
				
				level = data.level;
				dialogs = data.dialog;
				colors = data.colors;
				
					
				// checks for each sprite if it is null
				for (var object in data.sprites){
					
					sprites[object] = {};
					
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
				
				// draws the win sprite on the canvas
				var ctx = new CTXPro({
					canvas: endBox.canvas,
					w: 100,
					h: 100
				});
				
				drawSprite(
					ctx,
					sprites.player.win,
					0,
					0,
					100
				);
				
				setUpObjects();
				
				var levelIsVerified = verifyLevel();
				
				if (!levelIsVerified){
					showEndScreen("This level is incomplete. It is missing a player and/or a goal.", 
					[{
						text: "Return to RPGMaker",
						callback: function(){
							window.location = "/rpgmaker";
						}
					}]);
					endBox.canvas.remove();
					return;
				}
				
				game = new GamePlayer({});
				
				hideLoading();
				update();
				
			}else if (data.status === "notexist"){
				
				showEndScreen("No game was found at that ID.",
					[{
						text: "Return to RPGMaker",
						callback: function(){
							window.location = "/rpgmaker";
						}
					}]
				);
				endBox.canvas.hide();
			}else {
				
				showEndScreen("There was a problem getting the level.",
					[{
						text: "Return to RPGMaker",
						callback: function(){
							window.location = "/rpgmaker";
						}
					}]
				);
				endBox.canvas.hide();
			}
		}
	})
}

function verifyLevel() {
	
	// checks for an area, a player and a goal
	var hasArea = false;
	var hasPlayer = false;
	var hasGoal = false;
	for (var lX = 0; lX < level.length; lX++){
		for (var lY = 0; lY < level[lX].length; lY++){
			
			if (level[lX][lY] !== null){
				hasArea = true;
				var area = level[lX][lY].elements;
				for (var x = 0; x < area.length; x++){
					for (var y = 0; y < area[x].length; y++){
						
						var objIndex = area[x][y];
						
						if (objIndex !== null){
							if (objects[objIndex].name === "player"){
								hasPlayer = true;
							}else if (objects[objIndex].name === "goal"){
								hasGoal = true;
							}
						}
						
						if (hasGoal && hasPlayer && hasArea){
							return true;
						}
						
					}
				}
			}
		}
	}
	return false;
}

function update(){
	
	if (playingGame){
		game.update()
	}
	
	window.setTimeout(update, 1000/60);
}

function onWin(){
	
	showEndScreen(
		"Congratulations, you win!", 
		[{
			text: "Make your own", 
			callback: function(){
				window.location.href = "/rpgmaker/"
			}
		},
		{
			text: "Play Again",
			callback: function(){
				window.location.reload();
			}
		}]
	);
	
	playingGame = false;
	
}

function showEndScreen(message, buttonLabels){
	
	endBox.container.show();
	if (endBox.container.hasClass("up-anim")){
		endBox.container.removeClass("up-anim");
	}
	endBox.container.addClass("down-anim");
	endBox.butttonGroup.html("");
	endBox.textBox.text(message);
	
	for (var i = 0; i < buttonLabels.length; i++){
		
		var button = $("<button class='end-box-btn'></button>");
		
		button.text(buttonLabels[i].text);
		button.click(buttonLabels[i].callback);
		
		endBox.butttonGroup.append(button);
	}
	
}

$(document.body).ready(function() {
	setUpLoading();
});
$(window).on("load", startGame);