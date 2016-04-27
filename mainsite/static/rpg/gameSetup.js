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
}

var playingGame = true;

function startGame(){
	
	endBox.container = $("#end-box-container");
	endBox.butttonGroup = $("#end-box-button-cont");
	endBox.canvas = $("#end-box-canvas");
	
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
			
			if (data.status == "ok"){
				
				console.log(data);
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
				
				game = new GamePlayer({});
	
				update();
				
			}else {
				console.log(data);
				// add error messages later
			}
		}
	})
}

function update(){
	
	if (playingGame){
		game.update()
	}
	
	window.setTimeout(update, 1000/60);
}

function onWin(){
	
	showEndScreen(
		"", 
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
	
	for (var i = 0; i < buttonLabels.length; i++){
		
		var button = $("<button class='end-box-btn'></button>");
		
		button.text(buttonLabels[i].text);
		button.click(buttonLabels[i].callback);
		
		endBox.butttonGroup.append(button);
	}
	
}