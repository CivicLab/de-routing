define([
        'jquery',
        'underscore',
        'backbone',
        'values/constants'
], function($, _, Backbone, CONSTANTS){

	SubtaskModel = Backbone.Model.extend({    

		defaults : {
			text: "",
			action: false,
			result: "",
			resultType: 'none',
			fileName : false
		},

		setResultFilePath: function(record_id) {
			if (this.get('resultType') == 'file') {
				if (this.get('fileName')) {
					this.set({ fileName : CONSTANTS.SETTING_WEB_DATA_FOLDER_URL+'/'+record_id+'/'+this.get('fileName')});
				}
			}
		}

	});
	
	return SubtaskModel;
});