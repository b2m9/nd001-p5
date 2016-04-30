var app = window.app || {};

app.Place = (function(ko, map) {

    return function(name, coords, tags) {
        "use strict";

        this.name = ko.observable(name || "");
        this.lat = ko.observable(coords[0] || 0);
        this.lng = ko.observable(coords[1] || 0);
        this.tags = ko.observable(tags || []);
        this.display = ko.observable("block");
        this.marker = map.createMarker(coords);
    };
}(ko, app.Map));