# Alternatively just change tag in AvailableBikeData collection

# RemoveAvailableBike id, ->
	# remove bike from available list if in use or being repaired
	# AvailableBikeData.remove(id)}
	# Some sort of check?

# ** Create check case if bike no longer needed or timeout **
# ReserveAvailableBike id, userID, ->
	# Reserve bike for user and hide from available list
	# AvailableBikeData.update(id)
		# tag: userID

# AddAvailableBike id, ->
	# Add newly available bike
	# i.e. no longer in use/reserved or repaired and redistributed
	# AvailableBikeData.insert(id)

# UpdateAvailableBikePOsition id, ->
	# Get coordinates and time stamp
	# Update AvailableBikeData.insert(id)