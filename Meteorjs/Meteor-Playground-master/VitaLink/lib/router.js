Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', { name: 'login' });
Router.route('/patient');
Router.route('/doctor');
Router.route('/doctorView');
Router.route('/adminPanel');

// Router.route('/doctor/:_id/edit', {
//   name: 'edit',
//   data: function() { return TreatmentPlans.findOne(this.params._id); }
// });

Router.route('/admin/:_id/edit', {
  name: 'edit',
  data: function() { return TreatmentPlans.findOne(this.params._id); }
});