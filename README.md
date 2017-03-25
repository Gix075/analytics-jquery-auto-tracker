# jQuery Google Analytics Tracker (version 0.1.0)
Simple jQuery auto tracker for Google Analytics

This jQuery Plugin is a simple tool to send events to Google Analytics. This plugin is very ease to use.

**This software is under costruction, please use for tests only.**

**Implemented Functions**
* Unbounce
* Outbounds Links

## Usage
``` html
<script src="path/to/jquery.ga-trackers.js"></script>
```

``` javascript
$('body').gaTrackers();
```
### Options
JqueryGATRackers can track on Google Analytics several page interations, as:
* Outbound Links
* Unbounce event (useful for one page applications or landing pages)
* Click events
* Page elements showed on viewport

The following code shows how to launch plugin with default options

``` javascript
$('body').gaTrackers({
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
            eventAction: 'Exit Website', 
            eventLabel: window.location.href,
            transport: 'beacon'
        }
    },
    clicks: [],
    onscreen: [],
    debug: true
});
```