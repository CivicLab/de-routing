define([
  'jquery',
  'underscore',
  'backbone',
  'values/constants'
], function($, _, Backbone, CONSTANTS){
	 
	var ExplorationModel = Backbone.Model.extend({    
	    
	    urlRoot : CONSTANTS.SETTING_WEB_SERVICE_URL+'/explorations/',
	    
	    defaults: {
	    	name: '',
	    	json: {
	    		name : '',
	    		description: '',
	    		briefing: '',
	    		randomTasks : false,
	    		area : {
	    			latitude : 0,
	    			longitude : 0,
	    			radius: 1000
	    		},
	    		directions: [ 
	    		    {type:'forward', text: 'Follow your street for 2 minutes.'}
	    		],
	    		tasklist: [
	    		    {
	    		    	title: 'Task',
	    		    	subtasks: [
	    		    	     { text: 'Some text which describes the task', action: 'none', duration: 10, start: '', end: '' }
	    		    	]
	    		    }
	    		]
	    		
	    	},
	    	visible : 1
	    },
	    
	    setData: function(data) {
	    	
	    	//add ids to tasks
	    	var tasks = data.tasklist;
	    	for (i=0;i<tasks.length;i++) {
	    		tasks[i].id = i;
	    	}
	    	
		   this.set({json : data});
		   this.set({name : data.name});
	    },
	    
	    getMap : function() {
	    	if (this.has('json'))
	    		return this.get('json').area;
	    	else
	    		return {};
	    },

	    getTasks :  function() {
	    	if (this.has('json'))
	    		return this.get('json').tasklist;
	    	else
	    		return {};
	    }
	
	});
	
	return ExplorationModel;
	
});