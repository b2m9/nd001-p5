var app = window.app || {};

app.DefaultViewModel = (function ($, ko, db, Place, gmaps, map) {
    "use strict";
    
    /**
     * Instance of DefaultViewModel. Singleton.
     * @member {object} places - Array of Places. ko.observableArray()
     * @member {object} filterStr - String to filter places. ko.observable()
     * @method init - Initialise ViewModel
     * @method toggle - Toggle sidebar.
     * @method filter - Filter places based on filterStr
     * @method select - Trigger respective marker on map
     */
    var me = {
        places: ko.observableArray([]),
        filterStr: ko.observable(""),
        init: _init,
        toggle: _toggle,
        filter: _filter,
        select: _select
    };
    
    function _init () {
        // load pre-defined list of locations
        db.getPlaces(function (data) {
            var arr = [];
            
            data = data || [];
            data.forEach(function (d) {
                var coords = [parseFloat(d.coords[0] || 0), parseFloat(d.coords[1] || 0)];
                
                arr.push(new Place(d.name, coords, d.tags, d.wikiEntry));
            });
            
            // populate only once to avoid Knockout triggering update
            me.places(arr);
        });
    }
    
    function _toggle () {
        $("#sidebar").toggleClass("sidebar--toggle");
    }
    
    function _filter () {
        var s = me.filterStr().trim();
        var re = new RegExp(s, "gi");
        
        // close all open infoWindows
        map.infoWindow.close();
        
        // filter locations based on RegEx
        ko.utils.arrayForEach(me.places(), function (place, i) {
            if (place.tags.join().concat(place.name).search(re) > -1) {
                place.display("block");
                place.marker.setOpacity(1);
            } else {
                place.display("none");
                place.marker.setOpacity(0);
            }
        });
    }
    
    function _select (el) {
        new gmaps.event.trigger(this.marker, "click");
    }
    
    return me;
}(jQuery, ko, app.DataLoader, app.Place, google.maps, app.Map));