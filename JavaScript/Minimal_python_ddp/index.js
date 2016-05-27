// /**
//  * See install.sh before running this app
//  * Run with: `browser-refresh`
//  */

// var express = require('express');
// var app     = express();

// app.configure(function() {
//   app.set('port', 8080);
//   app.use(express.logger('dev'));
// 	app.use(app.router);
// });
// require('./modules/config')(app);
// require('./modules/routes')(app);

// // Communicate with the python script:
// require('./modules/python-controller')(app);

// // // Non-reloading version:
// // app.listen(app.get('port'));
// // console.log('Your application is running on http://localhost:8080');

// // Reload code and refresh browser
// // (note need to add process.env.BROWSER_REFRESH_URL to script tag in html)
// app.listen(app.get('port'), function() {
// 	console.log('Listening on port %d', app.get('port'));
// 	if (process.send) {
// 		process.send('online');
// 	}
// });

/**
 * Sub-Process: Spawn a Meteor App
 */

// // Node Child Processes
// // Demo of starting and stopping such programs

// // Exec version
// // https://docs.nodejitsu.com/articles/child-processes/how-to-spawn-a-child-process/
// var childProcess = require('child_process');

// var ls = childProcess.exec('ls -l', function (error, stdout, stderr) {
//   if (error) {
//     console.log(error.stack);
//     console.log('Error code: '+error.code);
//     console.log('Signal received: '+error.signal);
//   }
//   console.log('Child Process STDOUT: '+stdout);
//   console.log('Child Process STDERR: '+stderr);
// });

// ls.on('exit', function (code) {
//   console.log('Child process exited with exit code '+code);
// });

// // Child version
// http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn

var exec = require('child_process').exec;
var child = exec('bash process.bash');
var kill = require('tree-kill');
var bashProcess = child.pid;

child.stdout.on('data', function(data) {
  console.log('stdout: ' + data.trim());
  if ( data.match('App running at: http://localhost:3000/')) {
  	console.log('RUNNING! & Ready to Begin DDP Connection');
		setTimeout(function() {
		  kill(bashProcess, 'SIGTERM', function(err) {
		    if (err) console.log('SIGTERM err: ' + err);
		  });
		}, 1000);
  }
});
child.stderr.on('data', function(data) {
  console.log('stdout: ' + data.trim());
});
child.on('close', function(code) {
  console.log('closing code: ' + code);
});

// // Delay and killing sub-process
// setTimeout(function() {
//   kill(bashProcess, 'SIGTERM', function(err) {
//     if (err) console.log('SIGTERM err: ' + err);
//   });
// }, 3000);





/**
 * DDP Model:
 */

// var DDPClient = require("ddp");

// var ddpclient = new DDPClient({
//   // All properties optional, defaults shown
//   host : "localhost",
//   port : 3000,
//   ssl  : false,
//   autoReconnect : true,
//   autoReconnectTimer : 500,
//   maintainCollections : true,
//   ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
//   // uses the SockJs protocol to create the connection
//   // this still uses websockets, but allows to get the benefits
//   // from projects like meteorhacks:cluster
//   // (for load balancing and service discovery)
//   // do not use `path` option when you are using useSockJs
//   useSockJs: true,
//   // Use a full url instead of a set of `host`, `port` and `ssl`
//   // do not set `useSockJs` option if `url` is used
//   url: 'wss://example.com/websocket'
// });

// /*
//  * Connect to the Meteor Server
//  */
// ddpclient.connect(function(error, wasReconnect) {
//   // If autoReconnect is true, this callback will be invoked each time
//   // a server connection is re-established
//   if (error) {
//     throw error
//     // console.log('DDP connection error!');
//     // return;
//   }
//   if (wasReconnect) {
//     console.log('Reestablishment of a connection.');
//   }
//   console.log('connected!');

//   setTimeout(function () {
//     /*
//      * Call a Meteor Method
//      */
//     ddpclient.call(
//       'reset',             // name of Meteor Method being called
//       [],            // parameters to send to Meteor Method
//       function (err, result) {   // callback which returns the method call results
//       	if (err) {
//       		throw err
//       	}
//         // console.log('Called reset function, result: ' + result);
//       },
//       function () {              // callback which fires when server has finished
//         console.log('Server Finished');  // sending any updated documents as a result of
//         console.log(ddpclient.collections.photos);  // calling this method
//       }
//     );
//   }, 3000);

//   /*
//    * Call a Meteor Method while passing in a random seed.
//    * Added in DDP pre2, the random seed will be used on the server to generate
//    * repeatable IDs. This allows the same id to be generated on the client and server
//    */
//   // var Random = require("ddp-random"),
//   //     random = Random.createWithSeeds("randomSeed");  // seed an id generator

//   // ddpclient.callWithRandomSeed(
//   //   'createPost',              // name of Meteor Method being called
//   //   [{ _id : random.id(),      // generate the id on the client
//   //     body : "asdf" }],
//   //   "randomSeed",              // pass the same seed to the server
//   //   function (err, result) {   // callback which returns the method call results
//   //     console.log('called function, result: ' + result);
//   //   },
//   //   function () {              // callback which fires when server has finished
//   //     console.log('updated');  // sending any updated documents as a result of
//   //     console.log(ddpclient.collections.photos);  // calling this method
//   //   }
//   // );

//   /*
//    * Subscribe to a Meteor Collection
//    */
//   ddpclient.subscribe(
//     'photos',                  // name of Meteor Publish function to subscribe to
//     [],                       // any parameters used by the Publish function
//     function () {             // callback when the subscription is complete
//       console.log('photos subscription complete:');
//       console.log(ddpclient.collections.photos);
//     }
//   );

//   /*
//    * Observe a collection.
//    */
//   var observer = ddpclient.observe("photos");
//   observer.added = function(id) {
//     console.log("[ADDED] to " + observer.name + ":  " + id);
//   };
//   observer.changed = function(id, oldFields, clearedFields, newFields) {
//     console.log("[CHANGED] in " + observer.name + ":  " + id);
//     console.log("[CHANGED] old field values: ", oldFields);
//     console.log("[CHANGED] cleared fields: ", clearedFields);
//     console.log("[CHANGED] new fields: ", newFields);
//   };
//   observer.removed = function(id, oldValue) {
//     console.log("[REMOVED] in " + observer.name + ":  " + id);
//     console.log("[REMOVED] previous value: ", oldValue);
//   };
//   // setTimeout(function() { observer.stop(); console.log('STOPPED OBSERVING') }, 6000);
// });

// /*
//  * Useful for debugging and learning the ddp protocol
//  */
// // ddpclient.on('message', function (msg) {
// //   console.log("ddp message: " + msg);
// // });

// /*
//  * Close the ddp connection. This will close the socket, removing it
//  * from the event-loop, allowing your application to terminate gracefully
//  */
// // ddpclient.close();

// /*
//  * If you need to do something specific on close or errors.
//  * You can also disable autoReconnect and
//  * call ddpclient.connect() when you are ready to re-connect.
// */
// // ddpclient.on('socket-close', function(code, message) {
// //   console.log("Close: %s %s", code, message);
// // });

// // ddpclient.on('socket-error', function(error) {
// //   console.log("Error: %j", error);
// // });

// /*
//  * You can access the EJSON object used by ddp.
//  */
// // var oid = new ddpclient.EJSON.ObjectID();