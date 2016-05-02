var app = window.app || {};

app.Place = (function(ko, map) {

    return function(name, coords, tags, wikiEntry) {
        "use strict";

        this.name = ko.observable(name || "");
        this.lat = ko.observable(coords[0] || 0);
        this.lng = ko.observable(coords[1] || 0);
        this.tags = ko.observable(tags || []);
        this.display = ko.observable("block");
        this.wikiEntry = wikiEntry;
        this.marker = map.createMarker(this.name(), this.wikiEntry, this.lat(), this.lng());
    };
}(ko, app.Map));