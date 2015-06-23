@DailyBikeData = new Mongo.Collection 'dailyBikeData'

# DailyBikeData.helpers {}

# DailyBikeData.before.insert (userId, doc) ->
#   doc.createdAt = moment().toDate()
#   return