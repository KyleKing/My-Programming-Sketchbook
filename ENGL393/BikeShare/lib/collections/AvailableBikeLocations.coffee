@AvailableBikeLocations = new Mongo.Collection 'availableBikeLocations'

# AvailableBikeLocations.helpers {}

# AvailableBikeLocations.before.insert (userId, doc) ->
#   doc.createdAt = moment().toDate()
#   return