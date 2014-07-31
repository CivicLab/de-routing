app.GeoModel = Backbone.Model.extend({    
    
    defaults : {
        layer : false,
        className : "",
        visibility: true,
        type: "none",

        geoType : 'none',
        geoCoordinates : [],
        properties : {}
    	
    },

    toGeoJSON: function() {
        var self = this;
        var json = {
            "type": "Feature",
            "geometry": {
                "type": self.get('geoType'),
                "coordinates": self.get('geoCoordinates')
            },
            "properties": _.extend( self.get('properties'), { className: self.get('className')})
        };

        return json;
    },

    setLayer: function(layer) {
        this.set({ 'layer' : layer });
    },

    setVisibility: function(visible) {
        this.set({'visibility' : visible});
    }
});

app.GeoCollection = Backbone.Collection.extend({
    
    model: app.GeoModel
 
});