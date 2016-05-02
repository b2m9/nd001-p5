var app = window.app || {};

app.Map = (function ($, L, db) {
    "use strict";
    
    // TODO: attribution
    var me = {
        map: {},
        id: "map-container",
        origin: [0, 0],
        zoom: 2,
        tiles: "http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
        markerLayerGroup: L.layerGroup(),
        init: _init,
        createMarker: _createMarker
    };
    
    function _init () {
        var map = me.map;
        
        // TODO: max zoom?
        
        // create map pane
        map = L.map(me.id).setView(me.origin, me.zoom);
        // connect to tile server
        L.tileLayer(me.tiles).addTo(map);
        // add layer group
        me.markerLayerGroup.addTo(map);
        
        // add event listeners to remove marker animation
        $("#" + me.id).on("animationend", "img.leaflet-marker-icon", _animationEnd);
        $("#" + me.id).on("animationend", "img.leaflet-marker-shadow", _animationEnd);
    }
    
    function _animationEnd () {
        $(this).removeClass("bounce");
    }
    
    function _createMarker (title, wikiEntry, lat, lng) {
        var marker = L.marker([lat || 0, lng || 0]);
        
        marker.on("click", function (ev) {
            var img = $(ev.target._icon);
            var shadow = $(ev.target._shadow);
            
            img.addClass("bounce");
            shadow.addClass("bounce");
        }).bindPopup("<div class='popup'><h1>" + title + "</h1>" + "<p class='popupWiki'></p>" + "<p class='popupForecast'></p></div>");;
        
        _getMarkerPopup(marker, wikiEntry, title, lat ,lng);
        
        me.markerLayerGroup.addLayer(marker);
        return marker;
    }
    
    function _getMarkerPopup (marker, wikiEntry, title, lat, lng) {
        
        db.getWikipediaContent(wikiEntry).done(function (res, state) {
            var html = $(marker.getPopup().getContent());
            var page = {};
            
            if (state === "success" && res.query.pages) {
                page = res.query.pages;
            
                html.find(".popupWiki").append("<p>" + page[Object.keys(page)[0]].extract + "<span class='attribution'>Provided by Wikipedia</span></p>");
                
                marker.getPopup().setContent(html.get(0).outerHTML);
            }
        }).fail(function (res, state) {
            var html = $(marker.getPopup().getContent());
            
            html.find(".popupWiki").append("<p>Couldn't reach Wikipedia API.</p>");
            
            marker.getPopup().setContent(html.get(0).outerHTML);
        });
        
        db.getWeatherData(lat, lng).done(function (res, state) {
            var html = $(marker.getPopup().getContent());
            var temp = 0;
            
            if (state === "success" && res.currently) {
                temp = parseFloat((res.currently.temperature - 32) / 1.8).toFixed(2);
                
                html.find(".popupForecast").append("<p>Current temperature: " + temp + "ºC<span class='attribution'>Provided by Forecast.io</span></p>");
                
                marker.getPopup().setContent(html.get(0).outerHTML);
            }
            
        }).fail(function (res, state) {
            var html = $(marker.getPopup().getContent());

            html.find(".popupForecast").append("<p>Couldn't reach Forecast.io API.</p>");
            
            marker.getPopup().setContent(html.get(0).outerHTML);
        });
    }

    return me;
}(jQuery, L, app.DataLoader));