var db     = require('./database');
var photos = db.photos;

require('jquery');

// Render the home.html page with images and steps info
module.exports = function(app) {
  app.get('/', function(req, res) {
    photos.find({}, function(err, allPhotos) {
      // Sort by index (chronological)
      allPhotos.sort(function(a, b) {
       return a.index - b.index;
      });
      var imageToShow = allPhotos[0];
      res.render('home', {
        photo: imageToShow,
        standings: allPhotos,
        BROWSER_REFRESH_URL: process.env.BROWSER_REFRESH_URL
      });
    });
  });



  app.post('/reload', function(req,res){
    console.log('TESTING! RELOAD ROUTE');
    res.redirect('../');
  });

  app.post('*', function(req, res, next){
    console.log('next();');
    next();
  });
  function redirect(req, res) {
    console.log('attempt redirect?');
    res.redirect('../');
  }

  // // Executed on any post request
  // app.post('*', function(req, res, next){
  //   photos.insert({
  //     title: 'inserted'
  //   }, function(){
  //     next();
  //   });
  // });

  // app.post('/start', vote);
  // app.post('/stop', vote);

  // function vote(req, res) {
  //   console.log('req');
  //   console.log(req);
  //   // // Which field to increment, depending on the path
  //   // var what = {
  //   //   '/start': {dislikes: 1},
  //   //   '/stop': {likes: 1}
  //   // };
  //   // // Find the photo, increment the vote counter and mark that the user has voted on it.
  //   // photos.find({name: req.body.photo}, function(err, found) {
  //   //   if (found.length === 1) {
  //   //     photos.update(found[0], {$inc : what[req.path]});
  //   //   } else {
  //   //     res.redirect('../');
  //   //   }
  //   // });
  // }
};
