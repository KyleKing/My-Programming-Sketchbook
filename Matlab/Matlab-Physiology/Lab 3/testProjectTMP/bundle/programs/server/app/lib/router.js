(function(){Router.route('/', function () {
  this.wait(Meteor.subscribe('Bikes'));

  // this.ready() is true if all items in the wait list are ready
  if (this.ready()) {
    this.render('map-static');
  } else {
    this.render('map-layout');
  }
});

Router.route('/about');

Router.route('/admin');

Router.route('/student');

Router.route('/mechanic');



// To be added to about, if needed:
// Iron.Router.hooks.scrollToTop = function () {
//   var scrollEl = this.lookupOption('scrollEl') || 'body';
//   Deps.afterFlush(function () {
//     $(scrollEl).scrollTop(0);
//   });
// };

// Router.plugin('scrollToTop', {scrollEl: '.layout'});

})();
