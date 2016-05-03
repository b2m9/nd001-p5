var app = window.app || {};

app.DataLoader = (function($, ko) {
    "use strict";

    /**
     * Instance is handling all AJAX requests.
     * @method getPlaces - Load list of pre-defined locations
     * @method getWikipediaContent - Get first sentence from Wiki article
     * @method getWeatherData - Get weather data from given geo location
     */
    var me = {
        getPlaces: _getPlaces,
        getWikipediaContent: _getWikipediaContent,
        getWeatherData: _getWeatherData
    };

    function _getPlaces(cb) {
        if ($.isFunction(cb)) {
            $.getJSON("js/data.json", function(data) {
                data = typeof data === "string" ? ko.utils.parseJson()(data) : data;
                cb(data);
            });
        }
    }

    function _getWikipediaContent(name) {
        var url = "https://en.wikipedia.org/w/api.php?callback=?";
        var data = {
            action: "query",
            prop: "extracts",
            format: "json",
            exsentences: 1,
            exintro: 1,
            utf8: 1,
            explaintext: 1,
            titles: name
        };

        return $.getJSON(url, data);
    }

    function _getWeatherData(lat, lng) {
        var apiKey = "d99127d210cbbbeca540cd3c46a37ec2";
        var url = "https://api.forecast.io/forecast/";

        return $.getJSON(url + apiKey + "/" + lat + "," + lng + "?callback=?");
    }

    return me;
}(jQuery, ko));