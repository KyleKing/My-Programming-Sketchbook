if Books.find().count() is 0 or Editors.find().count() is 0 or Numbers.find().count() is 0 or Lots.find().count() is 0
  Meteor.call 'SquareOne', null, (err, res) ->
    if (err)
      console.error err
    console.log "FreshStart Result: "+res
    Meteor.call 'FreshStart'

