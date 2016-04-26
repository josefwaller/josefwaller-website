var sprites = {};
var level;
var dialog;
var colors;

var objects;

var game;

var alert;

var playingGame = true;

function startGame(){
	
	console.log(gameID);
	
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
	
	alert.show("You Win! Thanks for Playing", [], null);
	
	console.log("ASDF");
	
	playingGame = false;
	
}