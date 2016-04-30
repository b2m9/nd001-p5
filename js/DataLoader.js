var app = window.app || {};

app.DataLoader = (function ($, ko) {
    "use strict";
    
    var me = {
        getPlaces : _getPlaces
    };
    
    function _getPlaces (cb) {
        if ($.isFunction(cb)) {
            $.getJSON("js/data.json", function (data) {
                data = typeof data === "string" ? ko.utils.parseJson()(data) : data;
                cb(data);
            });
        }
    }
    
    return me;
}(jQuery, ko));