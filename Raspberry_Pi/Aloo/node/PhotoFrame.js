// The code:
// Step 0 - Requirements, globals, etc.
// Step 1 - Get Photos
// Step 2 - Clean up the Photos
// Step 3 - Schedule update tasks to fetch new photos and prune old ones
// Step 4 - Create updating slideshow
// Step Nada - All the things that I didn't have time for
// Written By Kyle King for Alex Gabitzer's Christmas Gift

//
// Step Zero
//
// Globals
var download = 1,
		raspberry_pi = 1

// Store secret information, somewhat secretly
var jsonfile = require('jsonfile'),
		util = require('util'),
		SecretOptions = jsonfile.readFileSync('secret.json')

var fs = require('fs'),
		request = require('request'),
		path = require('path'),
		_ = require('underscore'),
		Flickr = require("flickrapi"),
		dbox  = require("dbox"),
		app   = dbox.app({ "app_key": SecretOptions.D_Key, "app_secret": SecretOptions.D_Secret }),
		glob = require("glob"),
		exec = require('child_process').exec;

//
//
// Part 1: Find Photos with URL link
//
//
// First from Flickr from a specific Gallery
function FetchFlickrPhotos() {
	var CollectionPhotos = []
	// - type jpg/png
	// - url
	// - source 'instagram'
	// - id 'essentially a filename'

	Flickr.tokenOnly(SecretOptions, function(error, flickr) {
		flickr.galleries.getPhotos({
			api_key: SecretOptions.api_key,
			gallery_id: SecretOptions.gallery_id,
			extras: 'original_format, url_o',
			page: 1,
			per_page: 100
		}, function(err, result) {
			if (err) console.log(err)
			if (result.photos) {
				CollectionPhotos = result.photos.photo
				// Indicate Image Source and unify object scheme
				CollectionPhotos = _.map(CollectionPhotos, function(photo) {
					photo.source = 'flickr'
					// photo._id = photo.id
					photo.url = photo.url_o
					// photo.type = (photo.originalformat) ? photo.originalformat : 'jpg'
					photo.type = photo.originalformat
					return photo
				})
				// For debugging:
				// console.log(CollectionPhotos[0])
				// Download the photos
				CompleteDownload(CollectionPhotos)
			}
		})
	})
}

// Second, find photo URL's from Instagram
function IterateOverInstagramURLs(ii, URLs, callback) {
	var CollectionPhotos = []
	var url = SecretOptions.InstagramAPI.URLs[ii];

	request(url, function (err, res, body) {
		if (err) console.log(err)
	  // if (!err && res.statusCode == 200) {
			// console.log('content-type:', res.headers['content-type'])
			// console.log('content-length:', res.headers['content-length'])
		var Info = JSON.parse(body)
		var ImgCount = Info.data.length
		while (ImgCount !== 0) {
	// console.log('-----THIS SHOULD WORK?-----');
	// console.log(ii);
	// console.log(SecretOptions.InstagramAPI.sources[ii]);
			var tmp = {
		  	url: Info.data[ImgCount - 1].images.standard_resolution.url,
		  	id: Info.data[ImgCount - 1].caption.id,
		  	type: 'jpg',
		  	source: 'instagram_' + SecretOptions.InstagramAPI.sources[ii]
		  }
		  // console.log(tmp);
		  CollectionPhotos.push(tmp)
		  ImgCount--
		}
		callback(CollectionPhotos)
	})
}

function FetchInstagramPhotos () {
	// Will have at least two URL's for me and Colleen, plus anyone else that joins
	for (var jj = 0; jj < SecretOptions.InstagramAPI.URLs.length; jj++) {
		IterateOverInstagramURLs(jj, SecretOptions.InstagramAPI.URLs, function(CollectionPhotos) {
			// Move on to downloading
			CompleteDownload(CollectionPhotos)
		})
	}
}

//
// Step 1.2: From list of image URL's, download
//
function CompleteDownload(CollectionPhotos) {
	var DesiredFiles = []
	// 'Just the local path to a file to compare against existing files'

	glob("imgs/" + CollectionPhotos[0].source + "/*.*", function (er, files) {
		// files is an array of filenames.
		// If the `nonull` option is set, and nothing
		// was found, then files is ["**/*.js"]
		// er is an error object or null.
		if (er) console.log(er);
		var ExistingFiles = files;
		// console.log(files);
		Download(ExistingFiles)
	})
	function Download(ExistingFiles) {
		for (var i = 0; i < CollectionPhotos.length; i++) {
			var filename = 'imgs/' + CollectionPhotos[i].source + '/' + CollectionPhotos[i].id + '.' + CollectionPhotos[i].type
			var url = CollectionPhotos[i].url
			if (download === 0) {
				console.log('Downloads turned off');
			} else if (url === undefined || filename === undefined || CollectionPhotos[i].type === undefined) {
				console.log('---------failed-----------')
				console.log(CollectionPhotos[i])
			} else {
				// Store properly formatted files
				DesiredFiles.push(filename)
				DownloadFromURL(url, filename, function () {
					// console.log('done')
				})
			}
		}
		// Carry on
		if (download) {
			var source = CollectionPhotos[0].source
			DeleteExcessFiles(DesiredFiles, source)
			jsonfile.writeFile('imgs/'+source+'.json', DesiredFiles, function (err) {
			  if (err) console.error(err)
			})
		}
	}
	function DownloadFromURL(uri, filename, callback) {
		if (fs.existsSync(filename)) {
			console.log(' ** ' + filename + ' already exists')
		} else {
			request.head(uri, function(err, res, body){
				// console.log('content-type:', res.headers['content-type'])
				// console.log('content-length:', res.headers['content-length'])

				request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
				console.log(' >> Downloaded: ' + filename)
			})
		}
	}
}

