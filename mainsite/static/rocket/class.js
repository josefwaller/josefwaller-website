id = 0

// Used to create class-like objects in javascript
function Class (classObj){

	// Returns a function that returns the class object
	return (function(params){

		var newObj = {};

		// checks for super class
		if ("SUPERCLASS" in classObj){

			var SUPERCLASS = new classObj.SUPERCLASS(params);

			// copies the values
			for (var key in SUPERCLASS){
				newObj[key] = SUPERCLASS[key];
			}

		}

		for (classObjIndex in classObj){
			if (classObjIndex !== "SUPERCLASS"){
				newObj[classObjIndex] = classObj[classObjIndex];
			}
		}

		newObj.init(params)

		newObj.id = id;
		id ++;

		// Returns the new copy
		return newObj;
	})
}