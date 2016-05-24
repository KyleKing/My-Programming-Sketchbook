// var osascript = require('osascript');
// var fs = require('fs');

// // Run JavaScript file through OSA
// fs.createReadStream('/Users/kyleking/Developer/My-Programming-Sketchbook/AppleScripts/Hammerspoon/chrome_songs.applescript')
//   // Need to override options to define AppleScript
//   .pipe(osascript({ type: 'AppleScript' }))
//   .pipe(process.stdout);

// note the file method after require ¬
var osascript = require('osascript').file;
var _ = require('underscore');
var exec = require('child_process').exec;

// /**
//  * Testing finding true value in an array...WIP
//  * @type {array}
//  */
// var priorities = [false, false, false];
// function isTrue(element, index, array) {
//   var start = 2;
//   while (start <= Math.sqrt(element)) {
//     if (element % start++ < 1) {
//       return false;
//     }
//   }
//   return element > 1;
// }

/**
 * Removes any literals from Applescript strings
 * @param  {str} applescriptStr raw input
 * @return {str}                cleaned up str
 */
function cleanScptStr(applescriptStr) {
	// console.log(applescriptStr);
	// console.log(applescriptStr.replace(/[`"']/, '!!!'));
	return applescriptStr.replace(/'/, '`').replace(/"/, '`');
}

function isSCAd(song, artist) {
	if ( artist.match(/SCOPS/) ) {
		return true
	} else {
		return false
	}
}

/**
 * Splits a string into components with specified regexp
 * @param  {str} tab_title      Chrome tab title from Applescript fetcher
 * @param  {regexp} splitter       regular expression based on URL
 * @param  {number} expectedLength Expected length of split units
 * @return {object}                artist and song name
 */
function splitBy(tab_title, splitter, expectedLength) {
	tab_title = cleanScptStr(tab_title);
	var data = tab_title.split(splitter);
	if (data.length === expectedLength) {
		return {
			song: data[0],
			artist: data[1]
		}
	}
	else {
		return false
	}
}

function parseData(input) {
  // loop through each unit of the array
  for (var i = 0; i < input.tab_titles.length; i++) {
		var metadata = "";
		var title = input.tab_titles[i];
		var URL = input.tab_URLs[i];

		// Determine music source and return info
		if (URL.match(/soundcloud.com/)) {
			metadata = splitBy(title, / by /, 2);
			if (isSCAd(metadata.song, metadata.artist)) {
				return {
					song: metadata.song,
					artist: ''
				}
			} else {
				return metadata
			}

		} else if (URL.match(/play.spotify.com/)) {
			metadata = splitBy(title, / - /, 3);

		} else if (URL.match(/pandora.com/)) {
			metadata = splitBy(title, / - /, 10);

		} else {
			// console.log('not known music website');
		}

	}
}

/** Parses stdout of applescript function */
var scptSrcPath = '/Users/kyleking/Developer/My-Programming-Sketchbook/AppleScripts';
var file = '/Hammerspoon/chrome_songs.applescript';
osascript(scptSrcPath + file, function (err, data) {
  if(err) console.log(err);
  // console.log(data);
  var input = JSON.parse(data);
  var output = parseData(input);
	// var child = exec("/usr/local/bin/hs -c 'AlertUser(" + '"' + output.song + '"' + ")'");
	var hs_inputs = '"' + output.song + '","' + output.artist + '"'
	var child = exec("/usr/local/bin/hs -c 'Track_Info(" + hs_inputs + ")'");
	// child.stdout.on('data', function(data) {
	//   console.log('stdout: ' + data);
	// });
	child.stderr.on('data', function(data) {
	  console.log('stdout: ' + data);
	});
	child.on('close', function(code) {
	  console.log('closing code: ' + code);
	});
});


// var child = exec('bash process.bash');

// child.stdout.on('data', function(data) {
//   console.log('stdout: ' + data);
// });
// child.stderr.on('data', function(data) {
//   console.log('stdout: ' + data);
// });
// child.on('close', function(code) {
//   console.log('closing code: ' + code);
// });

// // Delay and killing sub-process
// var kill = require('tree-kill');
// var bashProcess = child.pid;
// setTimeout(function() {
//   kill(bashProcess, 'SIGTERM', function(err) {
//     if (err) console.log('SIGTERM err: ' + err);
//   });
// }, 3000);
