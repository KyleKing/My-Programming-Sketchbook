// Receiving Stdin
// $ echo "[\"foo\"]" | node parseSongInfo.js
// Full example at bottom:
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  // console.log(data);
  // data = cleanScptStr(data);
  var input = JSON.parse(data);
  var output = parseData(input);
	var hs_inputs = '{"song":"' + output.song + '", "artist":"' + output.artist + '"}';
	console.log(hs_inputs);
});

// function cleanScptStr(applescriptStr) {
// 	// console.log(applescriptStr);
// 	// console.log(applescriptStr.replace(/[`"']/, '!!!'));
// 	return applescriptStr.replace(/'/g, '!!!')
// 	// .replace(/"/g, '!!!');
// }

function doesExist(str) {
	if (str === undefined || str === '') {
		return false
	} else {
		return true
	}
}

function isSoundcloudAD(song, artist) {
	if ( doesExist(artist) && artist.match(/SCOPS/) ) {
		return true
	} else {
		return false
	}
}

function splitBy(tab_title, splitter, expectedLength) {
	// console.log(tab_title);
	var data = tab_title.split(splitter);
	// console.log(data);
	return {
		song: data[0],
		artist: data[1]
	}
	// if (data.length === expectedLength) {
	// 	return {
	// 		song: data[0],
	// 		artist: data[1]
	// 	}
	// }
	// else {
	// 	return false
	// }
}

function parseData(input) {
  // loop through each unit of the array

  for (var i = 0; i < input.tab_titles.length; i++) {
		var metadata = "";
		var title = input.tab_titles[i];
		var URL = input.tab_URLs[i];

		// Determine music source and return info
		if (URL.match(/soundcloud.com/)) {
			// Account for '-' or 'by' naming conventions:
			var song, artist
			// metadata = splitBy(title, /( by | - )/g, 2);
			metadata = splitBy(title, / by /g, 2);
			if (metadata.artist) {
				song = metadata.song;
				artist = metadata.artist;
			} else {
				// If sound cloud, flip artist/song:
				metadata = splitBy(title, / - /g, 2);
				song = metadata.artist;
				artist = metadata.song;
			}
			// Check if an ad is playing
			if (isSoundcloudAD(song, artist)) {
				return {
					song: song,
					artist: 'mute'
				}
			} else {
				return metadata
			}

		} else if (URL.match(/play.spotify.com/)) {
			metadata = splitBy(title, / - /, 3);
			// FIXME: need a way to return only when prioritized

		} else if (URL.match(/pandora.com/)) {
			// // Doesn't work right now, try the desktop player instead
			// metadata = splitBy(title, / - /, 10);
		} else {
			// console.log('not known music website');
		}
	}

	return {
		song: 'not known music website',
		artist: 'not known music website'
	}
}


// Working with UNIX to allow killing script
process.on('SIGINT', function () {
  console.log('Got a SIGINT. Goodbye cruel world');
  process.exit(0);
});


// Need to get rid of any ' or " from tab titles in applescript function:
// $ echo '{"tab_titles": ["Intro - Kygo - Spotify", "Couzare x Campbel - Long Way (ft. Cozy) by Couzare", "Florescent animated DJs spinning and dancing to Coops (@CoopsOfficial) - #Musicgeeks"], "tab_URLs": ["https://play.spotify.com/album/0uMIzWh1uEpHEBell4rlF8", "https://soundcloud.com/kyle-king-11", "https://www.musicgeeks.co/coops/?utm_source=Musicgeeks&utm_campaign=16a2b29873-mgnewsletter&utm_medium=email&utm_term=0_e49d1aad34-16a2b29873-344428089"]}' | node parseSongInfo.js
