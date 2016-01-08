id = 0

// Used to create class-like objects in javascript
function Class (classObj){

	// Returns a function that returns the class object
	return (function(params){

		classObj.init(params)

		var newObj = {};
		for (i in classObj){
			newObj[i] = classObj[i];
		}

		newObj.id = id;
		id ++;

		// Returns the new copy
		return newObj;
	})
}