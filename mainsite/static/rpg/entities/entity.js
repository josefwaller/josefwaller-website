var Entity = Class({

	x: 0,
	y: 0,
	s: 0,

	area: null,
	parent: null,

	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.s = p.s;

		// copies the area to not get a reference, which would change with each item
		this.area = JSON.parse(JSON.stringify(p.area));

		// the GamePlayer which this item belongs to
		this.parent = p.parent;
	}

});