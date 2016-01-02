//
//
// The important part (for later)
//
//
// Code Source: http://stackoverflow.com/a/12751657/3219667
var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};





// Example DDP CLient - basically straight from the Github repo
var DDPClient = require("ddp");

var ddpclient = new DDPClient({
  // All properties optional, defaults shown
  host : "localhost",
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
  useSockJs: true
  // Use a full url instead of a set of `host`, `port` and `ssl`
  // do not set `useSockJs` option if `url` is used
  // url: 'wss://example.com/websocket'
});

/*
 * Connect to the Meteor Server
 */
ddpclient.connect(function(error, wasReconnect) {
  // If autoReconnect is true, this callback will be invoked each time
  // a server connection is re-established
  if (error) console.error('DDP connection error!');
  if (wasReconnect) console.log('Reestablishment of a connection.');
  console.log('connected!');

  // setTimeout(function () {
  //   /*
  //    * Call a Meteor Method
  //    */
  //   ddpclient.call(
  //     'deletePosts',             // name of Meteor Method being called
  //     ['foo', 'bar'],            // parameters to send to Meteor Method
  //     function (err, result) {   // callback which returns the method call results
  //       console.log('called function, result: ' + result);
  //     },
  //     function () {              // callback which fires when server has finished
  //       console.log('updated');  // sending any updated documents as a result of
  //       console.log(ddpclient.collections.posts);  // calling this method
  //     }
  //   );
  // }, 3000);

  // /*
  //  * Call a Meteor Method while passing in a random seed.
  //  * Added in DDP pre2, the random seed will be used on the server to generate
  //  * repeatable IDs. This allows the same id to be generated on the client and server
  //  */
  // var Random = require("ddp-random"),
  //     random = Random.createWithSeeds("randomSeed");  // seed an id generator

  // ddpclient.callWithRandomSeed(
  //   'createPost',              // name of Meteor Method being called
  //   [{ _id : random.id(),      // generate the id on the client
  //     body : "asdf" }],
  //   "randomSeed",              // pass the same seed to the server
  //   function (err, result) {   // callback which returns the method call results
  //     console.log('called function, result: ' + result);
  //   },
  //   function () {              // callback which fires when server has finished
  //     console.log('updated');  // sending any updated documents as a result of
  //     console.log(ddpclient.collections.posts);  // calling this method
  //   }
  // );

  /*
   * Subscribe to a Meteor Collection
   */
  ddpclient.subscribe(
    'PicturesData',               // name of Meteor Publish function to subscribe to
    [],                       // any parameters used by the Publish function
    function () {             // callback when the subscription is complete
      console.log('Subscription complete:');
      // console.log(ddpclient.collections.pictures);
    }
  );

  /*
   * Observe a collection.
   */
  var observer = ddpclient.observe("pictures");

  //
  //
  // The important part to download files when MongoDB change
  //
  //
  observer.added = function(id) {
    console.log("[ADDED] to " + observer.name + ":  " + id);
    var Current = ddpclient.collections.pictures[id];
    var filename = 'imgs/' + Current.ID + '.jpg';
    download(Current.URL, filename, function(){
      console.log(' > Saved (URL = ' + Current.URL + ') as ' + filename);
    });
  };

  observer.changed = function(id, oldFields, clearedFields, newFields) {
    console.log("[CHANGED] in " + observer.name + ":  " + id);
    console.log("[CHANGED] old field values: ", oldFields);
    console.log("[CHANGED] cleared fields: ", clearedFields);
    console.log("[CHANGED] new fields: ", newFields);
  };
  observer.removed = function(id, oldValue) {
    console.log("[REMOVED] in " + observer.name + ":  " + id);
    // console.log("[REMOVED] previous value: ", oldValue);

    var Current = oldValue;
    var filename = 'imgs/' + Current.ID + '.jpg';
    console.log(filename);
    fs.unlink(filename, function() {
        console.log(' > Deleted ' + filename);
    });
  };
  // setTimeout(function() { observer.stop() }, 6000);

});

// /*
//  * Useful for debugging and learning the ddp protocol
//  */
// ddpclient.on('message', function (msg) {
//   console.log("ddp message: " + msg);
// });

// /*
//  * Close the ddp connection. This will close the socket, removing it
//  * from the event-loop, allowing your application to terminate gracefully
//  */
// ddpclient.close();


//  * If you need to do something specific on close or errors.
//  * You can also disable autoReconnect and
//  * call ddpclient.connect() when you are ready to re-connect.

// ddpclient.on('socket-close', function(code, message) {
//   console.log("Close: %s %s", code, message);
// });

// ddpclient.on('socket-error', function(error) {
//   console.log("Error: %j", error);
// });

// /*
//  * You can access the EJSON object used by ddp.
//  */
// var oid = new ddpclient.EJSON.ObjectID();
