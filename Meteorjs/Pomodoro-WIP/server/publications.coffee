Meteor.publish 'ItemsPub', ->
  Items.find()

Meteor.publish 'FutureTasksPub', ->
  FutureTasks.find()
