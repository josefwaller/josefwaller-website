$(window).on("load", function(){
	
	$("#go-to-id-btn").click(function(){
		
		console.log("ASDF");
		
		var value = $("#id-input-tag").val();
		
		window.location = "/rpgplayer/" + value;
	});
	
});