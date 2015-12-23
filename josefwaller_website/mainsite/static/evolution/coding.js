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
			window.location = window.location.href + "?" + response
		}
	})

}