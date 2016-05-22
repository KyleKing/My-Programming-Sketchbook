// Never Finished/Unsuccessful

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
function NumMatches(str) {
	var Matches = [];
	console.log('THIS MUST BE INCREASED ABOVE 10');
  for (var i = 0; i < 10; i++) {
  	var re = new RegExp(i, 'i');
  	var splits = str.split(re);
  	Matches[i] = splits.length - 1;
  }
  return Matches
}

/////////////// End My Functions ///////////////

/////////////// Begin Main Function ///////////////
function main() {
	// Determine number of test cases
	var t = parseInt(readLine());
	// Parse Input and Create Two Strings
	for(var a0 = 0; a0 < t; a0++){
    var R = parseInt(readLine());
    var Coord = ['', ''];
    for(var ii = 0; ii < R; ii++) {
    	var R_temp = readLine().split(' ');
    	Coord[0] = Coord[0] + R_temp[0];
    	Coord[1] = Coord[1] + R_temp[1];
    }

    ///////////////////
    // Begin My Code //

		// console.log('X Coordinate Eval');
	  // console.log(Coord[0]);
	  XMatches = NumMatches(Coord[0]);
		// console.log(' '); // line break
	  // console.log('Y Coordinate Eval');
	  // console.log(Coord[1]);
	  YMatches = NumMatches(Coord[1]);

	  // Find maximum collinear points
	  XMax = Math.max.apply(null, XMatches);
	  YMax = Math.max.apply(null, YMatches);
	  if (YMax > XMax) {
	  	var row = [1, Coord[1].indexOf(YMax)];
	  } else {
	  	var row = [0, Coord[0].indexOf(XMax)];
	  }

	  // Find all points in initial string
	  var query = new RegExp(row[1], 'g');
		var result;
		var finds = [];
	  // var result = query.exec(G);
		while ((result = query.exec(Coord[row[0]])) !== null) {
		  finds.push(result.index);
		}


		// .... Then realized need to do this in arrays of numbers and not strings //


    // End My Code //
    console.log(' '); // line break
    console.log(' '); // line break
    /////////////////
  }
}
/////////////// End Main Function ///////////////