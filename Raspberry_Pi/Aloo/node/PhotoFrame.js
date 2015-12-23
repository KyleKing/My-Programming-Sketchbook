// Global Variables to prevent overuse of API's:
var download = 1;

// Other globals
var CollectionPhotos = []
var DesiredFiles = []
var ExistingFiles = []

//
//
// Part 1: Find Photos
//
//
// Store secret information, somewhat secretly
var jsonfile = require('jsonfile')
var util = require('util')
var SecretOptions = jsonfile.readFileSync('secret.json')

var _ = require('underscore')

var Flickr = require("flickrapi")
function FetchPhotos() {
	Flickr.tokenOnly(SecretOptions, function(error, flickr) {

		//
		//
		// Get Photos from Gallery
		//
		//
		flickr.galleries.getPhotos({
			api_key: SecretOptions.api_key,
			gallery_id: SecretOptions.gallery_id,
			extras: 'original_format, url_o',
			page: 1,
			per_page: 100
		}, function(err, result) {
			console.log('---------**------')
			if (err) console.log(err)
			if (result.photos) {
				CollectionPhotos = result.photos.photo
				// Indicate Image Source and unify object scheme
				CollectionPhotos = _.map(CollectionPhotos, function(photo) {
					photo.source = 'flickr'
					photo._id = photo.id
					photo.url = photo.url_o
					// photo.type = (photo.originalformat) ? photo.originalformat : 'jpg'
					photo.type = photo.originalformat
					return photo
				})
				// // console.log(CollectionPhotos[0])
				// console.log('url_o = ' + CollectionPhotos[0].url_o)
				// console.log('id = ' + CollectionPhotos[0].id)
				// console.log('originalformat = ' + CollectionPhotos[0].originalformat)
				CompleteDownload(true)
			}
		})
	})
}

//
//
// Step 1.1: Fetch Static Images from Dropbox
//
// var node_dropbox = require('node-dropbox')
var fs = require('fs'),
		request = require('request'),
		path = require('path')

// Follow arduous authentication process:
var dbox  = require("dbox")
var app   = dbox.app({ "app_key": SecretOptions.D_Key, "app_secret": SecretOptions.D_Secret })
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
var client = app.client(SecretOptions.Dropbox_Token)

// HELLO WORLD!
// client.account(function(status, reply){
//   console.log(reply)
// })

// Find Files
var options = {
  root: "dropbox" // optional - defaults to "Sandbox" - i.e. "app folder"
}
var dropboxdir = 'Public/AlooPhotos'
client.metadata(dropboxdir, options, function(status, reply){
	// console.log(reply.contents[0])
  var filepath = reply.contents[0].path
  console.log(filepath)
	client.get(filepath, options, function(status, reply, metadata){
  	var filename = path.basename(filepath)
		var localpath = 'imgs/dropbox_' + filename
		var wstream = fs.createWriteStream(localpath)
		wstream.write(reply)
		wstream.end(function () { console.log('done') })

		// Yeah...don't do thie for a binary file...
	  // console.log(reply.toString(), metadata)
	})
})

//
//
// Step 2: Check filenames to delete old files
//
//
var glob = require("glob")

// options is optional
glob("imgs/*.*", function (er, files) {
	// files is an array of filenames.
	// If the `nonull` option is set, and nothing
	// was found, then files is ["**/*.js"]
	// er is an error object or null.
	if (er) console.log(er);
	ExistingFiles = files;
	// console.log(files);
})

//
//
// Part 3: Download [Flickr] Photos
//
//

// Code Source: http://stackoverflow.com/a/12751657/3219667
var fs = require('fs'),
		request = require('request')

function DownloadURL(uri, filename, callback) {
	if (fs.existsSync(filename)) {
		console.log(filename + ' already exists')
	} else {
		request.head(uri, function(err, res, body){
			// console.log('content-type:', res.headers['content-type'])
			// console.log('content-length:', res.headers['content-length'])

			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
		})
		console.log('Download: ' + filename)
	}
}

function DeleteExcessFiles() {
	if ( (ExistingFiles.length - DesiredFiles.length) === 0) {
		console.log('Nothing to report')
	} else {
		for (var i = 0; i < ExistingFiles.length; i++) {
			var filename = ExistingFiles[i]
			if (DesiredFiles.indexOf(filename) === -1) {
				// Delete File
				fs.unlink(filename, function(err) {
						if (err) throw err
				});
			}
		}
	}
}

function CompleteDownload(status) {
	for (var i = 0; i < CollectionPhotos.length; i++) {
		var filename = 'imgs/' + CollectionPhotos[i].source + '_' + CollectionPhotos[i]._id + '.' + CollectionPhotos[i].type
		var url = CollectionPhotos[i].url
		if (download === 0) {
			console.log('Downloads turned off');
		} else if (url === undefined || filename === undefined || CollectionPhotos[i].type === undefined) {
			console.log('---------failed-----------')
			console.log(CollectionPhotos[i])
		} else {
			// Store properly formatted files
			DesiredFiles.push(filename)
			DownloadURL( url, filename, function(err) {
					if (err) throw err
			})
		}
		// // End the program
		// End(true)
	}
	DeleteExcessFiles()
	MakePictures()
}


// //
// //
// // For ending the program
// //
// //
// function End(status) {
//  // Stop code after completeDownload
//  if (status) process.exit()
// }


//
//
// Step 4: Schedule this task to run once a day
//
//
var CronJob = require('cron').CronJob
// var job = new CronJob('00 30 11 * * 1-5', function() {
	/*
	 * Runs every weekday (Monday through Friday)
	 * at 11:30:00 AM. It does not run on Saturday
	 * or Sunday.
	 */

// Quick CRON guide
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12 (or names, see below)
// day of week    0-7

var Fetch = new CronJob('00 00 9 * * *', function() {
  FetchPhotos()
  }, function () {
    /* This function is executed when the job stops */
    console.log('Finished')
  },
  false /* Start the job right now */
)


FetchPhotos()
Fetch.start()


//
// Step 4.2: Create slide show
//
// Allow for Scripting
var exec = require('child_process').exec;

function MakePictures() {
	// console.log(DesiredFiles[0]);
	var RandIndex = Math.round( DesiredFiles.length*Math.random() )
	var filepath = DesiredFiles[RandIndex]
	// sudo fbi -a -noverbose -T 10 /home/pi/Raspberry\ Pi/Aloo/imgs/6.png
	var command = 'sudo fbi -a -noverbose -T 10 /home/pi/Raspberry_Pi/Aloo/node/' + filepath
	// console.log(command)
	var child = exec(command, function (error, stdout, stderr) {
		if (error) console.log(error)
		console.log('stdout: ' + stdout)
		console.log('stderr: ' + stderr)
	})
}

// Refresh image every minute
var SlideShow = new CronJob('00 * * * * *', function() {
		MakePictures()
	}, function () {
    /* This function is executed when the job stops */
    console.log('Finished')
  },
  true /* Start the job right now */
)


// // Source: http://stackoverflow.com/a/3510850/3219667
// // kill $(ps aux | grep 'fbi' | awk '{print $2}')
// // ps -ef | grep fbi

// // Then Kill image viewer
// setTimeout(function() {
// 	var command = 'sudo pkill fbi'
// 	console.log(command)
// 	var KillProcess = exec(command, function (error, stdout, stderr) {
// 		if (error) console.log(error)
// 		console.log('stdout: ' + stdout)
// 		console.log('stderr: ' + stderr)
// 	})
// }, 5000)