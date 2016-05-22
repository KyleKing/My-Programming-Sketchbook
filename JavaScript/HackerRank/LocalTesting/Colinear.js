// Never Finished
// Intended to be a local node application that could be run for testing

process.stdin.write();

process.stdin.resume();
process.stdin.setEncoding('ascii');

var input_stdin = "";
var input_stdin_array = "";
var input_currentline = 0;

process.stdin.on('data', function (data) {
    input_stdin += data;
});

process.stdin.on('end', function () {
    input_stdin_array = input_stdin.split("\n");
    main();
});

function readLine() {
    return input_stdin_array[input_currentline++];
}

/////////////// ignore above this line ////////////////////

/////////////// Begin My Functions ///////////////
function NumMatches(arr) {
	var Matches = [];
	console.log('THIS MUST BE INCREASED ABOVE 10');
  for (var i = 0; i < 10; i++) {
		var filtered = arr.filter( (val) => val == i );
		Matches[i] = filtered.length;
	}
  return Matches;
}

/////////////// End My Functions ///////////////

/////////////// Begin Main Function ///////////////
function main() {
	// Determine number of test cases
	var t = parseInt(readLine());
	// Parse Input and Create Two Strings
	for(var a0 = 0; a0 < t; a0++){
    var R = parseInt(readLine());
    var Coord = [ [], []];
    for(var ii = 0; ii < R; ii++) {
    	var R_temp = readLine().split(' ');
    	Coord[0].push(parseInt(R_temp[0]));
    	Coord[1].push(parseInt(R_temp[1]));
    }

    ///////////////////
    // Begin My Code //

		console.log('X Coordinate Eval');
	  console.log(Coord[0]);
	  XMatches = NumMatches(Coord[0]);
		console.log(' '); // line break
	  console.log('Y Coordinate Eval');
	  console.log(Coord[1]);
	  YMatches = NumMatches(Coord[1]);

	  // Find maximum collinear points
	  XMax = Math.max.apply(null, XMatches);
	  YMax = Math.max.apply(null, YMatches);
	  if (YMax > XMax) {
	  	var row = [1, Coord[1].indexOf(YMax)];
	  } else {
	  	var row = [0, Coord[0].indexOf(XMax)];
	  }

	  // Find all points matching the search parameter (row[1])
		var finds = [];
		var lastIndex = 0;
		console.log(Coord[row[0]]);
		console.log(Coord[row[0]].slice(lastIndex, Coord[row[0]].length - 1));
		// Broken
		while ( Coord[row[0]].slice(lastIndex, Coord[row[0]].length - 1).indexOf(row[1]) >= 0) {
			CurrIndex = Coord[row[0]].indexOf(row[1]) + LastIndex;
			finds.push(CurrIndex);
			LastIndex = CurrIndex + 1;
		}
		console.log(finds);




		// // Find coordinated value (i.e. given x character location, find y coordinate)
		// var MacthingCoordinate = Coord[row[0]].charAt(finds);
	 //  var MacthingCoordinateMatches = NumMatches(MacthingCoordinate);
	 //  // Decrement matches array
	 //  Coord[row[0]] = Coord[row[0]] - MacthingCoordinateMatches;
	 //  // Remove any negative values
	 //  Coord[row[0]].reduce(function(previousValue, currentValue, currentIndex, array) {
	 //  	if (currentValue < 0) {
	 //  		currentValue = 0;
	 //  	}
		//   return currentValue;
		// });


    // End My Code //
    console.log(' '); // line break
    console.log(' '); // line break
    /////////////////
  }
}
/////////////// End Main Function ///////////////