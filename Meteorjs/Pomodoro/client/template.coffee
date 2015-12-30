Template.base.onCreated ->
  Meteor.subscribe('ItemsPub')
  Meteor.subscribe('FutureTasksPub')

Template.base.helpers
  event: ->
    # TODO: Need to only return a given day's events...
    Items.find({}, sort: { Begin: -1 })

Template.form.events
  'submit form': (e) ->
    # TODO Need to Collect the accomplishments on Task Completion as well
    e.preventDefault()
    Meteor.call('StartPom', e.target.Input.value)
    # console.log 'Called StartPom on '+e.target.Input.value
