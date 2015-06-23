# server/publications/DailyBikeData.coffee

# Give authorized users access to sensitive data by group
Meteor.publish "AvailableBikeLocationsPub", ->
  AvailableBikeLocations.find()