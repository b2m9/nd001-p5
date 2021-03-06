var app = window.app || {};

app.Map = (function($, gmaps, db) {
    "use strict";

    /**
     * Instance for handling map layer. Singleton.
     * @member {object} map - Google Maps object
     * @member {string} id - ID of DOM element
     * @member {object} infoWindow - Popup
     * @member {array} origin - Initial location of map
     * @member {number} zoom - Initial zoom of map
     * @method init - Initialises map and infoWindow
     * @method createMarker - Creates and returns new marker
     */
    var me = {
        map: {},
        id: "map-container",
        infoWindow: {},
        origin: [0, 0],
        zoom: 2,
        init: _init,
        createMarker: _createMarker
    };

    function _init() {
        // create map pane
        me.map = new gmaps.Map(document.getElementById(me.id), {
            zoom: me.zoom,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            center: {
                lat: me.origin[0],
                lng: me.origin[1]
            }
        });

        // popup window
        me.infoWindow = new gmaps.InfoWindow({});
    }

    function _createMarker(title, wikiEntry, lat, lng) {
        var marker = new gmaps.Marker({
            position: new gmaps.LatLng(lat, lng),
            map: me.map,
            title: title
        });

        marker.addListener("click", function() {
            // move map centre to marker position
            me.map.setCenter({
                lat: lat,
                lng: lng
            });

            // change content of infoWindow
            _clearPopup();
            _setTitle(title);
            _setInfoWindowContent(me.infoWindow, wikiEntry, lat, lng);

            // finally open infoWindow
            me.infoWindow.open(me.map, marker);

            // handle bounce animation of marker
            marker.setAnimation(gmaps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 700);
        });

        return marker;
    }

    // reset content of popup
    function _clearPopup() {
        me.infoWindow.setContent("<div class='popup'><h1></h1>" + "<p class='popupWiki'></p>" + "<p class='popupForecast'></p></div>");
    }

    // set title in content of popup
    function _setTitle(title) {
        var html = $(me.infoWindow.getContent())
            .find("h1").html(title).parent().get(0).outerHTML;

        me.infoWindow.setContent(html);
    }

    // async request to retrieve Wikipedia and Forecast.io content
    function _setInfoWindowContent(popup, wikiEntry, lat, lng) {
        // handle Wikipedia content
        db.getWikipediaContent(wikiEntry).done(function(res, state) {
            var page = {};

            if (state === "success" && res.query.pages) {
                page = res.query.pages;

                _setWikiContent(page[Object.keys(page)[0]].extract + "<span class='attribution'>Provided by Wikipedia</span>");
            }
        }).fail(function(res, state) {
            _setWikiContent("Couldn't reach Wikipedia API.");
        });

        // handle weather content
        db.getWeatherData(lat, lng).done(function(res, state) {
            var temp = 0;

            if (state === "success" && res.currently) {
                temp = parseFloat((res.currently.temperature - 32) / 1.8).toFixed(2);

                _setWeatherContent("Current temperature: " + temp + "ºC<span class='attribution'>Provided by Forecast.io</span>");
            }

        }).fail(function(res, state) {
            _setWeatherContent("Couldn't reach Forecast.io API.");
        });
    }

    // set wiki paragraph in content of popup
    function _setWikiContent(str) {
        var html = $(me.infoWindow.getContent())
            .find(".popupWiki").html(str).parent().get(0).outerHTML;

        me.infoWindow.setContent(html);
    }

    // set temperature in content of popup
    function _setWeatherContent(str) {
        var html = $(me.infoWindow.getContent())
            .find(".popupForecast").html(str).parent().get(0).outerHTML;

        me.infoWindow.setContent(html);
    }

    return me;
}(jQuery, google.maps, app.DataLoader));