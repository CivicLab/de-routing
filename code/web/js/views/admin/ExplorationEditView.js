define([
	'jquery',
	'underscore',
	'views/BaseView',
	'../../../libs/jsoneditor.min',
	'models/ExplorationModel',
	'values/explorationScheme',
	'text!templates/admin/explorationEditTemplate.html'
], function($, _, BaseView, JsonEditor, ExplorationModel, explorationScheme, explorationEditTemplate){
	
	var ExplorationListView = BaseView.extend({
		
		editor : null,
		page: 0,
		newExploration: false,
		
		events: {
			'click .btn.next-page' : '_onNextPageButtonClick',
			'click .previous-page' : '_onPreviousPageButtonClick',
			'click .save' : '_onSaveExploration',
			'click .delete' : '_onDeleteExploration'
		},
		
		initialize: function(options) {
			
			if (options.id == 'new') {
				this.newExploration = true;
				this.model = new ExplorationModel();
			} else {
				this.model = new ExplorationModel({id : options.id});
				this.model.fetch();
			}	
				
			//listen to model changes
			this.listenTo(this.model, 'change', this.render);
			
			
			BaseView.prototype.initialize.call(this);
		},

		render: function(){
			
			var compiledTemplate = _.template( explorationEditTemplate, { 
				exploration : this.model.toJSON(),
				showNextButton : this.page < 2,
				showPreviousButton : this.page > 0,
				newExploration : this.newExploration
			});
			this.$el.html( compiledTemplate );
			
			var element = this.$("#admin-editor")[0]; // get native DOM element
			var json_scheme = {};
			
			switch (this.page) {
				case 0:
					json_scheme = explorationScheme.firstPage;
					break;
				case 1:
					json_scheme = explorationScheme.secondPage;
					break;
				case 2:
					json_scheme = explorationScheme.thirdPage;
					break;
			}
			
			this.editor = new JSONEditor(element,{
				schema : json_scheme,
				disable_collapse : true,
				disable_properties : true,
				no_additional_properties : true,
				disable_edit_json: true,
				disable_array_reorder: true,
				theme: 'bootstrap3'
			});

			
			this.editor.setValue(this.model.get('json'));
			
			return this;
		},
		
		saveToModel: function() {
			var modelData = this.model.get('json');
			var mergedData = _.extend(modelData,this.editor.getValue());
			this.model.setData(mergedData);
		},
		
		_onNextPageButtonClick: function() {
			this.saveToModel();
			
			this.page = Math.min(2,this.page+1);
			this.render();
			
		},
		
		_onPreviousPageButtonClick: function() {
			this.saveToModel();
			
			this.page = Math.max(0,this.page -1);
			this.render();
		},
		
		_onSaveExploration: function() {
			this.saveToModel();
			this.model.save({},{
			success: function (){
				window.location.href = "#admin/";
			}, 
			error: function(response) {
				console.log(response);
				alert("Authentication failed.");
			}});
		},
		
		_onDeleteExploration: function() {
			if (confirm('Do you really want to delete the exploration?')) { 
				this.model.destroy({
					success : function() {
						window.location.href = "#admin/";
					},
					error: function() {
						alert("Authentication failed.");
					}});	
			}
		},
		
		close: function() {
			
			// closed editor
			this.editor.destroy();
			
			BaseView.prototype.close.call(this);
		}
	});
	// Our module now returns our view
	return ExplorationListView;
	
});