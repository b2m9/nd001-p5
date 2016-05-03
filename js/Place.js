var app = window.app || {};

app.Place = (function(ko, map) {

    /**
     * Constructor for new location.
     * @member {string} name - Name of place
     * @member {number} lat - Latitude
     * @member {number} lng - Longitude
     * @member {array} tags - Array of tags
     * @member {object} display - Display prop for list item. ko.obeservable()
     * @member {string} wikiEntry - Title of respective Wikipedia article
     * @member {object} marker - Google Maps marker
     */
    return function(name, coords, tags, wikiEntry) {
        "use strict";

        this.name = name || "";
        this.lat = coords[0] || 0;
        this.lng = coords[1] || 0;
        this.tags = tags || [];
        this.display = ko.observable("block");
        this.wikiEntry = wikiEntry;
        this.marker = map.createMarker(this.name, this.wikiEntry, this.lat, this.lng);
    };
}(ko, app.Map));