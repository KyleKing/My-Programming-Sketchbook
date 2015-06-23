# seeds/AvailableBikeLocations.coffee

# To help with load order, make sure there is DailyBikeData available
if DailyBikeData.find().count() != 0
  # If collection is empty
  if AvailableBikeLocations.find().count() == 0
    # Find all bikes with the Tag: 'Available' in today's collection
    BikeData = DailyBikeData.find(
      Day: 158
      Tag: 'Available').fetch()
    # Insert the most recent information into a collection for user access
    _.each BikeData, (BikeDatum) ->
      AvailableBikeLocations.insert
        Bike: BikeDatum.Bike
        Day: BikeDatum.Day
        Tag: ['Available']
        # Make sure to strip out rider name
        Positions:
          Timestamp: BikeDatum.Positions[1].Timestamp
          Lat: BikeDatum.Positions[1].Lat
          Lng: BikeDatum.Positions[1].Lng
    console.log 'Created AvilableBikeData data schema'