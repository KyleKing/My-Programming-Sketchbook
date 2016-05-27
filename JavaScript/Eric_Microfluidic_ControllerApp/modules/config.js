var handlebars = require('express3-handlebars');
var express    = require('express');

module.exports = function(app){
	app.engine('html', handlebars({
		defaultLayout: 'main',
		extname: '.html',
		layoutsDir: __dirname + '/../views/layouts'
	}));
	app.set('view engine', 'html');
	app.set('views', __dirname + '/../views');
	app.use(express.static(__dirname + '/../public'));
	app.use(express.urlencoded());
};
