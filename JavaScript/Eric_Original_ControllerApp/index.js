/**
 * See install.sh before running this app
 * Run with: `browser-refresh`
 */

var express = require('express');
var app     = express();

app.configure(function() {
  app.set('port', 8080);
  app.use(express.logger('dev'));
	app.use(app.router);
});
require('./modules/config')(app);
require('./modules/routes')(app);

// Communicate with the python script:
require('./modules/python-controller')(app);

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
