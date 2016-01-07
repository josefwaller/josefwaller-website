var canvas;
var ctx;

var planets = [];
var time;

function main() {

	canvas = $("canvas").get(0);
	ctx = canvas.getContext("2d");

	canvas.width = 900;
	canvas.height = 500;

	time = {
		deltaTime: 1,
		startingTime: 0,
		time: 0,
	}

	planets = [
		new Planet({
			x: 400, 
			y: 300, 
			radius: 40,
			mass: 1000,
			vX: 0,
			vYy: 0,
			color: "#000000"
		})
	];

	planets.push(new Planet({
			x: 400, 
			y: 200, 
			radius: 10,
			mass: 1,
			vX: 2000,
			vY: 0,
			color: "#000000",

			orbitParent: planets[0],
			orbitHeight: 100,
			orbitV: 5
		}))

	rocket = new Rocket({
		x: 20,
		y: 20,
		vX: 0,
		vY: 0,
		color: "#ff0000"
	})
}
function mainLoop() {

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	time.time += 1

	for (planetIndex=0; planetIndex < planets.length; planetIndex++){

		if (planets[planetIndex] !== null){

			planets[planetIndex].update();
			planets[planetIndex].render();

		}

		rocket.update();
		rocket.render();
	}
}

$(document.body).ready(function() {
	main()
	interval = window.setInterval(mainLoop, 1000 / 120)
})