var app = {};

// A holder for lots of app-related functionality
define(["processing", "./particles/particleSystem", "./particles/flower", "./particles/particle"], function(_processing, ParticleSystem, Flower, Particle) {'use strict';

    // A little time object to keep track of the current time,
    //   how long its been since the last frame we drew,
    //   and how long the app has been running
    var time = {
        date : Date.now(),
        start : Date.now(),
        frames : 0,
        updateTime : function() {
            var last = this.date;
            this.date = Date.now();
            this.total = (this.date - this.start) / 1000;
            this.elapsed = (this.date - last) / 1000;

            this.frames++;
        }
    };

    function randomStars(g) {
        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);
        g.fill(0.2, 1, 1, .4);
        g.noStroke();
		
		// Draws a star, third arithmetic is to expand triangles to fill in the middle
		g.triangle(x, y, x - 5, y + 10, x + 5, y + 10); // Head
		g.triangle(x - 5 + 5, y + 10, x - 18, y + 10, x - 9 + 9, y + 18 + 6); // Left Arm
		g.triangle(x + 5 - 5, y + 10, x + 18, y + 10, x + 9 - 9, y + 18 + 6); // Right Arm
		g.triangle(x, y + 24, x - 9, y + 17, x - 14, y + 28); // Left Leg
		g.triangle(x, y + 24, x + 9, y + 17, x + 14, y + 28); // Right Leg
    }

    function pixelVortex(g) {
        var offset = Math.floor(Math.random() * 100);
        g.loadPixels();
        var pixelArray = g.pixels.toArray();

        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);

        for (var i = 0; i < 1000; i++) {
            var index = x + y * g.width + i;
            pixelArray[index] = pixelArray[index + offset];
        }
		
		console.log (x + " " + y + " " + g.width)

        g.pixels.set(pixelArray);
        g.updatePixels();
    }
	
	function summonOrbs(g) {
		
	}

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {
            console.log("Hello, World.");

            // Make a particle system (for later in the tutorial)
           // var particleSystem = new ParticleSystem();

          //  for (var i = 0; i < 10; i++) {
            //    particleSystem.add(new Particle());
          //  }

            // Get the canvas element
            // Note that this is the jquery selector, and not the DOM element (which we need)
            // myJQuerySelector.get(0) will return the canvas element to pass to processing
            var canvas = $("#processingCanvas");
            var processingInstance = new Processing(canvas.get(0), function(g) {

                // This function is called once processing is initialized.

                // Set the size of processing so that it matches that size of the canvas element
                var w = canvas.width();
                var h = canvas.height();
                app.dimensions.setTo(w, h);

                g.size(w, h);

                // Tell processing that we'll be defining colors with
                //  the HSB color mode, with values [0, 1]
                g.colorMode(g.HSB, 1);

                // Tell processing to define ellipses as a center and a radius
                g.ellipseMode(g.CENTER_RADIUS);

                // You can specify backgrounds with one value, for greyscale,
                //  g.background(.65);

                // or with 3 for HSB (or whatever color mode you are using)

                g.background(.1);

                // [TODO] Create a particle here
				g.noStroke();
			
				var myParticle = [];
				var particleCount = 50;
				for (var i = 0; i < particleCount; i++) {
					myParticle[i] = new Particle();
				}
				
                g.draw = function() {

                    // Update time
                    time.updateTime();

                    // [TODO] Update a particle here
					for (var i = 0; i < particleCount; i++) {
					//	myParticle[i].update(time);
					}
					
                    g.fill(.5, .2, .1, .01);
					
                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);
					
                    // [TODO] Draw a particle here
					for (var i = 0; i < particleCount; i++) {
				//		myParticle[i].draw(g);
					}
					
					
                    g.popMatrix();

                    // HW Functions
					
					/*
						Holding down ‘2’ does something to the pixel buffer (see code!)
							4 Pointed star like object rotation to displace colors
						
						Pressing ‘3’ creates some particles
							Particles that gravitate around a random point(s)
					*/
                    
                    if (app.key === 1) {
						randomStars(g);
                    }
					
                    if (app.key === 2) {
						pixelVortex(g);
                    }
					
					if (app.key === 3) {
						// summonOrbs(g);
					}
                     

                };
            });
            this.initUI();
        },

        initUI : function() {

            $("#view").mousemove(function(ev) {
                var x = ev.offsetX - app.dimensions.x / 2;
                var y = ev.offsetY - app.dimensions.y / 2;
                //    console.log(x + " " + y);
                app.mouse.setTo(x, y);
            });

            // using the event helper
            $('#view').mousewheel(function(event) {

            });

            $("#view").draggable({
                helper : function() {
                    return $("<div id='dragPos'></div>");
                },

                drag : function(event, ui) {
                    var x = $('#dragPos').offset().left;
                    var y = $('#dragPos').offset().top;

                }
            });

            $(document).keydown(function(e) {

                var key = String.fromCharCode(e.keyCode);

                switch(key) {
                    case ' ':
                        app.paused = !app.paused;
                        break;
                    case '1':
                        // Do something when the user
                        app.key = 1;
                        break;

                    case '2':
                        // Do something
                        app.key = 2;
                        break;
                    case '3':
                        app.key = 3;
                        // Do something
                        break;
                }

            });

            $(document).keyup(function(e) {
                app.key = undefined;
            });

        }
    });

});
