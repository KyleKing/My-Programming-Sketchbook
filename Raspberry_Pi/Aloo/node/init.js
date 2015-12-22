// Code Source: http://stackoverflow.com/a/12751657/3219667
var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// var url = 'https://www.google.com/images/srpr/logo3w.png';
var url = 'https://scontent.cdninstagram.com/hphotos-xtp1/t51.2885-15/s640x640/sh0.08/e35/1171608_496373073821234_504573381_n.jpg';
var filename = 'imgs/' + 'google.png';
download(url, filename, function(){
  console.log('done');
});
