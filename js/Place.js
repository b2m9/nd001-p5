var app = window.app || {};

// app.Place = function (name, coords, tags) {
//     "use strict";
    
//     this.name = ko.observable(name || "");
//     this.lat = ko.observable(coords[0] || 0);
//     this.lng = ko.observable(coords[1] || 0);
//     this.tags = ko.observable(tags || []);
//     this.display = ko.observable("block");
// };

app.Place = (function () {
    
    return function (name, coords, tags) {
    "use strict";
    
    this.name = ko.observable(name || "");
    this.lat = ko.observable(coords[0] || 0);
    this.lng = ko.observable(coords[1] || 0);
    this.tags = ko.observable(tags || []);
    this.display = ko.observable("block");
};
}());