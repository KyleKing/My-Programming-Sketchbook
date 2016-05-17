// Takes in poorly parsed COMSOl Data and outputs a parsed CSV dataset
// Oh and gets rid of those useless comments, while maintaining the filename
// COMSOLData_Parse
//  |___ CSV Parsed Output files
// COMSOLData_Raw
//  |___ Raw Files to Be Parsed
// init.js - the best file every written

var fs = require('fs'),
		_ = require('underscore'),
		glob = require('glob'),
		colors = require('colors');

//
//  => Removes any unwanted characters, extra spaces, etc.
StripWhitespace = function (input) {
	if (typeof(input) != 'string') {
		throw new Error('StripWhitespace(): expects the input to be the contents of a raw COMSOL file as a string')
	}
	var CleanString = input
			.replace(/%.*\n/gi, '')
			.replace(/\s\s+/gi, ', ')
			.trim();
	return CleanString
}

//
//  => Adds TS breaks recognizable by my MATLAB function, BreakMatrix.m
AddTSBreaks = function (input) {
	if (typeof(input) != 'string') {
		throw new Error('AddTSBreaks(): expects the input to be the contents of a raw COMSOL file as a string')
	}
	// var CleanString = input.replace(/0, 0\n/gi, '999, 999\n0, 0\n')
	var CleanString = input.replace(/0, /gi, '999, 999\n0, ')
	return CleanString
}

//
//  => Gets filenames of specified parent folder
fetch = function (RootDir, outputDir, timeseries) {
	if (typeof(RootDir) != 'string') {
		throw new Error('fetch(): expects the RootDir input to be a folder name')
	}
	var MATLABCells = '{';
	var FirstCell = true;
	files = glob.sync(RootDir+'/*.txt');
	_.each(files, function(file) {
		// console.log(file);
		var content = fs.readFileSync(file,'utf8')
		// console.log(content);
		var cleanContent = StripWhitespace(content);
		if (timeseries) {
			cleanContent = AddTSBreaks(cleanContent);
		}
		var doc = file.match(/\/([^\/]*txt)/);
		console.log(doc[1]);
		if (FirstCell) {
			MATLABCells = MATLABCells+"'"+doc[1]+"'";
			FirstCell = false;
		} else {
			MATLABCells = MATLABCells+", '"+doc[1]+"'";
		}
		var newFile = outputDir+'/'+doc[1];
		// console.log(newFile);
		fs.writeFileSync(newFile, cleanContent, 'utf8');
		// console.log(cleanContent);
	});
	MATLABCells = MATLABCells+'}';
	console.log(MATLABCells);
	return MATLABCells;
}

// var RelPath = 'COMSOLData';
// MATLABCells = fetch(RelPath+'_Raw', RelPath+'_Parsed', false);

// var FullPath = '/Users/kyleking/Desktop/BIOE332 Group Project/Actual Modeling for Cell Viability/';
// MATLABCells = fetch(FullPath+'Original', FullPath+'CSV', false);

// For Mass Transfer Model
var FullPath = '/Users/kyleking/Desktop/BIOE332 Group Project/Mass Transfer Paper Model/';
MATLABCells = fetch(FullPath+'Original', FullPath+'CSV', false);
MATLABCells = fetch(FullPath+'Original-time', FullPath+'CSV-time', true);

// var RelPath = './';
// MATLABCells = fetch(RelPath+'Original-time', RelPath+'CSV-time', true);
