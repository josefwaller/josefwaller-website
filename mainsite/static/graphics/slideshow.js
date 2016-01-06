var index;
var img;
var img_urls;

var slideTime = 3000;
var fadeTime = 500;

var timeout;

$(document.body).ready(setup);

function setup() {

	img = $("#img");

	img_urls = [
		img.attr("imgone"),
		img.attr("imgtwo"),
		img.attr("imgthree")
	];

	index = 0;

	timeout = window.setTimeout(runSlideshow, slideTime);

}

function runSlideshow() {

	index += 1;

	if (index >= img_urls.length){
		index = 0;
	}

	changeSlide(index);

}

function changeSlide(i) {

	window.clearTimeout(timeout);
	index = i;
	img.fadeTo(duration=fadeTime, opacity=0, complete=function(){

		img.attr("src", img_urls[i])

		img.fadeTo(fadeTime, 1, function(){
			timeout = window.setTimeout(runSlideshow, slideTime);
		});
	})
}
