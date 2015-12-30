# Cron scheduling experimentation
# Based on demo from: http://richsilv.github.io/meteor/scheduling-events-in-the-future-with-meteor/

@QueueAction = (ID, Item) ->
  # Only want one at a time, so remove any old tasks and update the end time
  UnfinishedItems = Items.find({_id: {$ne: ID}, End: {$gte: Item.Begin}}).fetch()
  _.each UnfinishedItems, (UnfinishedItem) ->
    # console.log UnfinishedItem.Content+' will be cleared from queue'
    Items.update(UnfinishedItem._id, {$set: End: Item.Begin })
    ClearTaskBackups(UnfinishedItem._id)

  End = new Date(Item.End) # reformat for cron
  # Create Task object for queue
  Task = {
    ID: ID
    End: End
  }
  # Store in database as backup and add task to Cron queue for direct action
  thisId = FutureTasks.insert Task
  addTask(thisId, Task)

@addTask = (ID, Task) ->
  SyncedCron.add
    name: 'Destruct Pomodoro for ' + ID
    schedule: (parser) ->
      # parser.text 'at ' + Task.End
      parser.recur().on(Task.End).fullDate()
    job: ->
      DoAction(Task.ID, Task)
      # TODO Add push notification to indicate end of a Pom
      console.log 'Running Cron Job at what should be: ' + Task.End

@DoAction = (ID, Task) ->
  # Init vars
  [today, now] = CurrentDay()

  # # Count number of reserved bikes under this user
  # count = DailyBikeData.find({Tag: ID, Day: today}).count()
  # # Make all reserved bikes available
  # DailyBikeData.update { Tag: ID}, {$set: Tag: 'Available' }, multi: true

  # Remove associated cron/backup task from queue to reduce server function
  ClearTaskBackups(ID)
  # Alert test environment of progress
  console.log 'Updated: ' + 1 + ' bike tags'

@ClearTaskBackups = (ID) ->
  # Remove both queued task and cron task, this allows the task to be run once
  FutureTasks.remove
    ID: ID
  SyncedCron.remove 'Destruct Reservation for ' + ID
  console.log 'Cleared: ' + ID

Meteor.startup ->
  FutureTasks.find().forEach (Task) ->
    console.log 'At Startup: Current list of tasks:'
    console.log Task

    # day = moment(Task.End, 'h:mm:ss a z')
    # console.log day

    # If in the past, make action right away
    if Task.End <= new Date moment().add(Task.timeout, 'minutes')
      if Task.Type is 'Destruct Reservation'
        DoAction(Task.ID)
      else
        ClearTaskBackups(Task.ID)
    # Otherwise reschedule that event
    else
      addTask(Task._id, Task)

  SyncedCron.start()
