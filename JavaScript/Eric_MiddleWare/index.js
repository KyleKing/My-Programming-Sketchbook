/************************************************
 * Init
 ************************************************/

/** Meteor Instance */
var exec = require('child_process').exec;
var meoteorChild = exec('bash bootMeteor.sh');

/** Register cleanup event on node app SIGINT */
var bootMeteor = meoteorChild.pid;
var kill = require('tree-kill');

// Original Code: http://stackoverflow.com/a/14032965
process.stdin.resume(); //so the program will not close instantly
function exitHandler(options, err) {
    if (options.cleanup) {
      console.log('\nStopping Meteor App\n');
      kill(bootMeteor, 'SIGTERM', function(err) {
        if (err) {
          console.log('SIGTERM err: ' + err);
        }
      });
    }
    if (err) {
      console.log(err.stack);
    }
    if (options.exit) {
      process.exit();
    }
}
//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

/** DDP Connection */
var DDPClient = require('ddp');
var ddpclient = new DDPClient({
  host : 'localhost',
  port : 3000,
  ssl  : false,
  autoReconnect : true,
  autoReconnectTimer : 500,
  maintainCollections : true,
  ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
  // uses the SockJs protocol to create the connection
  // this still uses websockets, but allows to get the benefits
  // from projects like meteorhacks:cluster
  // (for load balancing and service discovery)
  // do not use `path` option when you are using useSockJs
  useSockJs: true,
  // Use a full url instead of a set of `host`, `port` and `ssl`
  // do not set `useSockJs` option if `url` is used
  url: 'wss://example.com/websocket'
});


/************************************************
 * Create Meteor Instance and on creation, callback to start a DDP connection
 ************************************************/

// Child process of Meteor App
// http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
meoteorChild.stdout.on('data', function(data) {
  console.log('stdout: ' + data.trim());
  var error = false;
  if (data.match('App running at: http://localhost:3000/')) {
    console.log('RUNNING & Launching DDP Connection');
    launchDDP();
  // Catch errors if possible:
  } else if (data.match('Error')) {
    console.log('Error: ' + data);
  } else if (error) {
    console.log(data);
  }
});
meoteorChild.stderr.on('data', function(data) {
  console.log('stdout: ' + data.trim());
});
meoteorChild.on('close', function(code) {
  console.log('closing code: ' + code);
});


/************************************************
 * Launch DDP connection to connect to newly initiated Meteor App
 ************************************************/

function launchDDP() {
  ddpclient.connect(function(error, wasReconnect) {
    if (error) {
      throw error;
    }
    if (wasReconnect) {
      console.log('Reestablishment of a connection.');
    }
    console.log('connected!');

    /** DO STUFF! */
    callMethod('reset');
    observeCollection('photos');
  });
}

/*
 * Call a Meteor Method
 */
function callMethod (methodName) {
  setTimeout(function () {
    ddpclient.call(
      methodName, // name of Meteor Method being called
      [], // parameters to send to Meteor Method
      function (err, result) {
        if (err) {
          throw err;
        }
        console.log('Called ' + methodName + ' function, result: ' + result);
      },
      function () { // callback when the method is complete
        console.log('Server Finished');
        console.log(ddpclient.collections.photos);
      }
    );
  }, 3000);
}

/*
* Subscribe to a Meteor Collection
*/
function observeCollection(collection) {
  ddpclient.subscribe(
    collection, // name of Meteor Publish function to subscribe to
    [], // any parameters used by the Publish function
    function () { // callback when the subscription is complete
      console.log(collection + ' subscription complete:');
      console.log(ddpclient.collections[collection]);
    }
  );
  /** Observe the subscribed collection. */
  var observer = ddpclient.observe(collection);
  observer.added = function(id) {
    console.log('\n');
    console.log('[ADDED] to ' + observer.name + ':  ' + id);
  };
  observer.changed = function(id, oldFields, clearedFields, newFields) {
    console.log('\n');
    console.log('[CHANGED] in ' + observer.name + ':  ' + id);
    console.log('[CHANGED] old field values: ', oldFields);
    console.log('[CHANGED] cleared fields: ', clearedFields);
    console.log('[CHANGED] new fields: ', newFields);
  };
  observer.removed = function(id, oldValue) {
    console.log('\n');
    console.log('[REMOVED] in ' + observer.name + ':  ' + id);
    console.log('[REMOVED] previous value: ', oldValue);
  };
  // setTimeout(function() {
  //   observer.stop(); console.log('STOPPED OBSERVING')
  // }, 6000);
}
