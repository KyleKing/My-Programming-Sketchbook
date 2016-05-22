// Takes in poorly parsed COMSOl Data and outputs a parsed CSV dataset
// Additionally removes comments, while maintaining original filename
// DirectoryName_Raw
//  |___ Raw Files to Be Parsed
// DirectoryName_Parsed
//  |___ CSV Parsed Output files
// init.js - the best file every written

// Make sure to run npm install before using

var fs = require('fs-extra'),
		_ = require('underscore'),
		glob = require('glob'),
		colors = require('colors');

//
//  => Removes any unwanted characters, extra spaces, etc.
runRegexp = function (input) {
	if (typeof(input) != 'string') {
		throw new Error('runRegexp(): expects the input to be the contents' +
			' of a raw COMSOL file as a string')
	}
	var modString = input
			.replace(/%.*\n/gi, '')
			.replace(/\s\s+/gi, ', ')
			.trim();
	return modString
}

//
//  => Adds TimeSeries breaks recognizable by my MATLAB function, BreakMatrix.m
AddTSBreaks = function (input) {
	if (typeof(input) != 'string') {
		throw new Error('AddTSBreaks(): expects the input to be the contents of' +
			' a raw COMSOL file as a string')
	}
	var modString = input.replace(/0, /gi, '999, 999\n0, ')
	return modString
}

//
//  => Gets filenames of specified parent folder
fetch = function (RootDir, outputDir, timeseries) {
	if (typeof(RootDir) != 'string') {
		throw new Error('fetch(): expects the RootDir input to be a folder name')
	}
	var files = glob.sync(RootDir+'/*.txt');
	_.each(files, function(file) {
		var content = fs.readFileSync(file,'utf8')
		content = runRegexp(content);
		if (timeseries) content = AddTSBreaks(content);
		var doc = file.match(/\/([^\/]*txt)/);
		var newFile = outputDir + '/' + doc[1];
		fs.ensureDirSync(outputDir);
		fs.writeFileSync(newFile, content, 'utf8');
	});
	return true;
}

//
// Initiate functions:
var SSPath = __dirname + '/SS/';
var UnsteadyPath =  __dirname + '/Unsteady/';
// fetch(RootDir, outputDir, timeseries)
fetch(SSPath+'_Raw', SSPath+'_Parsed', false);
fetch(UnsteadyPath+'_Raw', UnsteadyPath+'_Parsed', true);
