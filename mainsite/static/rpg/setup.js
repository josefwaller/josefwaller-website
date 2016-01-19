var sprites;
var background;
var art;

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
	art = Art();

	window.setInterval(update, 1000/60)

}

function update() {
	art.update();
}

$(document.body).ready(setup)