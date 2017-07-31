/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var rocky = __webpack_require__(2);

	// //
	// // Basic Digital Watchface
	// //

	// // rocky.on('draw', function(event) {
	// //   // Get the CanvasRenderingContext2D object
	// //   var ctx = event.context;

	// //   // Clear the screen
	// //   ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

	// //   // Determine the width and height of the display
	// //   var w = ctx.canvas.unobstructedWidth;
	// //   var h = ctx.canvas.unobstructedHeight;

	// //   // Current date/time
	// //   var d = new Date();

	// //   // Set the text color
	// //   ctx.fillStyle = 'white';

	// //   // Center align the text
	// //   ctx.textAlign = 'center';

	// //   // Display the time, in the middle of the screen
	// //   ctx.fillText(d.toLocaleTimeString(), w / 2, h / 2, w);
	// // });

	// // -----------------------------------------------------------------------------

	// // //
	// // // Analog Watchface
	// // //

	// // function fractionToRadian(fraction) {
	// //   return fraction * 2 * Math.PI;
	// // }

	// // function drawHand(ctx, cx, cy, angle, length, color) {
	// //   // Find the end points
	// //   var x2 = cx + Math.sin(angle) * length;
	// //   var y2 = cy - Math.cos(angle) * length;

	// //   // Configure how we want to draw the hand
	// //   ctx.lineWidth = 8;
	// //   ctx.strokeStyle = color;

	// //   // Begin drawing
	// //   ctx.beginPath();

	// //   // Move to the center point, then draw the line
	// //   ctx.moveTo(cx, cy);
	// //   ctx.lineTo(x2, y2);

	// //   // Stroke the line (output to display)
	// //   ctx.stroke();
	// // }

	// // rocky.on('draw', function(event) {
	// //   var ctx = event.context;
	// //   var d = new Date();

	// //   // Clear the screen
	// //   ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

	// //   // Determine the width and height of the display
	// //   var w = ctx.canvas.unobstructedWidth;
	// //   var h = ctx.canvas.unobstructedHeight;

	// //   // Determine the center point of the display
	// //   // and the max size of watch hands
	// //   var cx = w / 2;
	// //   var cy = h / 2;

	// //   // -20 so we're inset 10px on each side
	// //   var maxLength = (Math.min(w, h) - 20) / 2;

	// //   // Calculate the minute hand angle
	// //   var minuteFraction = (d.getMinutes()) / 60;
	// //   var minuteAngle = fractionToRadian(minuteFraction);

	// //   // Draw the minute hand
	// //   drawHand(ctx, cx, cy, minuteAngle, maxLength, "white");

	// //   // Calculate the hour hand angle
	// //   var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
	// //   var hourAngle = fractionToRadian(hourFraction);

	// //   // Draw the hour hand
	// //   drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, "lightblue");
	// // });

	// // //
	// // // Universal on-change event
	// // //

	// // rocky.on('minutechange', function(event) {
	// //   // Display a message in the system logs
	// //   console.log("Another minute with your Pebble!");

	// //   // Request the screen to be redrawn on next pass
	// //   rocky.requestDraw();
	// // });

	// -----------------------------------------------------------------------------

	//
	// w/ Weather-Implementation
	//

	// Global object to store weather data
	var weather;

	rocky.on('hourchange', function(event) {
	  // Send a message to fetch the weather information (on startup and every hour)
	  rocky.postMessage({'fetch': true});
	});

	rocky.on('minutechange', function(event) {
	  // Tick every minute
	  rocky.requestDraw();
	});

	rocky.on('message', function(event) {
	  // Receive a message from the mobile device (pkjs)
	  var message = event.data;

	  if (message.weather) {
	    // Save the weather data
	    weather = message.weather;

	    // Request a redraw so we see the information
	    rocky.requestDraw();
	  }
	});

	rocky.on('draw', function(event) {
	  var ctx = event.context;
	  var d = new Date();

	  // Clear the screen
	  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

	  // Draw the conditions (before clock hands, so it's drawn underneath them)
	  if (weather) {
	    drawWeather(ctx, weather);
	  }

	  // Determine the width and height of the display
	  var w = ctx.canvas.unobstructedWidth;
	  var h = ctx.canvas.unobstructedHeight;

	  // Determine the center point of the display
	  // and the max size of watch hands
	  var cx = w / 2;
	  var cy = h / 2;

	  // -20 so we're inset 10px on each side
	  var maxLength = (Math.min(w, h) - 20) / 2;

	  // Calculate the minute hand angle
	  var minuteFraction = (d.getMinutes()) / 60;
	  var minuteAngle = fractionToRadian(minuteFraction);

	  // Draw the minute hand
	  drawHand(ctx, cx, cy, minuteAngle, maxLength, 'white');

	  // Calculate the hour hand angle
	  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
	  var hourAngle = fractionToRadian(hourFraction);

	  // Draw the hour hand
	  drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, 'lightblue');
	});

	function drawWeather(ctx, weather) {
	  // Create a string describing the weather
	  //var weatherString = weather.celcius + 'ºC, ' + weather.desc;
	  var weatherString = weather.fahrenheit + 'ºF, ' + weather.desc;

	  // Draw the text, top center
	  ctx.fillStyle = 'lightgray';
	  ctx.textAlign = 'center';
	  ctx.font = '14px Gothic';
	  ctx.fillText(weatherString, ctx.canvas.unobstructedWidth / 2, 2);
	}

	function drawHand(ctx, cx, cy, angle, length, color) {
	  // Find the end points
	  var x2 = cx + Math.sin(angle) * length;
	  var y2 = cy - Math.cos(angle) * length;

	  // Configure how we want to draw the hand
	  ctx.lineWidth = 8;
	  ctx.strokeStyle = color;

	  // Begin drawing
	  ctx.beginPath();

	  // Move to the center point, then draw the line
	  ctx.moveTo(cx, cy);
	  ctx.lineTo(x2, y2);

	  // Stroke the line (output to display)
	  ctx.stroke();
	}

	function fractionToRadian(fraction) {
	  return fraction * 2 * Math.PI;
	}

	// -----------------------------------------------------------------------------

	//
	// Universal on-change event
	//

	rocky.on('minutechange', function(event) {
	  // Display a message in the system logs
	  console.log("Another minute with your Pebble!");

	  // Request the screen to be redrawn on next pass
	  rocky.requestDraw();
	});


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = _rocky;


/***/ })
/******/ ]);