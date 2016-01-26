/*
  _____                    _____ _       _     _
 |     |___ ___ ___ _ _   |     | |_ ___|_|___| |_ _____ ___ ___
 | | | | -_|  _|  _| | |  |   --|   |  _| |_ -|  _|     | .'|_ -|
 |_|_|_|___|_| |_| |_  |  |_____|_|_|_| |_|___|_| |_|_|_|__,|___|
                   |___|
                                        __
                        _____ _        |  |
                       |  _  | |___ _ _|  |
                       |     | | -_|_'_|__|
                       |__|__|_|___|_,_|__|
*/

// The code:
// Step 0 - Requirements, globals, etc.
// Step 1 - Get Photos
// Step 2 - Clean up the Photos
// Step 3 - Schedule update tasks to fetch new photos and prune old ones
// Step 4 - Create updating slideshow
// Written By Kyle King for Alex Gabitzer's Christmas Gift

//
// Step Zero - Globals
//
// (1 - true, 0 - false)
var is_download = 1,
    is_raspberry_pi = 1

// Store secret information, somewhat secretly
var jsonfile = require('jsonfile'),
    util = require('util'),
    SecretOptions = jsonfile.readFileSync('secret.json')

var fs = require('fs'),
    request = require('request'),
    path = require('path'),
    _ = require('underscore'),
    dbox  = require("dbox"),
    app   = dbox.app({
      'app_key': SecretOptions.D_Key,
      'app_secret': SecretOptions.D_Secret
    }),
    glob = require("glob"),
    exec = require('child_process').exec;

var dropboxdir = 'Apps/Balloon.io/alloo'
var l_img_dir = 'imageeeees/'

var clc = require('cli-color')
var err = clc.red.bold
var war = clc.yellow
var inf = clc.blue
var ign = clc.xterm(8)



// FIXME: Change filenames to remove ' ', '(', etc.
// TODO: Compress images -> Gulp?



//
// Step 1: Download Photos from Dropbox (Uploaded via balloon.io/alloo
//
function FetchDropboxPhotos() {
  // Follow Dropbox authentication process:
  // // Step 1:
  // // Copy request_token into SecretOptions and then visit URL to grant approval
  // app.requesttoken(function(status, request_token){
  //   console.log(request_token)
  //   console.log(request_token.authorize_url)
  // })
  // console.log(SecretOptions.request_token);
  // // Step 2:
  // // Comment out above snippet and load save value
  // app.accesstoken(SecretOptions.request_token, function(status, access_token){
  //   console.log(access_token)
  // })
  // Step 3:
  // Copy Access Token into secret.json

  // console.log(inf('Starting FetchDropboxPhotos'))
  var subfolder = 'dropbox'
  var options = { root: "dropbox" }
  var client = app.client(SecretOptions.Dropbox_Token)

  if (is_download) {
    client.metadata(dropboxdir, options, function(status, reply) {
      var DesiredFiles = [], filepath = [], filename = [], localpath = []
      for (var i = 0; i < reply.contents.length; i++) {
        var filepath = reply.contents[i].path
        DesiredFiles.push( l_img_dir+subfolder+'/'+path.basename(filepath) )
        client.get(filepath, options, function(status, reply, metadata) {
          // // Grab fresh file path because this is async
          // var localpath = l_img_dir+subfolder+'/'+path.basename(metadata.path)
          // if (fs.existsSync(localpath)) {
          //   console.log(ign(' ** ' + localpath + ' already exists'))
          // } else {
          //   var wstream = fs.createWriteStream(localpath)
          //   wstream.write(reply)
          //   console.log(inf(' >> Downloaded: ' + localpath))
          // }
        })
      }
    })
  }
}
