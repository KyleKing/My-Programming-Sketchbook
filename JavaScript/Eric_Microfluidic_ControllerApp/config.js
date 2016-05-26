/**
 * This file runs some configuration settings on your express application.
 */

// Include the handlebars templating library
var handlebars = require('express3-handlebars'),
	express = require('express');

// Need JQuery first:
// require('bootstrap');

// Require()-ing this module will return a function
// that the index.js file will use to configure the
// express application

module.exports = function(app){

	// Register and configure the handlebars templating engine
	app.engine('html', handlebars({
		defaultLayout: 'main',
		extname: '.html',
		layoutsDir: __dirname + '/views/layouts'
	}));

	// Set .html as the default template extension
	app.set('view engine', 'html');

	// Tell express where it can find the templates
	app.set('views', __dirname + '/views');

	// Make the files in the public folder available to the world
	app.use(express.static(__dirname + '/public'));

	// Parse POST request data. It will be available in the req.body object
	app.use(express.urlencoded());

};
