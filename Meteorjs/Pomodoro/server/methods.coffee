Meteor.methods
  StartPom: (Content) ->
    check Content, String
    # h m s ms - b/c Unix TS in milliseconds from epoch
    Timeout = 1*25*60*1000
    [today, now] = CurrentDay()
    # console.log now
    # console.log Timeout
    Item = {
      Begin: now
      End: now+Timeout
      Content: Content
    }
    thisId = Items.insert Item
    QueueAction(thisId, Item)
    'ok'
