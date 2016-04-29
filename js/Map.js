var app = window.app || {};

app.Map = (function ($, maplib) {
    "use strict";
    
    // TODO: attribution
    var me = {
        map: {},
        id: "map-container",
        origin: [0, 0],
        zoom: 2,
        tiles: "http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
        markers: [],
        markerLayerGroup: maplib.layerGroup(),
        init: _init,
        updateMarkers: _updateMarkers
    };
    
    function _init () {
        var map = me.map;
        
        // create map pane
        map = maplib.map(me.id).setView(me.origin, me.zoom);
        // connect to tile server
        maplib.tileLayer(me.tiles).addTo(map);
        me.markerLayerGroup.addTo(map);
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
                marker = maplib.marker([coords[i][0] || 0, coords[i][1] || 0]);
                markers.push(marker);
                layerGroup.addLayer(marker);
            }
            
            console.log("markers after fill: ", me.markers.length, me.markers, me.markerLayerGroup);
        }
        
        
        /*
            1. how do I identify markers? by title?
            2. create marker layer
            3. fill layer with markers
            easy
            
            1. update markers with an array of all (changed) places?
            2. go through each marker and check if their counterpart has changed
                - this is stupid because you iterate multiple times of it
                - useless effort
                - brute force: remove layer, create a new one?
            
        */
        
        // if ($.isArray(coords)) {
            
        //     for (;i < len; i++) {
                
        //     } 
            
        //     debugger;
            
        //     me.markers.push(maplib.marker([coords[0] || 0, coords[1] || 0]).addTo(me.map));
            
        //     me.map.addLayer();
        // }
    }
    
    return me;
}(jQuery, L));