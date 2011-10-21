// Sandboxing wrapper
(function($, $$) {
	/**
	 * Main function for the page
	 * Invokes all other methods
	 * Run when the DOM is ready
	 **/
	function main() {
		// Initialise variables
		var elements = {
				navigation: $$('nav a'),
				currentNavigation: document.getElement('nav a[href=' + document.location.hash + ']')
			};
		
		// If there is a current navigation already, apply the class
		if(elements.currentNavigation && elements.currentNavigation.get('href') !== '#') {
			elements.currentNavigation.addClass('current');
		}
		
		// Set up navigation
		elements.navigation.each(function(el) {
			// On click, remove the class from the current item
			// And add it to the element as long as it has a hash link
			el.addEvent('click', function() {
				if(elements.currentNavigation) {
					elements.currentNavigation.removeClass('current');
				}
				
				elements.currentNavigation = el;
				
				if(el.get('href') !== '#') {
					el.addClass('current');
				}
			});
		});
	}
	
	// Call the main function when the DOM is ready
	document.addEvent('domready', main);
}(document.id, document.getElements));