define([
        'jquery',
        'underscore',
        'backbone',
        'models/SubtaskModel'
], function($, _, Backbone, SubtaskModel){

	SubtaskCollection = Backbone.Collection.extend({
		model: SubtaskModel
	});
	
	return SubtaskCollection;
});