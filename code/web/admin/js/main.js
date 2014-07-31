require.config({
	baseUrl: "js",
	paths: {
		jquery: '../../libs/jquery-1.10.2.min',
		backbone: '../../libs/backbone-min',
		underscore: '../../libs/underscore-min'
	}
});

require(['app',], function(App){
	App.initialize();
});