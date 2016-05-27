// Load all images from photos folder to match with known list of steps:
var Datastore = require('nedb');
var fs        = require('fs');

var photos = new Datastore({
	filename: __dirname + '/../data/photos',
	autoload: true
});

// Configure the database on filenames and existence of image
photos.ensureIndex({fieldName: 'name', unique: true});
var photosOnDisk = fs.readdirSync(__dirname + '/../public/photos');
var pref         = require('../preferences.json');

pref.steps.forEach(function(step, index){
	var stepIdx = index+1, photoName = stepIdx + '.jpg';
	var found = photosOnDisk.indexOf(photoName) !== -1 ? true : false;
	var status = pref.statuses[0], statusMes = pref.statuses[0];
	// Insert the curated options
	photos.insert({
		name: photoName,
		found: found,
		title: 'Step '+stepIdx+': '+step,
		status: status,
		statusMessage: statusMes,
		index: stepIdx
	});
});

module.exports = {
	photos: photos
};
