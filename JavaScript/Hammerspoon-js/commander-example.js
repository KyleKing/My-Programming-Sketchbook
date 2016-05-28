// Playing around with Commander.js as Node as a CLI
// Link: https://github.com/tj/commander.js

// // // // Hello World example:
// // // // $ node commander-example.js
// // // // Or try:
// // // // $ node commander-example.js --help

// // // /**
// // //  * Module dependencies.
// // //  */

// // // var program = require('commander');

// // // program
// // //   .version('0.0.1')
// // //   .option('-p, --peppers', 'Add peppers')
// // //   .option('-P, --pineapple', 'Add pineapple')
// // //   .option('-b, --bbq-sauce', 'Add bbq sauce')
// // //   .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
// // //   .parse(process.argv);

// // // console.log('you ordered a pizza with:');
// // // if (program.peppers) console.log('  - peppers');
// // // if (program.pineapple) console.log('  - pineapple');
// // // if (program.bbqSauce) console.log('  - bbq');
// // // console.log('  - %s cheese', program.cheese);

// // // Output Help Example:
// // var program = require('commander');
// // var colors = require('colors');

// // program
// //   .version('0.0.1')
// //   .command('getstream [url]', 'get stream URL')
// //   .parse(process.argv);

// //   if (!process.argv.slice(2).length) {
// //     program.outputHelp(make_red);
// //   }

// // function make_red(txt) {
// //   return colors.red(txt); //display the help text in red on the console
// // }

// // Type Coercion:
// // $ node commander-example.js -v 5 --integer 1 --float 2.765
// var program = require('commander');
// function range(val) {
//   return val.split('..').map(Number);
// }

// function list(val) {
//   return val.split(',');
// }

// function collect(val, memo) {
//   memo.push(val);
//   return memo;
// }

// function increaseVerbosity(v, total) {
//   return total + 1;
// }

// program
//   .version('0.0.1')
//   .usage('[options] <file ...>')
//   .option('-i, --integer <n>', 'An integer argument', parseInt)
//   .option('-f, --float <n>', 'A float argument', parseFloat)
//   .option('-r, --range <a>..<b>', 'A range', range)
//   .option('-l, --list <items>', 'A list', list)
//   .option('-o, --optional [value]', 'An optional value')
//   .option('-c, --collect [value]', 'A repeatable value', collect, [])
//   .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
//   .parse(process.argv);

// console.log(' int: %j', program.integer);
// console.log(' float: %j', program.float);
// console.log(' optional: %j', program.optional);
// program.range = program.range || [];
// console.log(' range: %j..%j', program.range[0], program.range[1]);
// console.log(' list: %j', program.list);
// console.log(' collect: %j', program.collect);
// console.log(' verbosity: %j', program.verbose);
// console.log(' args: %j', program.args);

// RegExp Example:
// $ node commander-example.js -d cOkE

var program = require('commander');
program
  .version('0.0.1')
  .option('-s --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
  .option('-d --drink [drink]', 'Drink', /^(coke|pepsi|izze)$/i)
  .parse(process.argv);

console.log(' size: %j', program.size);
console.log(' drink: %j', program.drink);
