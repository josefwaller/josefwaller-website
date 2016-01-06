// Used to create class-like objects in javascript
function Class (class_obj){

	// Returns a function that returns the class object
	return (function(params){
		// Initializes the object
		class_obj.init(params)
		return class_obj;
	})
}