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
        g.fill(0.2, 1, Math.random(), .4);
        g.noStroke();
		
		// Draws a star, third arithmetic is to expand triangles to fill in the middle
		g.triangle(x, y, x - 5, y + 10, x + 5, y + 10); // Head
		g.triangle(x - 5 + 5, y + 10, x - 18, y + 10, x - 9 + 9, y + 18 + 6); // Left Arm
		g.triangle(x + 5 - 5, y + 10, x + 18, y + 10, x + 9 - 9, y + 18 + 6); // Right Arm
		g.triangle(x, y + 24, x - 9, y + 17, x - 14, y + 28); // Left Leg
		g.triangle(x, y + 24, x + 9, y + 17, x + 14, y + 28); // Right Leg
    }

    function pixelVortex(g) {
        var offset = Math.floor(Math.random() * 50);
        g.loadPixels();
        var pixelArray = g.pixels.toArray();

        var x = Math.floor(Math.random() * g.width);
        var y = Math.floor(Math.random() * g.height);

        for (var i = 1; i < 500; i++) {
            var index1 = parseInt(x * Math.log(i)) + parseInt(y * Math.log(i)) * g.width + i;
			var index2 = parseInt(x * Math.log(i)) + parseInt(y * Math.log(i)) * g.width - i;
            pixelArray[index1] = pixelArray[x + y * g.width + i];
			pixelArray[index2] = pixelArray[x + y * g.width - i];
        }
		
		console.log("ran");

        g.pixels.set(pixelArray);
        g.updatePixels();
    }
	
	function summonOrbs(g, myParticle, gravFieldX, gravFieldY) {
		
		while (myParticle.length < 50) {
			myParticle[myParticle.length] = new Particle(g);
		}
		
		 // [TODO] Update a particle here
		for (var i = 0; i < myParticle.length; i++) {
			myParticle[i].update(time, gravFieldX, gravFieldY);
		}
		
		// [TODO] Draw a particle here
		for (var i = 0; i < myParticle.length; i++) {
			myParticle[i].draw(g);
		}
	}

    // Lets add some functions to the app object!
    $.extend(app, {

        mouse : new Vector(),
        dimensions : new Vector(),

        init : function() {
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
				var gravFieldX = null;
				var gravFieldY = null;
				
                g.draw = function() {

                    // Update time
                    time.updateTime();

                   
					
                 //   g.fill(.5, .2, .1, .01);
					
                    // Move to the center of the canvas
                    g.pushMatrix();
                    g.translate(w / 2, h / 2);
					
             
					
					
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
						if (gravFieldX === null) {
							gravFieldX = Math.random() * g.width;
							gravFieldY = Math.random() * g.height;
						}
						summonOrbs(g, myParticle, gravFieldX, gravFieldY);
					} else if (myParticle.length > 0) {
						myParticle.length = 0;
						gravFieldX = null;
						gravFieldY = null;
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
