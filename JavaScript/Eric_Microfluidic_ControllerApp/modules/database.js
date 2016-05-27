// Require the nedb module
var Datastore = require('nedb');
var fs        = require('fs');

// Initialize two nedb databases. Notice the autoload parameter.
var photos = new Datastore({filename: __dirname + '/../data/photos', autoload: true});

// Create a "unique" index for the photo name and user ip
photos.ensureIndex({fieldName: 'name', unique: true});

// // Load all images from the public/photos folder in the database
// var photosOnDisk = fs.readdirSync(__dirname + '/public/photos');

// // Insert the photos in the database. This is executed on every
// // start up of your application, but because there is a unique
// // constraint on the name field, subsequent writes will fail
// // and you will still have only one record per image:

// Make sure all photos are present:
var photosOnDisk = fs.readdirSync(__dirname + '/../public/photos');

// Capture Manual Preferences into Visual UI:
var pref = require('../preferences.json');
pref.steps.forEach(function(step, index){
	var stepIdx = index+1;
	var photoName = stepIdx + '.jpg';
	// Make sure all photos are present:
	var found = false;
	if (photosOnDisk.indexOf(photoName) !== -1) {
		found = true;
	}
	// Fake code some statuses
	var status = '', statusMes = '';
	if (index > 3) {
		status = pref.statuses[3];
		statusMes = pref.statusMessages[3];
	} else {
		status = pref.statuses[index];
		statusMes = pref.statusMessages[index];
	}
	// Insert the curated options
	photos.insert({
		name: photoName,
		found: found,
		title: 'Step '+stepIdx+': '+step,
		status: status,
		statusMessage: statusMes,
		likes: stepIdx,
		dislikes: 0
	});
});

// photosOnDisk.forEach(function(photo){
// 	photos.insert({
// 		name: photo,
// 		title: 'Step 1: Load a fluid and spin a motor',
// 		status: statuses[Math.floor(Math.random()*statuses.length)],
// 		statusMessage: 'FAILING CATASTROPHICALLY! ALERT ALERT!',
// 		likes: 0,
// 		dislikes: 0
// 	});
// });

// Make the photos and users data sets available to the code
// that uses require() on this module:

module.exports = {
	photos: photos
};
