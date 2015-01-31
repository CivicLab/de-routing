define([
	'jquery',
	'underscore',
	'views/BaseView',
	'views/ProgressOverlay',
	'models/SettingsModel',
	'text!templates/settingsTemplate.html'
], function($, _, BaseView, ProgressOverlay, SettingsModel, homeTemplate){
	
	var SettingsView = BaseView.extend({
		
		events: {
			'click .saveSettings': '_onSaveSettingsClick'
		},

		initialize: function() {
			
			this.model = SettingsModel;
			
			BaseView.prototype.initialize.call(this);
		},
		
		render: function(){
			
			var compiledTemplate = _.template( homeTemplate, {model: this.model.attributes } );
			// Append our compiled template to this Views "el"
			this.$el.html( compiledTemplate );
			return this;
		},
		
		_onSaveSettingsClick: function() {
			if (this.model.get('web_service_url') == $('#serviceUrl').val())
				return false;
				
			// update settings model
			this.model.set({web_service_url: $('#serviceUrl').val() });
			this.model.update(); // save model
			
			// remove former downloaded explorations
			this.collection.removeAll();

			var progressOverlay = new ProgressOverlay({text: "Settings"});
			progressOverlay.show();
			progressOverlay.setFinished("Settings saved...",1000);
			this.addChildView(progressOverlay);

			return false; 
		}
		
	});
	// Our module now returns our view
	return SettingsView;
	
});