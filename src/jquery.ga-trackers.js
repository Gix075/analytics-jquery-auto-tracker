// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "gaTrackers",
			defaults = {
				unbounce: {
                    active: true,
                    timeOnPage: [true,20000],
                    scrollOnPage: true,
                    fieldsObject: {
                        hitType: 'event',
       	                eventCategory: 'Unbounce', 
       	                eventAction: 'NoBounce', 
       	                eventLabel: 'Time spent and page scrolled'
                    }
                },
                externals: {
                    active: true,
                    fieldsObject: {
                        hitType: 'event',
       	                eventCategory: 'Outbound Link', 
       	                eventAction: 'link in uscita', 
       	                eventLabel: 'pagina del bottone',
                        transport: 'beacon'
                    }
                },
                clicks: [
                    {
                        "selector":"selettore",
                        fieldsObject: {
                            hitType: 'event',
                            eventCategory: 'Outbound Link', 
                            eventAction: 'link in uscita', 
                            eventLabel: 'pagina del bottone',
                            nonInteraction: false
                        }
                    }
                ]
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( true, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like the example below
				this.trackOutboundLink();
			},
            
            // OUTBOUND LINKS
			trackOutboundLink: function() {
                var thisPlugin = this;
                    
                $(this.element).find('a').on('click', function (e) {
                    e.preventDefault();
                    var hostname = window.location.hostname,
                        url = $(this).attr('href');
                    
                    hostname = hostname.replace('http://','').replace('https://','').replace('www.','').split('/')[0];
                    url = url.replace('http://','').replace('https://','').replace('www.','').split('/')[0];
                    
                    console.log(hostname +" "+url);
                    if (hostname !== url) {
                        alert ('true');
                    }else{
                        alert ('false');
                    }
                });  
			},
            
            noBounce: function() {

                console.log('start googleAnalyticsNoBounce');

                var visitTookTime = false,
                    didScroll = false,
                    bounceSent = false,
                    scrollCount = 0;

                setTimeout(timeElapsed, 20000);

                window.addEventListener ?
                    window.addEventListener('scroll', testScroll, false) :
                    window.attachEvent('onScroll', testScroll);

                function testScroll() {
                    ++scrollCount;
                    if (scrollCount == 2) {
                        didScroll = true
                    };
                    sendNoBounce();
                }

                function timeElapsed() {
                    visitTookTime = true;
                    sendNoBounce();
                }

                function sendNoBounce() {
                    if ((didScroll) && (visitTookTime) && !(bounceSent)) {
                        bounceSent = true;
                        ga('send', {
                            hitType: 'event',
                            eventCategory: 'Unbounce',
                            eventAction: 'NoBounce',
                            eventLabel: 'Time spent and page scrolled'
                        });
                    }
                }

            }

            
            
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );