define([
	'jquery',
	'underscore',
	'views/BaseView',
	'../../libs/jsoneditor.min',
	'models/ExplorationModel',
	'values/explorationScheme',
	'text!templates/explorationEditTemplate.html'
], function($, _, BaseView, JsonEditor, ExplorationModel, explorationScheme, explorationEditTemplate){
	
	var ExplorationListView = BaseView.extend({
		
		editor : null,
		
		initialize: function(options) {
			this.model = new ExplorationModel({id : options.id});
			this.model.fetch();
			
			//listen to model changes
			this.listenTo(this.model, 'change', this.render);
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			
			var compiledTemplate = _.template( explorationEditTemplate, { exploration : this.model.toJSON() } );
			this.$el.html( compiledTemplate );
			var element = this.$("#json_editor")[0]; // get native DOM element
			this.editor = new JSONEditor(element,{
		        schema : explorationScheme.firstPage,
		        disable_collapse : true,
				disable_properties : true,
				no_additional_properties : true,
				disable_edit_json: true,
				disable_array_reorder: true,
				theme: 'html'
		    });
			
			this.editor.setValue(this.model.get('json'));
			
			return this;
		}
	});
	// Our module now returns our view
	return ExplorationListView;
	
});