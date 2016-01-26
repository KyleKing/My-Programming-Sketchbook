// in order:
// TODO setup wifi
// TODO: Compress images -> Gulp?
// TODO: Automate Dropbox sign up and switch to Alex's account and new folder
// TODO: create readme to allow anyone to use this script



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
var l_img_dir = 'imgs/'

var clc = require('cli-color')
var err = clc.red.bold
var realerr = err.underline
var war = clc.yellow
var inf = clc.blue
var ign = clc.xterm(8)

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
					// Grab fresh file path because this is async
					var localpath = l_img_dir+subfolder+'/'+path.basename(metadata.path)
					if (fs.existsSync(localpath)) {
						console.log(ign(' ** ' + localpath + ' already exists'))
					} else {
						var wstream = fs.createWriteStream(localpath)
						wstream.write(reply)
						console.log(inf(' >> Downloaded: ' + localpath))
					}
				})
			}
			// if (DesiredFiles.length != 0) DeleteExcessFiles(DesiredFiles, subfolder)
			jsonfile.writeFile(l_img_dir+subfolder+'.json', DesiredFiles, function (err) {
				if (err) console.log(err(err))
			})
		})
	}
}

//
// Part 2: Clean up directories
//
function DeleteExcessFiles(DesiredFiles, subfolder) {
	// console.log(inf('Starting DeleteExcessFiles'))
	glob("imgs/" + subfolder + "/*.*", function (er, ExistingFiles) {
		if (er) console.log(err(er))
		if ((ExistingFiles.length - DesiredFiles.length) === 0) {
			console.log(inf(' ~~ All files accounted for in the ' + subfolder + ' folder'))
		} else {
			for (var i = 0; i < ExistingFiles.length; i++) {
				var filename = ExistingFiles[i]
				if (DesiredFiles.indexOf(filename) === -1) {
					console.log(war('Deleting: '+filename))
					fs.unlink(filename, function(err) {
							if (err) throw err
					})
				}
			}
		}
	})
}

//
// Step 3: Schedule update tasks to update locally stored images
//
var CronJob = require('cron').CronJob
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

var Fetch = new CronJob('00 00 9 * * *',
 function() { FetchDropboxPhotos() },
 function () { console.log(inf('Finished Fetch Task')) },
 false
)

