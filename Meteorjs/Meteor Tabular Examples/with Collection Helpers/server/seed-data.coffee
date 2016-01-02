if Editors.find().count() is 0
  # or (Books.find().count() is 0 and Editors.find().count() isnt 0) or Numbers.find().count() is 0
  Meteor.call 'SquareZero', null, (err, res) ->
    if (err)
      console.error err
    console.log "FreshStart Result: "+res
    Meteor.call 'FreshStart'

