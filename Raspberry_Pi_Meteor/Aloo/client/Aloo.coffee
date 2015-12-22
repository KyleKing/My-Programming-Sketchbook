Meteor.subscribe('PicturesData')

# counter starts at 0
Session.setDefault 'counter', 0

Template.hello.helpers counter: ->
  Session.get 'counter'

Template.hello.events 'click button': ->
  Meteor.call('PicRefresh')
  # increment the counter when button is clicked
  # Session.set 'counter', Session.get('counter') + 1
