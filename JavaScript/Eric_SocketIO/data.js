// Load all images from photos folder to match with known list of steps:
var Datastore = require('nedb');
var fs = require('fs-extra');

var steps = new Datastore({
	filename: __dirname + '/data/steps',
	autoload: true
});
steps.ensureIndex({fieldName: 'name', unique: true});

var photos = new Datastore({
	filename: __dirname + '/data/photos',
	autoload: true
});
photos.ensureIndex({fieldName: 'name', unique: true});

// Configure the database on filenames and existence of image
var pref = require('./preferences.json');
var photosOnDisk = fs.readdirSync(__dirname + '/public/photos');
photosOnDisk.forEach(function populate(photoName, index) {
	var stepIdx = index + 1, status = pref.statuses[2];
	photos.insert({
		name: photoName,
		title: 'Step '+stepIdx+': '+index,
		status: status,
		index: stepIdx
	});
});

pref.steps.forEach(function(step, index) {
	var stepIdx = index + 1, photoName = stepIdx + '.jpg';
	var found = photosOnDisk.indexOf(photoName) !== -1 ? true : false;
	var status = pref.statuses[2], statusMes = pref.statusMessages[2];
	// Insert the curated options
	steps.insert({
		name: photoName,
		found: found,
		title: 'Step '+stepIdx+': '+step,
		status: status,
		statusMessage: statusMes,
		index: stepIdx
	});
});

module.exports = {
	steps: steps,
	photos: photos
};
