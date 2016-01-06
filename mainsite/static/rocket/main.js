var canvas;
var ctx;

var planets;
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
		Planet({
			x: 500, 
			y: 200, 
			radius: 20,
			mass: 5,
			velocity_x: 0,
			velocity_y: 0,
			color: "#000000"
		}),
		Planet({
			x: 200, 
			y: 200, 
			radius: 20,
			mass: 5,
			velocity_x: 0,
			velocity_y: 0,
			color: "#000000"
		})
	];
}
function mainLoop() {

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	time.time += 1
	for (i = 0;i < planets.length;i++){
		p = planets[i]

		p.update();
		p.render();
	}
}

$(document.body).ready(function() {
	main()
	interval = window.setInterval(mainLoop, 1000 / 60)
})