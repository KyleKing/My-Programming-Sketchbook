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

function main() {
	var t = parseInt(readLine());
	for(var a0 = 0; a0 < t; a0++){
    var R_temp = readLine().split(' ');
    var R = parseInt(R_temp[0]);
    var C = parseInt(R_temp[1]);
    var G = [];
    for(var G_i = 0; G_i < R; G_i++){
       G[G_i] = readLine();
    }
    var r_temp = readLine().split(' ');
    var r = parseInt(r_temp[0]);
    var c = parseInt(r_temp[1]);
    var P = [];
    for(var P_i = 0; P_i < r; P_i++){
       P[P_i] = readLine();
    }
    // console.log('G');
    // console.log(G);
    // console.log('P');
    // console.log(P);

    //////////////////////////////////
    // Begin Parsing and Check Code //
	  // Find all matches to the given RegExp based on the first line of the given search parameter
	  var query = new RegExp(P[0], 'g');
		var result;
		var total;
		var finds = [];
		var Answer = [];
		var Binary = [];
	  // var result = query.exec(G);
		while ((result = query.exec(G)) !== null) {
		  // var msg = 'Found ' + result[0] + '. ';
		  // msg += 'Next match starts at ' + query.lastIndex;
		  // console.log(msg);
		  finds.push(result.index);
		}

		// Locate found matches
	  var GLength = G[0].length + 1; // account for commas
	  var ExtensionIndex = P[0].length;
	  var ArrayIndex = [];
	  var StringIndex = [];

	  // For each match, confirm the match and convert into a 2D coordinate system
		for (var ii = 0; ii < finds.length; ii++) {
			Answer[ii] = [];
		  ArrayIndex[ii] = Math.floor(finds[ii]/GLength);

		  StringIndex[ii] = finds[ii] % GLength;
		  // console.log('[ArrayIndex, StringIndex]  = [' + ArrayIndex[ii] + ',' + StringIndex[ii] + ']');

		  // Check that proper string was found
		  var FoundString = G[ArrayIndex[ii]].substring(StringIndex[ii], StringIndex[ii]+ExtensionIndex);
			// console.log('  > FoundString = ' + FoundString);

			// Check each line of the search query
			for (var jj = 1; jj < r; jj++) {
				if ( jj+ArrayIndex[ii] >= R ) {
					var NextString = '';
				} else {
			  	var NextString = G[ ArrayIndex[ii] + jj].substring(StringIndex[ii], StringIndex[ii]+ExtensionIndex);
			  }
			  var NextQuery = new RegExp(P[0 + jj]);
			  // console.log('  > ' + NextString + ' vs ' + NextQuery);
			  var check = NextQuery.test(NextString);
			  Answer[ii].push( check );
				// Abort loop if false
				if (!check) {
					jj = r;
				}
			}
			// console.log('  Answers = [' + Answer[ii] + ']');

			// Flatten answer array
			Binary[ii] = Answer[ii].indexOf(false);
		}
		// console.log( '  Binary Conversion -> ' + Binary );

		// console.log( Binary.indexOf(-1) > 0 );
	  console.log( ( Binary.indexOf(-1) >= 0 ) ? 'YES' : 'NO');
    // End Parsing and Check Code //
		// console.log(' ');
    ////////////////////////////////
	}
}