var canvas;
var ctx;

var interval;

var force;
var angle;

var map;

var planets = [];
var time;

function init () {

	canvas = $("canvas").get(0);
	ctx = canvas.getContext("2d");

	canvas.width = 900;
	canvas.height = 500;

	time = {
		deltaTime: 1,
		startingTime: 0,
		time: 0,
	}
}

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

	window.clearInterval(interval);

	force = Number($("#force").val()) / 1000;
	angle = Number($("#angle").val() / 360) * 2 * Math.PI;
	radius = Number($("#radius").val());
	altitude = Number($("#altitude").val());

	earth = {
		x: canvas.width / 2, 
		y: canvas.height / 2, 
		radius: radius,
		mass: 100,
		vX: 0,
		vY: 0,
		color: "#ffffff",
		inOrbit: false
	}

	moon = {
		x: canvas.width / 2, 
		y: earth.y + (radius * 1.5), 
		radius: radius / 10,
		mass: 1,
		vX: 0,
		vY: 0,
		color: "#ffffff",

		orbitParent: planets[0],
		orbitHeight: (100 + radius),
		orbitV: 1000,
		inOrbit: true
	}

	// Sets up depending on the map
	switch(map){
		case 0:
			planets = [new Planet(earth)];
			break;
		case 1:
			planets = []
			// Earth
			planets.push(new Planet(earth));

			// Moon
			moon.orbitParent = planets[0];
			planets.push(new Planet(moon));

			break;
		case 2:
			planets = []

			planets.push(new Planet(earth));
			planets.push(new Planet(earth));

			planets[0].x = canvas.width * 1/3;
			planets[1].x = canvas.width * 2/3;
			break;

		case 3:
			planets = [];

			planets.push(new Planet(earth));

			altitudeDifference = radius * 0.5;

			while (planets.length < 10){

				newMoon = {};
				for (moonAttr in moon){
					newMoon[moonAttr] = moon[moonAttr];
				}
				newMoon.orbitHeight = radius + (planets.length) * altitudeDifference;
				newMoon.orbitParent = planets[0];
				planets.push(new Planet(newMoon));
			}
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
	init();
	$("#go").click(function() {
		setup();
		interval = window.setInterval(mainLoop, 1000 / 120)
	})
	$("#update").click(setup)
	$("#earth").click(function(){
		map = 0;
		clearAttr();
		setup();
	})
	$("#earth-and-moon").click(function(){
		map = 1;
		clearAttr();
		setup();
	})
	$("#two-planets").click(function(){
		map = 2;
		clearAttr();
		setup();
	})
	$("#solar-system").click(function(){
		map = 3;
		clearAttr();
		setup();
	})

	setup();
})

function clearAttr() {

	$("#force").val("");
	$("#angle").val("");
	$("#radius").val("50");
	$("#altitude").val("50");

	force = 0;
	angle = 0;
	radius = 50;
	altitude = 50;
}