# On server…
# var options = { tagName: 'cool dude' };
# InstagramFetcher.fetchImages.fromTag(options, function ( images, pagination ) {
#     // images is a collection of the found images
#     console.log( 'images' );
#     console.log( images );
#     // The pagination object contains id's used for pagination. See below!
#     console.log( 'pagination' );
#     console.log( pagination );
# });

# # On server…
# options = locationId: '281167589'
# InstagramFetcher.fetchImages.fromLocation options, (images, pagination) ->
#   # images is a collection of the found images
#   console.log images
#   # The pagination object contains id's used for pagination. See below!
#   console.log pagination
#   return

# Meteor.startup ->
#   # code to run on server at startup
#   return

# The manual approach
Meteor.startup ->
  url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=1272823892.3826c33.d1cf61bb0732471c8550e335bc073428'

  response = Meteor.http.get url, {timeout:30000}
  Info = JSON.parse(response.content)
  console.log Info.data[0].images.standard_resolution.url



# Source: http://stackoverflow.com/q/29571059/3219667
# $(document).ready ->
#   accessToken = 'USER_ACCESSTOKEN_PLACEHOLDER'
#   $('.get_photo').click ->
#     mediaEndPoint = 'https://api.instagram.com/v1/media/search?lat=' + locationLat + '&lng=' + locationLong + '&access_token=' + accessToken + '&callback=?'
#     if addMarkerLng != null and addMarkerLat != null
#       locationLong = addMarkerLng
#       locationLat = addMarkerLat
#       console.log 'Add Marker ' + mediaEndPoint
#     else if codeAddressLat != null and codeAddressLng != null
#       locationLat = codeAddressLat
#       locationLong = codeAddressLng
#       console.log 'Code Address: ' + mediaEndPoint
#     else
#       alert 'Oops! Something went wrong, please try again!'
#     $('.insta-list').empty()
#     $.getJSON mediaEndPoint, (jsonResult) ->
#       items = jsonResult['data']
#       container = []
#       $.each items, ->
#         val = @['images']['standard_resolution']['url']
#         container.push '<img src=' + val + '>'
#         return
#       $('<ul/>',
#         'class': 'insta-list'
#         html: imageContanier.join('')).appendTo '.modal-body'
#       return
#     return
#   return


