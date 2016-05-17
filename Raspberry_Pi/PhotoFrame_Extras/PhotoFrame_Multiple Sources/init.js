// //
// //
// // Testing execute functions
// //
// //
// var exec = require('child_process').exec;
// var RandIndex = 0 // Math.round( DesiredFiles.length*Math.random() )
// var filepath = 'imgs/flickr_7518494028.jpg' // DesiredFiles[RandIndex]
// 	// sudo fbi -a -noverbose -T 10 /home/pi/Raspberry\ Pi/Aloo/imgs/6.png
// var command = 'sudo fbi -a -noverbose -T 10 /home/pi/Raspberry_Pi/Aloo/node/' + filepath
// console.log(command)

// // sudo fbi -a -noverbose -T 10 /home/pi/Raspberry_Pi/Aloo/node/imgs/flickr_7518494028.jpg
// // sudo fbi -a -noverbose -T 10 /home/pi/Raspberry_Pi/Aloo/node/imgs/flickr_13879984345.jpg
// // sudo fbi -a -noverbose -T 10 /home/pi/Raspberry_Pi/Aloo/node/imgs/google.png
// // sudo fbi -a -noverbose -T 10 /home/pi/Raspberry_Pi/Aloo/node/imgs/google.png

// // Using Exec:
// var child = exec(command, function (error, stdout, stderr) {
// 	if (error) console.log(error)
// 	console.log('stdout: ' + stdout)
// 	console.log('stderr: ' + stderr)
// })

// // Old Way with spawn:
// // var RunShellCommand = spawn('sh', [ command ])

// // RunShellCommand.stdout.on('data', function (data) {
// //   console.log('stdout: ' + data);
// // });

// // RunShellCommand.stderr.on('data', function (data) {
// //   console.log('stderr: ' + data);
// // });

// // RunShellCommand.on('close', function (code) {
// //   console.log('child process exited with code ' + code);
// // });

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


// //
// //
// // Download Testing Code
// //
// //
// // Code Source: http://stackoverflow.com/a/12751657/3219667
// var fs = require('fs'),
//     request = require('request');

// var download = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     console.log('content-type:', res.headers['content-type']);
//     console.log('content-length:', res.headers['content-length']);

//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//   });
// };

// // var url = 'https://www.google.com/images/srpr/logo3w.png';
// var url = 'https://scontent.cdninstagram.com/hphotos-xtp1/t51.2885-15/s640x640/sh0.08/e35/1171608_496373073821234_504573381_n.jpg';
// var filename = 'imgs/' + 'google.png';
// download(url, filename, function(){
//   console.log('done');
// });




// //
// //
// // Playing around with a dropbox folder
// //
// //

// var url = 'https://www.dropbox.com/sh/hbl746wpx2m00hb/AAB88OXDP4DxK-nvxRytHNx2a?dl=0';
// request.head(url, function(err, res, body){
// 	// console.log('---res---');
// 	// console.log(res);
// 	// console.log('---body---');
// 	// console.log(body);
//  //  // console.log('content-type:', res.headers['content-type']);
//  //  // console.log('content-length:', res.headers['content-length']);

//  //  // request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
// });


//
//
// Power Saving
//
//
// Turn off (option 1 and 2)
tvservice -o
// /opt/vc/bin/tvservice --off

// Turn on (option 1 and 2)
tvservice -p
/opt/vc/bin/tvservice --preferred

// Only successful way of going from the blank screen to something useful
// Note: can run FBI in the background and it will return as normal

startx

// Source (Option 1 and Startx): https://www.raspberrypi.org/forums/viewtopic.php?f=26&t=13801&p=151117&hilit=hdmi%2bpower%2bsave%2bmode#p151117
// Comment on the driver issue: https://www.raspberrypi.org/forums/viewtopic.php?f=66&t=67334
// Source (option 2): https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=35249&p=297497&hilit=hdmi%2bpower%2bsave%2bmode#p297497

//
//
// Boot on Startup
//
//
$ cd /etc/init.d/
$ sudo nano PhotoFrameStart
Add: cd /home/pi/Raspberry_Pi/Aloo/node/; node flickr.js
Close and Save
$ sudo chmod 755 PhotoFrameStart
$ sudo update-rc.d PhotoFrameStart defaults
Check the script
$ bash /etc/init.d/PhotoFrameStart

// warning "missing LSB tags and overrides" -> may just need this content:
// ### BEGIN INIT INFO
// # Provides:          skeleton
// # Required-Start:    $remote_fs $syslog
// # Required-Stop:     $remote_fs $syslog
// # Default-Start:     2 3 4 5
// # Default-Stop:      0 1 6
// # Short-Description: Example initscript
// # Description:       This file should be used to construct scripts to be
// #                    placed in /etc/init.d.  This example start a
// #                    single forking daemon capable of writing a pid
// #                    file.  To get other behavoirs, implemend
// #                    do_start(), do_stop() or other functions to
// #                    override the defaults in /lib/init/init-d-script.
// ### END INIT INFO
//
// Another example from: https://www.raspberrypi.org/forums/viewtopic.php?t=50519&p=392273
// Oh and check script for run...
// #!/bin/sh
// # Start/stop the cron daemon.
// #
// ### BEGIN INIT INFO
// # Provides:          cron
// # Required-Start:    $remote_fs $syslog $time
// # Required-Stop:     $remote_fs $syslog $time
// # Should-Start:      $network $named slapd autofs ypbind nscd nslcd
// # Should-Stop:       $network $named slapd autofs ypbind nscd nslcd
// # Default-Start:     2 3 4 5
// # Default-Stop:
// # Short-Description: Regular background program processing daemon
// # Description:       cron is a standard UNIX program that runs user-specified
// #                    programs at periodic scheduled times. vixie cron adds a
// #                    number of features to the basic UNIX cron, including better
// #                    security and more powerful configuration options.
// ### END INIT INFO

// // What I think might work:
// // Note: 5 - GUI
// //
// #!/bin/sh
// ### BEGIN INIT INFO
// # Provides:          PhotoFrameStart
// # Required-Start:    $remote_fs $syslog
// # Required-Stop:     $remote_fs $syslog
// # Default-Start:     5
// # Default-Stop:      6
// # Short-Description: Will this work?
// # Description:       This file should be used to construct scripts to be
// #                    placed in /etc/init.d.  This example start a
// #                    single forking daemon capable of writing a pid
// #                    file.  To get other behavoirs, implemend
// #                    do_start(), do_stop() or other functions to
// #                    override the defaults in /lib/init/init-d-script.
// ### END INIT INFO
// cd /home/pi/Raspberry_Pi/Aloo/node/; node flickr.js



// Final Version:

#!/bin/sh
### BEGIN INIT INFO
# Provides:          PhotoFrameStart
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     5
# Default-Stop:      6
# Short-Description: Will this work?
# Description:       This file should be used to construct scripts to be
#                    placed in /etc/init.d.  This example start a
#                    single forking daemon capable of writing a pid
#                    file.  To get other behavoirs, implemend
#                    do_start(), do_stop() or other functions to
#                    override the defaults in /lib/init/init-d-script.
### END INIT INFO
cd /home/pi/Raspberry_Pi/Aloo/node/; node PhotoFrame.js

