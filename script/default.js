/*global require, esri, dojo*/
/*jslint plusplus:true, browser:true*/
require(["dojo/on", "dojo/dom", "dijit/form/ComboButton", "dijit/MenuItem", "esri/arcgis/utils", "esri/map", "esri/layers/agstiled", "esri/dijit/Print"], function (on, dom) {
	"use strict";

	var map, printer, windowResizeDeferred, printUrl;

	printUrl = "http://hqolymgis99t/arcgis/rest/services/Airport/ExportWebMap/GPServer/Export Web Map";

	map = new esri.Map("map", {
		extent: new esri.geometry.Extent({ "xmin": -13912762.140351139, "ymin": 5752650.7487407755, "xmax": -12934368.178300932, "ymax": 6222891.346751157, "spatialReference": { "wkid": 102100} })
	});

	////// Add map variable to global scope for debugging.
	////window.map = map;

	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"));
	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer"));
	map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer"));
	map.addLayer(new esri.layers.ArcGISDynamicMapServiceLayer("http://www.wsdot.wa.gov/geosvcs/ArcGIS/rest/services/AirportMapApplication/AirspaceFeatures/MapServer"));

	dojo.connect(map, "onLoad", function () {
		var printRequest;
		windowResizeDeferred = on(window, "resize", function () {
			map.resize();
		});

		printRequest = esri.request({
			url: printUrl,
			content: {
				f: "json"
			},
			handleAs: "json",
			callbackParamName: "callback"
		});

		printRequest.then(function (response) {
			var parameters = response.parameters, templateParam, templates = [];

			// Loop through the parameters.
			(function () {
				var i, l;
				for (i = 0, l = parameters.length; i < l; i++) {
					if (parameters[i].name === "Layout_Template") {
						templateParam = parameters[i];
						break;
					}
				}
			} ());

			// Loop through the templates
			(function (names) {
				var i, l, template, templateName;
				for (i = 0, l = names.length; i < l; i++) {
					templateName = names[i];
					if (templateName !== "AirportOverview_10.1" && templateName !== "MAP_ONLY") {
						template = new esri.tasks.PrintTemplate();
						template.format = "PDF";
						template.layout = templateName;
						template.label = templateName;
						template.layoutOptions = {
							titleText: "My Title",
							authorText: "Me",
							copyrightText: "(C) Me",
							scalebarUnit: "Miles"
						};
						templates.push(template);

						// if (i >= 0) { break; }
					}
				}
			} (templateParam.choiceList));

			printer = new esri.dijit.Print({
				map: map,
				templates: templates,
				url: printUrl,
				async: response.executionType === "esriExecutionTypeAsynchronous"

			}, dom.byId("printButton"));

			printer.startup();
		});


	});
});