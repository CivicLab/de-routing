define([
        'jquery',
        'underscore',
        'views/BaseView',
        'models/MapModel'
], function($, _, BaseView, MapModel){


	MapView = BaseView.extend({

		initialize: function(options) {
			var self = this;

			this.recordCollection = options.recordCollection;

			this.geoLayerOptions = {
					pointToLayer: function (feature, latlng) {
						return L.marker(latlng, {icon : L.icon({ // style markers
							iconUrl : 'images/marker-placeholder.png',
							clickable: true,
							className: feature.properties.className
						})});
					},
					style : function(feature) { // style other vectors
						if (feature.properties.type == 'path') {
							return { 
								clickable: false,
								className: feature.properties.className
							};
						}

					},
					onEachFeature: function(feature, layer) { // connect to event
						if (feature.properties.type == 'marker')
							layer.on("click", function() {
								self._onMarkerClick(this,feature);
							});
					}

			};		

			/*this.tileLayer = L.tileLayer.grayscale('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    		attribution: '-'
		});*/
			this.tileLayers = {
					"Map": 	
						L.tileLayer('http://a.tile.stamen.com/toner-background/{z}/{x}/{y}.png', {
							attribution: '-',
							opacity: 0.5,
							maxZoom: 18
						}),
						"Satellite":
							L.tileLayer(
									'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
										attribution: '-',
										maxZoom: 18,
										opacity: 0.9
									}),

									"None": L.tileLayer.canvas()
			};

			this.overlayLayers = {
					"Labels": 	
						L.tileLayer.grayscale('http://a.tile.stamen.com/toner-labels/{z}/{x}/{y}.png', {
							attribution: '-',
							opacity: 1,
							maxZoom: 18
						})
			};




			// add events
			this.recordCollection.on('change:focused', this.focusRecord, this);
			this.collection.on('add', this.addFeature, this);
			this.collection.on('change:visibility', this.changeVisibility,this);
			this.model.on('change:visibility', this.toggleTileLayer, this)

			BaseView.prototype.initialize.call(this);
		},

		render: function() {

			$(this.el).empty();

			this.map = L.map(this.el, {
				center: [ this.model.get('latitude'),this.model.get('longitude')],
				maxZoom: 19,
				minZoom: 5,
				zoom: this.model.get('zoom'),
				layers: [this.tileLayers.Map]
			});

			L.control.layers(this.tileLayers,this.overlayLayers, {position:'topright'}).addTo(this.map);

			this.map.on('baselayerchange', this._onBaseLayerChange);

			this.addAll();

			return this;
		},

		addAll: function() {
			this.collection.each(function(feature) {
				addFeature(feature)
			})
		},

		addFeature: function(geoObject) {

			var layer = L.geoJson(geoObject.toGeoJSON(),this.geoLayerOptions);
			geoObject.setLayer(layer);
			this.map.addLayer(layer);
		},

		_onMarkerClick: function(clickevent) {

			var record = this.recordCollection.get(clickevent.feature.properties.record_id);
			var task = record.getTaskById(clickevent.feature.properties.task_id);

			var popupView = new TaskView({model : task});
			this.addChildView(popupView);

			var popup = L.popup()
			.setLatLng(clickevent._latlng)
			.setContent(popupView.render(record.get('explorer')).el)
			.openOn(this.map);
		},

		_onBaseLayerChange: function(layer) {
			if (layer.name == "None") {
				$('.marker').addClass('blackmarker');
				utils.addClass('.path','blackpath');
			} else {
				$('.marker.blackmarker').removeClass('blackmarker');
				utils.removeClass('.path.blackpath','blackpath');
			}
		},

		toggleTileLayer: function() {
			if (this.model.get('visibility'))
				this.map.addLayer(this.tileLayer);
			else
				this.map.removeLayer(this.tileLayer);
		},

		resetView: function() {
			this.map.setView([ this.model.get('latitude'),this.model.get('longitude')], this.model.get('zoom'));
		},

		focusRecord: function(record) {

			$('.marker').css({'z-index' : ''});

			var id = record.get('id');

			if (record.get('focused')) {
				utils.addClass('.path.record'+id,'focused');
				$('.marker.record'+id).addClass('focused');
			} else {
				utils.removeClass('.path.record'+id,'focused');
				$('.marker.record'+id).removeClass('focused');
			}

		},

		focusTask: function(task) {

			$('.marker').css({'z-index' : ''});

			var id = task.get('id');

			if (task.get('focused')) {
				$('.marker.task'+id).addClass('focused');
			} else {
				$('.marker.task'+id).removeClass('focused');
			}

		},

		changeVisibility: function(geoObj) {
			if (geoObj.get('visibility'))
				this.map.addLayer(geoObj.get('layer'));
			else
				this.map.removeLayer(geoObj.get('layer'));
		},

	});
	return MapView;

});