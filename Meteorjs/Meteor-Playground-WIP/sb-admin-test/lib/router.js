Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('dashboard');
}, {
  name: 'dashboard'
});

Router.route('/blank');
Router.route('/buttons');
Router.route('/flot');
Router.route('/forms');
Router.route('/grid');
Router.route('/icons');
// Router.route('/dashboard');
Router.route('/logintemplate');
Router.route('/morris');
Router.route('/notifications');
Router.route('/panelswells');
Router.route('/tables');
Router.route('/typography');