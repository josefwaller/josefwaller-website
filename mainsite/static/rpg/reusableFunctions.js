function drawSprite(ctx, sprite, offX, offY, s){

	// draws a sprite on the ctx at the x,y coord with size s

	var pixelSize = s / size;

	for (var x = 0; x < sprite.length; x++){

		for (var y = 0; y < sprite[x].length; y++){

			if (sprite[x][y] !== null){

				ctx.fillStyle = colors[sprite[x][y]].hex;
				ctx.fillRect(
					offX + pixelSize * x, 
					offY + pixelSize * y, 
					pixelSize, 
					pixelSize
					);
			}
		}
	}
}

function getKeyFromKeyCode(keyCode){

	// returns a string representation of the key
	// note Jquery event.key does not work in Chrome or IE8

	switch (keyCode){

		case 37:
			return "ArrowLeft";

		case 38:
			return "ArrowUp";

		case 39:
			return "ArrowRight";

		case 40:
			return "ArrowDown";

		case 32:
			return " ";

		case 81:
			return "q";

	}

}