var sprites;
var background;

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

}

$(document.body).ready(setup)