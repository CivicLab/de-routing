define([
	'jquery',
	'underscore',
	'views/BaseView',
	'views/AlertOverlay',
	'views/ProgressOverlay',
	'models/RecordCollection',
	'values/language',
	'text!templates/recordTemplate.html'
], function($, _, BaseView, AlertOverlay, ProgressOverlay, RecordCollection, LANGUAGE, recordTemplate){
	
	var RecordView = BaseView.extend({
		
		events : {
			'click a.deleteRecord': '_onDelete',
			'click a.submitData': '_onSubmit'
		},
		
		initialize: function() {
			
			//load data from local storage
			this.collection.syncData();
			this.model = this.collection.get({id:this.id});
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			var compiledTemplate = _.template( recordTemplate, {record: this.model} );
			// Append our compiled template to this Views "el"
			this.$el.html( compiledTemplate );
			
			return this;
		},
		
		_onDelete: function() {
			var self = this;
			
			var alertOverlay = new AlertOverlay({
				title:"Delete Record", 
				text:"Are you sure?",
				showRejectButton : true,
				callback : function(accept) {
					if (accept) {
						window.location.hash = $('.deleteRecord').attr('href');
						self.model.destroy();
					}
				}});
			this.addChildView(alertOverlay);
			alertOverlay.show();
			return false;
		},
		
		_onSubmit: function() {
			var self = this;
			
			// open progress overlay
			var progressOverlay = new ProgressOverlay({title: "Upload Record", text: "Uploading record data", callback: function(result) {
				if (result) {
				}
			}});
			this.addChildView(progressOverlay);
			progressOverlay.show();
			
			// upload file
			this.model.upload({
				success: function() {
					self.model.set({submitted : true});
					self.model.save();
					self.render();
					progressOverlay.setFinished("Record succesfully uploaded.");
				},
				error: function(error) {
					progressOverlay.setFinished(error);
				},
				progress: function(prog) {
					progressOverlay.setProgress(prog);
				}
			});
			return false;
		}
		
	});
	// Our module now returns our view
	return RecordView;
	
});