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
                outbounds: {
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
                        selector: "#click_01",
                        fieldsObject: {
                            hitType: 'event',
                            eventCategory: 'Click', 
                            eventAction: 'Click', 
                            eventLabel: 'Nome del Click',
                            nonInteraction: false
                        }
                    }
                ],
                debug: true
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
				if (this.settings.outbounds.active === true) this.trackOutboundLink();
                if (this.settings.unbounce.active === true) this.noBounce();
			},
            
            /* ********************************************** */
            /* CLICK */
            /* ********************************************** */
            trackClicks: function() {
                
                var thisPlugin = this,
                    clicks = this.settings.clicks;
                
                if (clicks > 0) {
                    if (thisPlugin.settings.debug === true) console.log('gaTrackers: start TrackLink');
                    $.each(clicks, function(index) {
                        $(this.selector).on('click', function() {
                            if (thisPlugin.settings.debug === true) console.log('gaTrackers: send LINK to GA');
                            ga('send', this.fieldsObject);
                        });
                    })
                }
                
            },
            
            /* ********************************************** */
            // OUTBOUND LINKS 
            /* ********************************************** */
			trackOutboundLink: function() {
                var thisPlugin = this;
                if (thisPlugin.settings.debug === true) console.log('gaTrackers: start OutboundLink');
                    
                $(this.element).find('a').on('click', function (e) {
                    
                    e.preventDefault();
                    
                    var domainRe = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i,
                        hostname = window.location.hostname,
                        url = $(this).attr('href');
                    
                    if (thisPlugin.settings.debug === true) console.log('gaTrackers: OutboundLink check link -> ' + hostname + " " + url);
                    
                    if (url.match(domainRe)) {
                        if (domainRe.exec(hostname)[1] !== domainRe.exec(url)[1]) {
                            if (thisPlugin.settings.debug === true) console.log('gaTrackers: OutboundLink send OUTBOUND to GA');
                            ga('send', thisPlugin.settings.outbounds.fieldsObject);
                        } 
                    }
                    
                });  
			},
            
            /* ********************************************** */
            // NO BOUNCE
            /* ********************************************** */
            noBounce: function() {
                
                var thisPlugin = this;

                console.log('gaTrackers: start noBounce');

                var visitTookTime = false,
                    didScroll = false,
                    bounceSent = false,
                    scrollCount = 0;

                if (this.settings.unbounce.timeOnPage[0] === true) {
                    if (thisPlugin.settings.debug === true) console.log('gaTrackers: start noBounce TimeOnPage');
                    setTimeout(timeElapsed, this.settings.unbounce.timeOnPage[1]);
                }

                window.addEventListener ?
                    window.addEventListener('scroll', testScroll, false) :
                    window.attachEvent('onScroll', testScroll);

                function testScroll() {
                    if (thisPlugin.settings.debug === true) console.log('gaTrackers: start noBounce TestScroll');
                    ++scrollCount;
                    if (scrollCount == 2) {
                        didScroll = true
                    };
                    if (thisPlugin.settings.debug === true) console.log('gaTrackers: send noBounce to GA (scroll)');
                    sendNoBounce();
                }

                function timeElapsed() {
                    visitTookTime = true;
                    if (thisPlugin.settings.debug === true) console.log('gaTrackers: send noBounce to GA (time)');
                    sendNoBounce();
                }

                function sendNoBounce() {
                    if ((didScroll) && (visitTookTime) && !(bounceSent)) {
                        bounceSent = true;
                        ga('send', thisPlugin.settings.unbounce.fieldsObject);
                        
                        if (thisPlugin.settings.debug === true) console.log('gaTrackers: send noBounce OK');
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