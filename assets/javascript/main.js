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
				sections: {
					obstacles: $('obstacles')
				}
			};
		
		// Set up the events to scroll
		elements.navigation.addEvent('click', function() {
			// Make sure we have a hash
			if(this.get('href') && this.get('href').length > 1) {
				// Scroll to the target element
				scroll.toElement(elements.sections[this.get('href').substring(1)]);
			}
			else {
				// Scroll back to the top
				scroll.toTop();
			}
			
			// Return false to stop it moving instantly
			return false;
		});
	}
	
	// Call the main function when the DOM is ready
	document.addEvent('domready', main);
}(document.id, document.getElements));