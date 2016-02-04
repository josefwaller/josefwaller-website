function JavascriptLabelledParameters(paramString){
	parameters = paramString.split(",");
	returnObject = {};
	for (var i = 0; i < parameters.length; i++){
		values = parameters[i].split("=");

		returnObject[values[0]] = JSON.parse(values[1]);
	}
	return returnObject;
}

console.log(JavascriptLabelledParameters('x=5, y=4, josef="asdf"'));