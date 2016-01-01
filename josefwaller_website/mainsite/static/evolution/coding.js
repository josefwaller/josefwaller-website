// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));

}
function save () {

	toSave = {
		startingCoords: [
			startingCoords.x,
			startingCoords.y
		],
		genes: evolvers[evolvers.length - 1].genes,
		asteroids: asteroids
	}

	$.ajax({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		},
		url: "/evolution_save/",
		type: "POST",
		contentType: "text/plain",
		data: JSON.stringify(toSave),
		success: function (response){
			if (response == "failure"){
				alert("Failed to save code. Please contact the admin at josef@josefwaller.com")
			}else{
				alert("Your code is " + response)
			}
		}
	})

}

function enter (){
	code = prompt("Please enter your code:")
	if (code != parseInt(code)){
		alert("Please enter a valid code.")
		return;
	}

	$.ajax({
		url: "/evolution_get/",
		type: "POST",
		data: JSON.stringify({
			id: code
		}),
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		},
		error: function (err){
			console.error(err);
			alert(err);
		},
		success: function (data){
			// Gets the new data
			new_data = JSON.parse(data)

			if (new_data.status == "notexist"){
				alert("No game was found at that code.");
				return;
			}

			// Sets up for a new simulation
			setup();

			// Sets all the variables
			startingCoords.x = JSON.parse(new_data.starting_coords)[0];
			startingCoords.y = JSON.parse(new_data.starting_coords)[1];
			asteroids = JSON.parse(new_data.asteroids);
			evolvers[evolvers.length - 1].genes = JSON.parse(new_data.genes);

			// Sets the time to fast
			timespeed = 1;

			// Starts the simulation
			evolve();
			simulate();
		}
	})
}