// Submission: https://www.hackerrank.com/challenges/plus-minus/submissions/code/15793435

// Challenge: Given an array of integers, calculate which fraction of its elements are
//      positive, which fraction of its elements are negative, and which fraction of
//      its elements are zeroes, respectively. Print the decimal value of each
//      fraction on a new line.

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
    arr = readLine().split(' ');
    arr = arr.map(Number);
    var net = [0, 0, 0];
    for (ii = 0; ii < n; ii++){
        var sol = Math.sign(arr[ii]);
        if (sol === 1) {
            net[0]++;
        } else if (sol === -1){
            net[1]++;
        } else {
            net[2]++;
        }
    }

    console.log( net[0]/n );
    console.log( net[1]/n );
    console.log( net[2]/n );
}
