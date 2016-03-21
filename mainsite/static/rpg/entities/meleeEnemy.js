var MeleeEnemy = Class({
	// caps for emphasis
	SUPERCLASS: Entity,
	
	x: 0,
	y: 0,
	s: 0,
	area: null,

	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.s = p.s;
		this.area = JSON.parse(JSON.stringify(p.area));
	},

	update: function(){},

	render: function(){},

});