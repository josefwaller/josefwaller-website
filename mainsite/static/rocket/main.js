var canvas;
var ctx;

var interval;

var force;
var angle;

var map;

var planets = [];
var time;

function mainLoop() {

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	time.time += 1;

	for (planetIndex=0; planetIndex < planets.length; planetIndex++){
		planet = planets[planetIndex];
		planet.update();
		planet.render();
	}
	rocket.update();
	rocket.render();
}

function setup(){	

	canvas = $("canvas").get(0);
	ctx = canvas.getContext("2d");

	canvas.width = 900;
	canvas.height = 500;

	time = {
		deltaTime: 1,
		startingTime: 0,
		time: 0,
	}

	window.clearInterval(interval);

	force = $("#force").val() / 1000;
	angle = ($("#angle").val() / 360) * 2 * Math.PI;
	radius = $("#radius").val();
	altitude = $("#altitude").val();

	earth = {
		x: canvas.width / 2, 
		y: canvas.height / 2, 
		radius: radius,
		mass: 100,
		vX: 0,
		vY: 0,
		color: "#ffffff"
	}
	moon = {
		x: canvas.width / 2, 
		y: earth.y + (radius * 1.5), 
		radius: radius / 10,
		mass: 1,
		vX: 0,
		vY: 0,
		color: "#ffffff",

		orbitParent: earth,
		orbitHeight: (radius * 0.5),
		orbitV: 10
	}

	// Sets up depending on the map
	switch(map){
		case 0:
			planets = [new Planet(earth)]
			break;
		case 1:
			planets = []
			// Earth
			planets.push(new Planet(earth))

			// Moon
			planets.push(new Planet(moon))
			planets[1].orbitParent = planets[0];

			break;
	}


	rocket = new Rocket({
		x: earth.x,
		y: earth.y - radius - altitude,
		vX: 0,
		vY: 0,
		color: "#ffffff"
	})

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (planetIndex=0; planetIndex<planets.length; planetIndex++){

		planet = planets[planetIndex];
		planet.render();
	}

	rocket.render();
}

$(document.body).ready(function(){
	$("#go").click(function() {
		setup();
		interval = window.setInterval(mainLoop, 1000 / 120)
	})
	$("#update").click(setup)
	$("#earth").click(function(){
		map = 0;
		setup()
	})
	$("#earth-and-moon").click(function(){
		map = 1;
		setup()
	})
	$("#two-planets").click(function(){
		map = 2;
		setup()
	})
	$("#solar-system").click(function(){
		map = 3;
		setup()
	})

	setup();
})