//
// Step 4: Create slide show by scheduling updated images
//
// Run only on raspberry pi
if (is_raspberry_pi) {
 // function MakePictures(source) {
 function MakePictures(unused_source) {
	 // console.log(inf('Starting MakePictures'))
	 glob("imgs/" + "*.json", function (er, files) {
		 if (er) console.log(er)
		 var LastFiles = {}
		 var HistoryFile = 'History.json'
		 if (files.length === 0) return
		 // Supports multiple source types (i.e. flickr, Dropbox, etc.)
		 var source = ''
		 if (files.length === 1) {
			 source = files[0]
		 } else {
			 source = files[ Math.round((files.length-1)*Math.random()) ]
		 }
		 var DesiredFiles = jsonfile.readFileSync(source)

		 if (fs.existsSync(HistoryFile)) {
			 // Remove redundancy in slideshow
			 LastFiles = jsonfile.readFileSync(HistoryFile)
			 if (LastFiles[source] === undefined) LastFiles[source] = []
			 if (LastFiles[source].length >= 20 || LastFiles[source].length+5 === DesiredFiles.length) {
				 // Remove first entry (i.e. oldest image already shown)
				 LastFiles[source].shift()
				 // console.log(inf('Shortening list of last files'))
			 }
			 // Keep selecting a random file to find a new file
			 var filepath = DesiredFiles[Math.round( (DesiredFiles.length-1)*Math.random() )]
			 while (LastFiles[source].indexOf(filepath) != -1) {
				 filepath = DesiredFiles[Math.round( (DesiredFiles.length-1)*Math.random() )]
			 }
			 LastFiles[source].push(filepath)
			 // Save LastFiles object
			 jsonfile.writeFileSync(HistoryFile, LastFiles)
		 } else {
			 var filepath = DesiredFiles[Math.round( (DesiredFiles.length-1)*Math.random() )]
			 LastFiles[source] = []
			 LastFiles[source].push(filepath)
			 jsonfile.writeFileSync(HistoryFile, LastFiles)
		 }
		 // fbi -a -noverbose -t 10 /home/pi/Raspberry_Pi/Aloo/node/imgs/dropbox/Care_image\ -\ 10.jpeg
		 var command = 'sudo fbi -a -noverbose -T 10 "/home/pi/Documents/PhotoFrame/' + filepath +'"'
		 if (is_raspberry_pi) {
			var child = exec(command, function (error, stdout, stderr) {
			 if (error) console.log(err(error))
				console.log(inf('\nSwitching image displayed:'))
				console.log(inf(command))
				if (stdout) console.log(war('stdout: ' + stdout))
				if (stderr) console.log(err('stderr: ' + stderr))
			})
		 }
	 })
 }

 // Refresh image every 1/4 minute
 var SlideShow = new CronJob('05,15,25,35,45,55 * * * * *', function() {
		 // console.log(inf('Starting SlideShow CronJob'))
		 if (is_raspberry_pi) MakePictures('imgs/dropbox.json')
	 },
	 function () { },
	 true /* Start the job right now */
 )

	// Should remove all instances of FBI, but always reports: "command failed"?
	// When actually seems to work?
	var KillOldFBI = new CronJob('10 * * * * *', function() {
	if (is_raspberry_pi) {
		var CheckPIDCommand = "ps aux | grep 'fbi' | awk '{print $2}'"
			var child = exec(CheckPIDCommand, function (error, stdout, stderr) {
				console.log(war("\nChecking List of PID"))
				if (error) console.log(realerr(error))
				console.log(inf(CheckPIDCommand))
				if (stdout) console.log(war('stdout: '))
				if (stdout) console.log(war(stdout))
				if (stderr) console.log(err('stderr: ' + stderr))
			})

			// Also, kill previous processes to avoid too many processes and sudden crashing:
			var command = "sudo kill $(ps aux | grep 'fbi' | awk '{print $2}');"
			var child = exec(command, function (error, stdout, stderr) {
				console.log(war("\nAttempting to clear list of PID"))
				if (error) {
					console.log(realerr(error))
					if (error.code) console.log('error.code: '+error.code)
						if (error.signal) console.log('error.signal: '+error.signal)
				}
				console.log(inf(command))
				if (stdout) console.log(war('stdout: ' + stdout))
				if (stderr) console.log(err('stderr: ' + stderr))
			})
			// // may have worked? But still get same error
			// child.stdin.write("my_root_password")
		}
	},
	function () { },
	true
	)
}


// Initialize Function
function init(subfolder) {
	// Still running an old version of node that doesn't support fs.access
	// fs.access(l_img_dir, fs.R_OK | fs.W_OK, function (err) {
	//   if (err) fs.mkdirSync(l_img_dir)
	//     fs.access(l_img_dir+subfolder+'/', fs.R_OK | fs.W_OK, function (err) {
	//       if (err) fs.mkdirSync(l_img_dir+subfolder+'/')
	// 			FetchDropboxPhotos()
	// 			Fetch.start()
	//     })
	// })

	// Using the now deprecated module:
  if (!fs.existsSync(l_img_dir)) fs.mkdirSync(l_img_dir)
  if (!fs.existsSync(l_img_dir+subfolder+'/')) fs.mkdirSync(l_img_dir+subfolder+'/')
	FetchDropboxPhotos()
	Fetch.start()
}


init('dropbox')

// // Then Kill image viewer
// setTimeout(function() {
//  var command = 'sudo pkill fbi'
//  console.log(command)
//  var KillProcess = exec(command, function (error, stdout, stderr) {
//    if (error) console.log(error)
//    console.log('stdout: ' + stdout)
//    console.log('stderr: ' + stderr)
//  })
// }, 5000)
