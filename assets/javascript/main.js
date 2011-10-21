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
				navigation: $$('nav a'),
				sections: $$('section.content'),
				obstacles: $$('div.obstacle')
			},
			currentObstacle = elements.obstacles[0],
			scroller = null,
			spy = null,
			coords = null,
			revealers = [];
		
		// Set up the events to scroll
		scroller = new Fx.SmoothScroll({
			links: elements.navigation
		});
		
		// Set up the scroll spy instances
		elements.sections.each(function(el, index) {
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