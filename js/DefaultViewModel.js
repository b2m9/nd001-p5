var app = window.app || {};

app.DefaultViewModel = (function ($, ko, db, map) {
    "use strict";
    
    var me = {
        places: ko.observableArray([]),
        init: _init,
        filter: _filter,
        toggle: _toggle
    };
    
    function _init () {
        me.places.subscribe(function () {
            console.log("places changed", arguments);
        } );
        
        db.getPlaces(function (data) {
            var arr = [];
            var markers = [];
            
            data = data || [];
            data.forEach(function (d) {
                // parse coords
                var coords = [parseFloat(d.coords[0] || 0), parseFloat(d.coords[1] || 0)];
                
                arr.push(new app.Place(d.name, coords, d.tags));
                markers.push(coords);
            });
            
            // populate only once to avoid Knockout triggering update
            me.places(arr);
            // push new markers to map
            map.updateMarkers(markers);
        });
    }
    
    function _toggle () {
        $("#sidebar").toggleClass("sidebar--toggle");
    }
    
    function _filter () {
        var s = $("#search").val().trim();
        var re = new RegExp(s, "gi");
        var markers = [];
        
        ko.utils.arrayForEach(me.places(), function (place, i) {
            if (place.tags().join().concat(place.name()).search(re) > -1) {
                place.display("block");
                markers.push([place.lat(), place.lng()]);
            } else {
                place.display("none");
            }
        });
        
        // TODO: do something with markers
        map.updateMarkers(markers);
    }
    
    return me;
}(jQuery, ko, app.DataLoader, app.Map));