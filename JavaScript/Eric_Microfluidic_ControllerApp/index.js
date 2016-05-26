/**
 * This is the main file of the application. Run it with the
 * `node index.js` command from your terminal
 *
 * Remember to run `npm install` in the project folder, so
 * all the required libraries are downloaded and installed.
 */

// Create a new express.js web app:
var express = require('express');
var app = express();

// var publicDir = path.join(__dirname, 'public');
app.configure(function() {
  app.set('port', 8080);
  app.use(express.logger('dev'));
});

// Configure express with the settings found in
// our config.js file
require('./config')(app);

// Add the routes that the app will react to,
// as defined in our routes.js file
require('./routes')(app);

// // Non-reloading version:
// app.listen(app.get('port'));
// console.log('Your application is running on http://localhost:8080');

// Reload code and refresh browser
// (note need to add process.env.BROWSER_REFRESH_URL to script tag in html)
app.listen(app.get('port'), function() {
	console.log('Listening on port %d', app.get('port'));
	if (process.send) {
		process.send('online');
	}
});
