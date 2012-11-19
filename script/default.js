/*global require*/
require(["dojo/on", "esri/map", "esri/layers/agstiled", "esri/dijit/Print"], function (on) {
	"use strict";

	var map;

	map = new esri.Map("map");

	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"));
	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer"));
	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer"));

	dojo.connect(map, "onLoad", function () {
		on(window, "resize", function () {
			map.resize();
		});
	});
});