//
//
// Step 1.2: Download Photos from Dropbox (Uploaded via balloon.io/alloo
//
//
function FetchDropboxPhotos() {
	// Follow arduous Dropbox authentication process:
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
	// var dropboxdir = 'Public/AlooPhotos'
	var dropboxdir = 'Apps/Balloon.io/alloo'
	client.metadata(dropboxdir, options, function(status, reply) {
		var DesiredFiles = [], filepath = [], filename = [], localpath = []
		for (var i = 0; i < reply.contents.length; i++) {
			var filepath = reply.contents[i].path
			DesiredFiles.push( 'imgs/dropbox/' + path.basename(filepath) )
			client.get(filepath, options, function(status, reply, metadata) {
				// Grab fresh file path because this is async
				var localpath = 'imgs/dropbox/' + path.basename(metadata.path)
				// console.log(localpath);
				if (fs.existsSync(localpath)) {
					console.log(' ** ' + localpath + ' already exists')
				} else {
					var wstream = fs.createWriteStream(localpath)
					wstream.write(reply)
					wstream.end(function () {
						// console.log(' >> Downloaded a file from Dropbox')
					})
					console.log(' >> Downloaded: ' + localpath)
				}
				// Yeah...don't do this for a binary file...
			  // console.log(reply.toString(), metadata)
			})
		}
		var source = 'dropbox'
		DeleteExcessFiles(DesiredFiles, source)
		jsonfile.writeFile('imgs/'+source+'.json', DesiredFiles, function (err) {
		  if (err) console.error(err)
		})
	})
}


//
//
// Part 2: Clean up directories
//
//
function DeleteExcessFiles(DesiredFiles, subfolder) {
	glob("imgs/" + subfolder + "/*.*", function (er, files) {
		// files is an array of filenames.
		// If the `nonull` option is set, and nothing
		// was found, then files is ["**/*.js"]
		// er is an error object or null.
		if (er) console.log(er);
		var ExistingFiles = files;

		// For debugging:
		// console.log('DesiredFiles')
		// console.log(DesiredFiles)
		// console.log('ExistingFiles')
		// console.log(ExistingFiles)

		if ( (ExistingFiles.length - DesiredFiles.length) === 0) {
			console.log(' ~~ All files accounted for in the ' + subfolder + ' folder')
		} else {
			console.log('=== Attempting to delete unwanted files');
			// console.log(DesiredFiles);
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
	})
}


//
//
// Step 3: Schedule update tasks to update locally stored images
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
  FetchFlickrPhotos()
	FetchInstagramPhotos()
  FetchDropboxPhotos()
  }, function () {
    /* This function is executed when the job stops */
    console.log('Finished')
  },
  false /* Start the job right now */
)

// Run everything
FetchFlickrPhotos()
FetchInstagramPhotos()
FetchDropboxPhotos()
Fetch.start()


//
//
// Step 4: Create slide show by scheduling updated images
//
//
// Run only on raspberry pi
if (raspberry_pi) {
	function MakePictures(source) {
		// console.log(source) - could be useful, but can't run in the below callback
		glob("imgs/" + "*.json", function (er, files) {
			if (er) console.log(er)
			var source = files[ Math.round((files.length-1)*Math.random()) ]
			// console.log(source)
			var DesiredFiles = jsonfile.readFileSync(source)
			// console.log(DesiredFiles);
			var filepath = DesiredFiles[Math.round( (DesiredFiles.length-1)*Math.random() )]
			// sudo fbi -a -noverbose -T 10 /home/pi/Raspberry\ Pi/Aloo/imgs/6.png
			var command = 'sudo fbi -a -noverbose -T 10 /home/pi/Raspberry_Pi/Aloo/node/' + filepath
			console.log(command)
			var child = exec(command, function (error, stdout, stderr) {
				if (error) console.log(error)
				console.log('stdout: ' + stdout)
				console.log('stderr: ' + stderr)
			})
		})
	}

	// Refresh image every minute
	var SlideShow = new CronJob('00 * * * * *', function() {
			// if (raspberry_pi) MakePictures('imgs/'+subfolder+'.json')
			MakePictures(null)
		}, function () {
	    /* This function is executed when the job stops */
	    console.log('Finished')
	  },
	  true /* Start the job right now */
	)
}


//
//
// Step Nada [Not implemented Things]
//
//
// USB
// If Dropbox is a bust, consider triggering an event to read a USB drive
// Two possible NPM packages:
// 	https://www.npmjs.com/package/usb-detection
// 	https://github.com/nonolith/node-usb
// Then display a pre-made photo that says, drive can be ejected now. Then when drive is ejected, revert to the usual slideshow
//
// Power-Saving
// Notes are in a separate file (init.js), if real-world sensor, can turn display on/off
// Additionally, the power button could be hardwired to the pi and controlled via GPIO
//
// Wifi
// Still a work in progress (see: wifi/steps.md)
//
// //
// // For ending the program
// //
// function End(status) {
//  // Stop code after completeDownload
//  if (status) process.exit()
// }
//
//
// // Notes for ending the fbi process and returning to GUI
// // // Source: http://stackoverflow.com/a/3510850/3219667
// // // kill $(ps aux | grep 'fbi' | awk '{print $2}')
// // // ps -ef | grep fbi

// // // Then Kill image viewer
// // setTimeout(function() {
// // 	var command = 'sudo pkill fbi'
// // 	console.log(command)
// // 	var KillProcess = exec(command, function (error, stdout, stderr) {
// // 		if (error) console.log(error)
// // 		console.log('stdout: ' + stdout)
// // 		console.log('stderr: ' + stderr)
// // 	})
// // }, 5000)
//
//
