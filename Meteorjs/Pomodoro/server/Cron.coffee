# Cron scheduling experimentation
# Based on demo from: http://richsilv.github.io/meteor/scheduling-events-in-the-future-with-meteor/

@QueueAction = (ItemID, Item) ->
  # Only want one at a time, so remove any old tasks and update the end time
  UnfinishedItems = Items.find({_id: {$ne: ItemID}, End: {$gte: Item.Begin}}).fetch()
  _.each UnfinishedItems, (UnfinishedItem) ->
    # console.log UnfinishedItem.Content+' will be cleared from queue'
    Items.update(UnfinishedItem._id, {$set: {End: Item.Begin, Color: 'black'} })
    ClearTaskBackups(UnfinishedItem._id)

  End = new Date(Item.End) # reformat for cron
  # Create Task object for queue
  Task = {
    ItemID: ItemID
    End: End
  }
  # Store in database as backup and add task to Cron queue for direct action
  TaskID = FutureTasks.insert Task
  addTask(TaskID, Task)

@addTask = (TaskID, Task) ->
  SyncedCron.add
    name: 'Destruct Pomodoro for '+Task.ItemID
    schedule: (parser) ->
      # parser.text 'at ' + Task.End
      parser.recur().on(Task.End).fullDate()
    job: ->
      DoAction(Task)
      # TODO Add push notification to indicate end of a Pom
      console.log 'Running Cron Job at what should be: ' + Task.End

@DoAction = (Task) ->
  # Init vars
  [today, now] = CurrentDay()

  # Might as well do something
  UnfinishedItems = Items.update(Task.ItemID, {$set: {Color: 'green'}})

  # # Count number of reserved bikes under this user
  # count = DailyBikeData.find({Tag: Task.ItemID, Day: today}).count()
  # # Make all reserved bikes available
  # DailyBikeData.update { Tag: Task.ItemID}, {$set: Tag: 'Available' }, multi: true

  # Remove associated cron/backup task from queue to reduce server function
  ClearTaskBackups(Task.ItemID)
  # Alert test environment of progress
  console.log 'Ran: '+Task.ItemID

@ClearTaskBackups = (ItemID) ->
  # Remove both queued task and cron task, this allows the task to be run once
  SyncedCron.remove 'Destruct Pomodoro for '+ItemID
  FutureTasks.remove
    ItemID: ItemID
  console.log 'Cleared: '+ItemID

Meteor.startup ->
  FutureTasks.find().forEach (Task) ->
    console.log 'At Startup: Current list of tasks:'
    console.log Task

    # day = moment(Task.End, 'h:mm:ss a z')
    # console.log day

    # If in the past, make action right away
    if Task.End <= new Date moment().add(Task.timeout, 'minutes')
      if Task.Type is 'Destruct Reservation'
        DoAction(Task.ItemID)
      else
        ClearTaskBackups(Task.ItemID)
    # Otherwise reschedule that event
    else
      addTask(Task._id, Task)

  SyncedCron.start()
