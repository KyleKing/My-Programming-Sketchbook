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
var flickrOptions = jsonfile.readFileSync('secret.json')

var _ = require('Underscore')

var Flickr = require("flickrapi")

function FetchPhotos() {
	Flickr.tokenOnly(flickrOptions, function(error, flickr) {
		//
		//
		// Helpful for finding Gallery ID
		//
		//
		// flickr.galleries.getList({
		//    api_key: flickrOptions.api_key,
		//    user_id: flickrOptions.user_id
		// }, function(err, result) {
		//  console.log('---------**------')
		//  if (err) console.log(err)
		//   console.log(result.galleries.gallery.id)
		// })

		//
		//
		// Get Photos from Gallery
		//
		//
		flickr.galleries.getPhotos({
			api_key: flickrOptions.api_key,
			gallery_id: flickrOptions.gallery_id,
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


		//
		//
		// Finds all photos with the text: 'Kangaroo'
		//
		//
		//  // we can now use "flickr" as our API object,
		//  // but we can only call public methods and access public data
		//  // console.log(flickr)
		//  flickr.photos.search({
		//    api_key: flickrOptions.api_key,
		//   text: 'kangaroo',
		//   extras: 'original_format, url_o',
		//   page: 1,
		//   per_page: 10
		// }, function(err, result) {
		//  console.log('---------------')
		//  if (err) console.log(err)
		//   // result is Flickr's response
		//   // console.log(result)
		//   if (result.photos) console.log(result.photos.photo[0])
		// })


		//
		//
		// All recently posted photos to Flickr, not very helpful to say the least
		//
		//
		//  // Searching recent photos
		// flickr.photos.getRecent({
		//   api_key: flickrOptions.api_key,
		//   user_id: flickrOptions.user_id,
		//   text: 'orca',
		//   extras: 'original_format, url_o',
		//   // extras: 'license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o',
		//   page: 1,
		//   per_page: 10
		// }, function(err, result) {
		//  if (err) console.log(err)
		//   /*
		//     This will now give all public and private results,
		//     because we explicitly ran this as an authenticated call
		//   */
		//   // Original URL (Full Size)
		//   console.log(result.photos.photo[0])
		//   console.log(result.photos.photo[0].url_o)
		// })
	})
}


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
// Part 3: Download Photos
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
var spawn = require('child_process').spawn;

// Refresh image every minute
var SlideShow = new CronJob('00 * * * * *', function() {
	// console.log(DesiredFiles);
	var RandIndex = Math.round( DesiredFiles.length*Math.random() )
	var filepath = DesiredFiles[RandIndex]
	// sudo fbi -a -noverbose -T 10 /home/pi/Raspberry\ Pi/Aloo/imgs/6.png
	var command = 'sudo fbi -a -noverbose -T 10 /home/pi/Raspberry\ Pi/Aloo/' + filepath
	// console.log(command)
  // var RunShellCommand = spawn('sh', [ command ]);
  }, function () {
    /* This function is executed when the job stops */
    console.log('Finished')
  },
  true /* Start the job right now */
)
