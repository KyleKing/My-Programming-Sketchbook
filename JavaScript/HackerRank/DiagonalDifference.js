// Submission: https://www.hackerrank.com/challenges/diagonal-difference/submissions/code/15791958

// Challenge: Given a square matrix of size NxN, calculate the absolute difference between
// 		the sums of its diagonals.

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
    var n = parseInt(readLine());
    var a = [];
    for(a_i = 0; a_i < n; a_i++){
       a[a_i] = readLine().split(' ');
       a[a_i] = a[a_i].map(Number);
    }
    var diag = [ [0], [0] ];
    for(ii = 0; ii < n; ii++){
        diag[0][ii] = a[ii][ii]; // primary diagonal
        diag[1][ii] = a[ii][n-1-ii]; // secondary diagonal
    }
    var sol = diag[0].reduce( (p, c) => p + c ) - diag[1].reduce( (p, c) => p + c );
    console.log( Math.abs(sol) ); // take magnitude
}


