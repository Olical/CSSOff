// Sandboxing wrapper
(function($, $$) {
	/**
	 * Main function for the page
	 * Invokes all other methods
	 * Run when the DOM is ready
	 **/
	function main() {
		// Initialise variables
		var scroll = new Fx.Scroll(window),
			elements = {
				navigation: {
					obstacles: $('menu-obstacles'),
					backToTop: $('menu-back-to-top')
				},
				sections: {
					obstacles: $('obstacles')
				},
				obstacles: $$('div.obstacle')
			},
			currentObstacle = elements.obstacles[0],
			spy = null,
			coords = null,
			revealers = [];
		
		// Set up the events to scroll
		Object.each(elements.navigation, function(el) {
			el.addEvent('click', function() {
				// Make sure we have a hash
				if(el.get('href') && el.get('href').length > 1) {
					// Scroll to the target element
					scroll.toElement(elements.sections[el.get('href').substring(1)]);
				}
				else {
					// Scroll back to the top
					scroll.toTop();
				}

				// Return false to stop it moving instantly
				return false;
			});
		});
		
		// Set up the scroll spy instances
		Object.each(elements.sections, function(el, index) {
			// Grab the elements coordinates
			coords = el.getCoordinates();
			
			// Initialise the ScrollSpy instance
			spy = new ScrollSpy({
				min: coords.top,
				max: coords.top + coords.height,
				onEnter: function() {
					elements.navigation[index].addClass('current');
				},
				onLeave: function() {
					elements.navigation[index].removeClass('current');
				}
			});
		});
		
		// Set up the revealers
		elements.obstacles.each(function(el) {
			el.set('reveal', {
				revealOpacity: true
			});
		});
		
		// Set up the obstacle events
		elements.obstacles.addEvent('click', function() {
			// Only do this if it is a different element
			if(currentObstacle !== this) {
				// Remove the class from the current element
				currentObstacle.removeClass('current');
				
				// Hide the current obstacle
				$(currentObstacle.get('data-obstacle')).dissolve();
				
				// Set the new current element
				currentObstacle = this;
				
				// Apply the class to this element
				this.addClass('current');
				
				// Show the new obstacle
				$(this.get('data-obstacle')).reveal();
			}
		});
	}
	
	// Call the main function when the DOM is ready
	document.addEvent('domready', main);
}(document.id, document.getElements));