// Receiving Stdin
// $ echo "[\"foo\"]" | node parseSongInfo.js
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  console.log(data);
  var input = JSON.parse(data);
  var output = parseData(input);
	var hs_inputs = '"' + output.song + '","' + output.artist + '"';
	console.log(hs_inputs);
});


function cleanScptStr(applescriptStr) {
	// console.log(applescriptStr);
	// console.log(applescriptStr.replace(/[`"']/, '!!!'));
	return applescriptStr.replace(/'/, '`').replace(/"/, '`');
}

function isSoundcloudAD(song, artist) {
	if ( artist.match(/SCOPS/) ) {
		return true
	} else {
		return false
	}
}

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
			if (isSoundcloudAD(metadata.song, metadata.artist)) {
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




// Working with UNIX to allow killing script
process.on('SIGINT', function () {
  console.log('Got a SIGINT. Goodbye cruel world');
  process.exit(0);
});
