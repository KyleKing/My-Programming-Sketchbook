// Following this guide: http://shapeshed.com/command-line-utilities-with-nodejs/
// Building a portable JS applet for use with Hammerspoon

// $ cd /Users/kyleking/Developer/My-Programming-Sketchbook/JavaScript/Hammerspoon/

// // $ node test.js
// console.log('Hello World');

// Passing Arguments:
// $ node test.js -arg1 -arg2
var args = process.argv.slice(2);
if (args.length != 0) console.log(args);

// // Check for error and process an appropriate error code:
// var err = false;
// if (err) {
//   process.exit(1);
// } else {
//   process.exit(0);
// }

// Receiving Stdin
// $ echo 'foo' | node test.js
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  // process.stdout.write(data);
  console.log(data);
});

// And now this works for how I want to use it! The long string is from Applescript and can now be piped into this JS function
// echo '{"wrapper":[{"arg":"string","func_name":"AlertUser","icon":"imgs/alert.png","description":"Custom Notification"},{"func_name":"manualReload","icon":"imgs/reload.png","description":"Reloads Hammerspoon"},{"func_name":"hideFiles","icon":"imgs/hide.png","description":"Hides dot files"},{"func_name":"showFiles","icon":"imgs/show.png","description":"Shows dot files"},{"arg":"string","func_name":"blueutil","icon":"imgs/bluetooth.png","description":"Toggle Bluetooth on/off"},{"arg":"string","func_name":"ToggleInternetSharing","icon":"imgs/internet.png","description":"Toggle Internet Sharing, need off or on"},{"arg":"string","func_name":"ToggleDND","icon":"imgs/order.png","description":"Toggle Do No Disturb, need off or on"},{"arg":"string","func_name":"wintile","icon":"imgs/tile.png","description":"Manually Tile Windows (12 units)"},{"func_name":"Load_Order","icon":"imgs/order.png","description":"Reset List of Applications"}]}' | node test.js