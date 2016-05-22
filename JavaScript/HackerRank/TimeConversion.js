// Submission: https://www.hackerrank.com/challenges/time-conversion/submissions/code/15866663

// Challenge: Convert and print the given time in 24-hour format, where 00 < hh < 23.

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
    var time = readLine();
    var check = (/PM/).test(time);
    var output = time.replace(/\d+/, function (group) {
        var hours = Number(group);
        if (check) {
            hours = (hours === 12) ? hours : hours + 12;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (check === false && hours === 12) {
            hours = '00';
        }
        return hours;
    }).replace(/[PA]M/, '');
    console.log(output);
}
