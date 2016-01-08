var canvas;
var ctx;

var interval;

var force;
var angle;

var map;

var planets = [];
var time;

var  inputs = {};

function init () {

	// Saves the inputs for future reference
	inputs = {
		force: $("#force"),
		angle: $("#angle"),
		radius: $("#radius"),
		altitude: $("#altitude")
	}

	// Checks if there is a save in the url
	if(window.location.hash != null){
		console.log(window.location.hash)
		getUrl();
	}else {
		// SEts to default
		console.log("ASDF")
		map = 0;
		setAttr();
	}

	// Gets teh canvas and context
	canvas = $("canvas").get(0);
	ctx = canvas.getContext("2d");

	// Sets the height and width (Note changing these will change the simulation)
	canvas.height = 500;
	canvas.width = 1000;

	// Saves time variables
	time = {
		deltaTime: 1,
		startingTime: 0,
		time: 0,
	}

}

function resize (){

	// resizes the canvas
	$("#canvas").height(canvas.height / canvas.width * $("#canvas").width());

	// Checks if on mobile, if is changes button group
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$("#scen-group").removeClass("btn-group-justifed");
		$("#scen-group").addClass("btn-group-vertical");
	}
}

// runs the simulation
function mainLoop() {

	// Draws background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// updates and renders each planet
	for (planetIndex=0; planetIndex < planets.length; planetIndex++){
		planet = planets[planetIndex];
		planet.update();
		planet.render();
	}

	// updates and renders the rocket
	rocket.update();
	rocket.render();
}

function setup(){	

	// Stops the simulation
	window.clearInterval(interval);

	// Checks that the entered values are numbers
	var error = false;
	for (div in inputs){

		num = parseInt(inputs[div].val());

		if (isNaN(num) && inputs[div].val() !== ""){

			error = true;
			inputs[div].val("Please enter a valid number");
			inputs[div].addClass("errColor")

		}else {
			inputs[div].removeClass("errColor")
		}
	}
	if (error){
		return;
	}
	// Gets all the given values
	force = Number(inputs.force.val()) / 1000;
	angle = Number(inputs.angle.val() / 360) * 2 * Math.PI;
	radius = Number(inputs.radius.val());
	altitude = Number(inputs.altitude.val());

	// Basic big planet
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

	//  Basic orbiting planet
	moon = {
		x: canvas.width / 2, 
		y: earth.y + (radius * 1.5), 
		radius: radius / 5,
		mass: 1,
		vX: 0,
		vY: 0,
		color: "#ffffff",

		orbitParent: planets[0],
		orbitHeight: (100 + radius),
		orbitV: 1000,
		inOrbit: true
	}
	console.log(parseInt(map))
	// Sets up depending on the map
	switch(map){

		case 0:

			// One planet
			planets = [new Planet(earth)];
			break;

		case 1:

			// One planet and a moon
			planets = []

			// Earth
			planets.push(new Planet(earth));

			// Moon
			moon.orbitParent = planets[0];
			planets.push(new Planet(moon));

			break;

		case 2:

			// Two planets
			planets = []

			planets.push(new Planet(earth));
			planets.push(new Planet(earth));

			// Sets the x coor evenly
			planets[0].x = canvas.width * 1/3;
			planets[1].x = canvas.width * 2/3;
			break;

		case 3:

			// Solar system with 9 orbiting planets
			planets = [];
			planets.push(new Planet(earth));

			// The difference in altitude for each
			altitudeDifference = radius * 0.5;

			while (planets.length < 10){

				// Adds a planet
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

	// Adds the rocket

	rocket = new Rocket({
		x: earth.x,
		y: earth.y - radius - altitude,
		vX: 0,
		vY: 0,
		color: "#ffffff"
	})

	// Draws the background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draws the planets
	for (planetIndex=0; planetIndex<planets.length; planetIndex++){

		planet = planets[planetIndex];
		planet.render();
	}

	// Draws the rocket
	rocket.render();

	// Saves the setup in the url
	saveInUrl();
}

// Loads
$(document.body).ready(function(){

	init();
	// clearAttr();
	setup();

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
})

$(window).resize(function() {
	init();
	setup();
})

function clearAttr() {

	inputs.force.val("");
	inputs.angle.val("");
	inputs.radius.val("50");
	inputs.altitude.val("50");

	force = 0;
	angle = 0;
	radius = 50;
	altitude = 50;
}

function saveInUrl(){
	toSave = {
		m: map,
		f: inputs.force.val(),
		a: inputs.angle.val(),
		al: inputs.altitude.val(),
		r: inputs.radius.val()
	}
	urlAddon = "?";
	for (attr in toSave){
		urlAddon += attr +"=" + toSave[attr] + "&"
	}
	window.location = "#" + urlAddon;
}
function getUrl(){
	console.log("Get url")

	url = window.location.hash;

	vars = url.substring(2).split("&");

	for (i=0; i<vars.length; i++){
		v = vars[i].split("=");

		switch(v[0]){
			case "m":
				map = Number(v[1]);
				break;

			case "f":

				inputs.force.val(v[1]);
				break;

			case "a":
				inputs.angle.val(v[1]);
				break;

			case "al":
				inputs.altitude.val(v[1]);
				break;

			case "r":
				inputs.radius.val(v[1]);
				break;
		}
	}
}