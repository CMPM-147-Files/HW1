define(["inheritance", "common"], function(_inheritance, common) {'use strict';
    var Particle = Class.extend({
	
        init : function() {
			this.position = new Vector((Math.random() * 200) - 100, (Math.random() * 200) - 100);
			this.velocity = new Vector(Math.random() * 6 - 3, Math.random() * 6 - 3);
			this.acceleration = new Vector(Math.random() * 100 - 50, Math.random() * 100 - 50);
			
			
        },

        // Figure out the forces on the particle, how to change the velocity, 
        // and then move it somewhere.  The Vector library has many functions that may be useful here
        update : function(time) {
			this.position.addMultiple(this.velocity, time.elapsed);
			this.velocity.addMultiple(this.acceleration, time.elapsed);
			this.acceleration.mult(-2 * time.elapsed);
        },



        // Draw the particle to the screen.  'g' is the processing drawing object
        //  You might use: 'g.ellipse(x, y, radiusW, radiusH)', or 'g.rect(x, y, radiusW, radiusH)'
        //  Remember to also set the fill and stroke, or remove them if you dont want them
        //  You could also use a 'for' loop to layer multiple ellipses for each particle
        //  Also, browse the Vector library for useful drawing functions that deal with vectors
        draw : function(g) {
			g.fill(0.5, .5, .6, .45);
			g.ellipse(this.position.x, this.position.y, 10, 10);
        },
    });

    return Particle;
});
