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
  Meteor.call('PicRefresh')

Meteor.methods
  PicRefresh: () ->
    PicCount = Pictures.find().count()
    console.log PicCount
    if PicCount is 0
      # To be iterated over each of Aloo's streams
      # Also address issues of access token expiring
      # Make sure to run with: meteor --settings settings.json
      url = Meteor.settings.URL
      console.log url

      # Fetch information
      response = Meteor.http.get url, {timeout:30000}
      Info = JSON.parse(response.content)
      # Parse out each image in the JSON response
      ImgCount = Info.data.length
      console.log 'ImgCount = ' + ImgCount
      while ImgCount isnt 0
        ImageUrl = Info.data[ImgCount - 1].images.standard_resolution.url
        Pictures.insert {
          ID: ImgCount
          URL: ImageUrl
          Caption: Info.data[ImgCount - 1].caption
        }
        # console.log 'ImageUrl = ' + ImageUrl
        ImgCount--
      console.log 'Finished updating Pictures Meteor collection'
    'OK'

Meteor.publish( 'PicturesData', () => Pictures.find() )


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


