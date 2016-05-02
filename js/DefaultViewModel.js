var app = window.app || {};

app.DefaultViewModel = (function ($, ko, db) {
    "use strict";
    
    var me = {
        places: ko.observableArray([]),
        init: _init,
        toggle: _toggle,
        filter: _filter,
        select: _select
    };
    
    function _init () {
        db.getPlaces(function (data) {
            var arr = [];
            
            data = data || [];
            data.forEach(function (d) {
                var coords = [parseFloat(d.coords[0] || 0), parseFloat(d.coords[1] || 0)];
                
                arr.push(new app.Place(d.name, coords, d.tags, d.wikiEntry));
            });
            
            // populate only once to avoid Knockout triggering update
            me.places(arr);
        });
    }
    
    function _toggle () {
        $("#sidebar").toggleClass("sidebar--toggle");
    }
    
    function _filter () {
        var s = $("#search").val().trim();
        var re = new RegExp(s, "gi");
        
        ko.utils.arrayForEach(me.places(), function (place, i) {
            if (place.tags().join().concat(place.name()).search(re) > -1) {
                place.display("block");
                place.marker.setOpacity(1);
            } else {
                place.display("none");
                place.marker.setOpacity(0);
            }
        });
    }
    
    function _select (el) {
        this.marker.fireEvent("click");
    }
    
    return me;
}(jQuery, ko, app.DataLoader));