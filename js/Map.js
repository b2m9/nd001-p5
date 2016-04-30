var app = window.app || {};

app.Map = (function ($, L) {
    "use strict";
    
    // TODO: attribution
    var me = {
        map: {},
        id: "map-container",
        origin: [0, 0],
        zoom: 2,
        tiles: "http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
        markers: [],
        markerLayerGroup: L.layerGroup(),
        init: _init,
        createMarker: _createMarker,
        updateMarkers: _updateMarkers
    };
    
    function _init () {
        var map = me.map;
        
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
    
    function _createMarker (coords) {
        var marker = L.marker([coords[0] || 0, coords[1] || 0]);
        
        marker.on("click", function (ev) {
            var img = $(ev.target._icon);
            var shadow = $(ev.target._shadow);
            
            img.addClass("bounce");
            shadow.addClass("bounce");
        });
        
        me.markerLayerGroup.addLayer(marker);
        return marker;
    }
    
    function _updateMarkers (coords) {
        var layerGroup = me.markerLayerGroup;
        var markers = me.markers;
        var marker = {};
        var len = me.markers.length;
        var i;
        
        // brute force: remove all markers and create new ones
        for (i = len - 1; i >= 0; i--) {
            layerGroup.removeLayer(markers.pop());
        }
        
        console.log("markers after delete: ", me.markers.length, me.markers, me.markerLayerGroup);
        
        if ($.isArray(coords)) {
            for (i = 0, len = coords.length; i < len; i++) {
                marker = L.marker([coords[i][0] || 0, coords[i][1] || 0]);
                markers.push(marker);
                layerGroup.addLayer(marker);
            }
            
            console.log("markers after fill: ", me.markers.length, me.markers, me.markerLayerGroup);
        }
    }
    
    return me;
}(jQuery, L));