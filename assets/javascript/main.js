// JSHint options - jshint.com
/*jshint mootools:true*/
/*global ScrollSpy:true,OverText:true*/

// Sandboxing wrapper
(function($, $$) {
	// Put the script into strict mode
	'use strict';
	
	/**
	 * Class for counting between numbers with an interval
	 **/
	var Clock = new Class({
		Implements: [Options, Events],
		options: {
			from: null,
			to: null,
			step: 1,
			interval: 1000
		},
		initialize: function(options) {
			// If options are passed, set them
			if(options) {
				this.setOptions(options);
			}
		},
		start: function() {
			// Set up the current index
			this.currentIndex = this.options.from;
			
			// Set up the interval to keep stepping
			this.intervalId = setInterval(this.step.bind(this), this.options.interval);
			
			// Fire the start event
			this.fireEvent('start');
		},
		step: function() {
			// Apply the step to the current index
			this.currentIndex += this.options.step;
			
			// Fire the step event and pass the current index
			this.fireEvent('step', this.currentIndex);
			
			// If we have reached the to, then stop
			if(this.currentIndex === this.options.to) {
				this.stop();
			}
		},
		stop: function() {
			// Clear the interval
			clearInterval(this.intervalId);
			
			// Fire the stop event
			this.fireEvent('stop');
		}
	});
	
	/**
	 * Main function for the page
	 * Invokes all other methods
	 * Run when the DOM is ready
	 **/
	function main() {
		// Initialise variables
		var scroll = new Fx.Scroll(window),
			elements = {
				navigation: $$('nav a'),
				sections: $$('section.content'),
				obstacles: $$('div.obstacle'),
				headings: $$('h2'),
				textboxes: $$('input[type="text"]'),
				clock: $('clock-count'),
				selects: $$('select'),
				submit: $('submit-entry'),
				loadingOverlay: $$('div.form div.loading-overlay')[0],
				formAlert: $('form-alert')
			},
			currentObstacle = elements.obstacles[0],
			scroller = null,
			spy = null,
			coords = null,
			revealers = [],
			overtexts = [],
			selects = [],
			checked = new Element('img', {
				src: 'assets/images/checked.png'
			}),
			i = null,
			clock = null;
		
		// Add the code to fake sending the form on submit
		elements.submit.addEvent('click', function() {
			var selects = $$('div.select'),
				valid = 0,
				check = elements.textboxes.length + selects.length;
			
			// Validate the form
			elements.textboxes.each(function(el) {
				if(el.get('value').length > 0) {
					valid += 1;
				}
			});
			
			valid += $$('div.select li.clicked').length;
			
			// If all are valid, begin post
			if(valid === check) {
				// Fade in the loading overlay
				elements.loadingOverlay.setStyles({
					display: 'block',
					opacity: 0
				}).fade('in');
			}
			else {
				// Otherwise, show the alert
				elements.formAlert.setStyle('display', 'block');
			}
		});
		
		// Convert the select elements into HTML
		elements.selects.each(function(el) {
			selects.push(new StyleSelect({
				element: el,
				skipfirst: true,
				size: 0,
				cssClass: 'select'
			}));
		});
		
		// Setup and start the clock
		clock = new Clock({
			from: 60,
			to: 0,
			step: -1,
			onStep: function(count) {
				// On step swap out the clock count
				elements.clock.set('text', count.toString().pad(2, '0', 'left'));
			}
		});
		
		clock.start();
		
		// Add overlay text to the textboxes
		elements.textboxes.each(function(el) {
			overtexts.push(new OverText(el));
		});
		
		// Insert the 24 checker images into the h2 elements
		elements.headings.each(function(el) {
			for(i = 0; i < 24; i += 1) {
				el.adopt(checked.clone());
			}
		});
		
		// Set up the events to scroll
		scroller = new Fx.SmoothScroll({
			links: elements.navigation,
			axes: 'y'
		});
		
		// Set up the scroll spy instances
		elements.sections.each(function(el, index) {
			// Grab the elements coordinates
			coords = el.getCoordinates();
			
			// Initialise the ScrollSpy instance
			spy = new ScrollSpy({
				min: coords.top,
				max: coords.top + coords.height - 1,
				onEnter: function() {
					elements.navigation[index].addClass('current');
				},
				onLeave: function() {
					elements.navigation[index].removeClass('current');
				}
			});
		});
		
		// Set up the obstacle events
		elements.obstacles.addEvent('click', function() {
			// Only do this if it is a different element
			if(currentObstacle !== this) {
				// Remove the class from the current element
				currentObstacle.removeClass('current');
				
				// Hide the current obstacle
				$(currentObstacle.get('data-obstacle')).fade('out');
				
				// Set the new current element
				currentObstacle = this;
				
				// Apply the class to this element
				this.addClass('current');
				
				// Show the new obstacle
				$(this.get('data-obstacle')).fade('in');
			}
		});
	}
	
	// Call the main function when the DOM is ready
	document.addEvent('domready', main);
}(document.id, document.getElements));