/*global require*/
require(["dojo/on", "esri/map", "esri/layers/agstiled", "esri/dijit/Print"], function (on) {
	"use strict";

	var map, printer, windowResizeDeferred;

	map = new esri.Map("map", {
		extent: new esri.geometry.Extent({ "xmin": -13912762.140351139, "ymin": 5752650.7487407755, "xmax": -12934368.178300932, "ymax": 6222891.346751157, "spatialReference": { "wkid": 102100} })
	});

	////// Add map variable to global scope for debugging.
	////window.map = map;

	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"));
	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer"));
	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer"));

	dojo.connect(map, "onLoad", function () {
		windowResizeDeferred = on(window, "resize", function () {
			map.resize();
		});

		printer = new esri.dijit.Print({
			map: map,
			url: "http://hqolymgis99t/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
		}, dojo.byId("printButton"));
		printer.startup();
	});
});