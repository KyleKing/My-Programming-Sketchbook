/**
 * This file defines the routes used in your application
 * It requires the database module that we wrote previously.
 */

var db = require('./database');
var photos = db.photos;

module.exports = function(app){
  // Homepage
  app.get('/', function(req, res){
    // Find all photos
    photos.find({}, function(err, allPhotos){
      // Sort in stepwise order
      allPhotos.sort(function(a, b){
       return a.likes - b.likes;
      });
      // var imageToShow = allPhotos[Math.floor(Math.random()*allPhotos.length)];
      var imageToShow = allPhotos[2];
      res.render('home', {
        photo: imageToShow,
        standings: allPhotos,
        BROWSER_REFRESH_URL: process.env.BROWSER_REFRESH_URL
      });
    });
  });

  // This is executed before the next two post requests
  app.post('*', function(req, res, next){
    // Register the user in the database by ip address
    photos.insert({
      title: 'inserted'
    }, function(){
      // Continue with the other routes
      next();
    });
  });

  app.post('/notcute', vote);
  app.post('/cute', vote);

  function vote(req, res){
    // Which field to increment, depending on the path
    var what = {
      '/notcute': {dislikes:1},
      '/cute': {likes:1}
    };
    // Find the photo, increment the vote counter and mark that the user has voted on it.
    photos.find({name: req.body.photo}, function(err, found){
      if(found.length === 1){
        photos.update(found[0], {$inc : what[req.path]});
      } else {
        res.redirect('../');
      }
    });
  }
};
