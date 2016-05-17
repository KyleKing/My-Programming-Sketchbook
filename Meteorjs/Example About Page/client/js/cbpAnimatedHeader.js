/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function() {

	var docElem = document.documentElement,
		// Doesn't work and not sure why?
		// header = document.querySelector( '.navbar-default' ),
		didScroll = false,
		changeHeaderOn = 300;

	function init() {
		window.addEventListener( 'scroll', function( event ) {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false );
	}

	function scrollPage() {
		var sy = scrollY();
		if ( sy >= changeHeaderOn ) {
			console.log('AH: Add');
			classie.add( document.querySelector( '.navbar-default' ), 'navbar-shrink' );
		}
		else {
			console.log('AH: Remove');
			classie.remove( document.querySelector( '.navbar-default' ), 'navbar-shrink' );
		}
		didScroll = false;
	}

	function scrollY() {
		// console.log(window.pageYOffset || docElem.scrollTop);
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();