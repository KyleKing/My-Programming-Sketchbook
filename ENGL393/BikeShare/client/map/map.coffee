Template.map.rendered = ->
  if Meteor.isClient
    console.log 'loaded'

    ###*******************************************###
    ###   Configure Leaflet Map                   ###
    ###******************************************###

    # L.Icon.Default.imagePath = 'leaflet/images';
    map = new (L.Map)('map',
      center: new (L.LatLng)(38.987701, -76.940989)
      maxZoom: 20
      zoom: 16
      zoomControl: false)
    HERE_hybridDayMobile = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day.mobile/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}',
      attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>'
      subdomains: '1234'
      mapID: 'newest'
      app_id: 'JIX0epTdHneK1hQlqfkr'
      app_code: 'PchnUPPBcZ5VAuHmovac8g'
      base: 'aerial'
      minZoom: 0
      maxZoom: 20).addTo(map)
    # var OpenCycleMap = L.tileLayer("http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png", {
    #   attribution: "&copy; <a href=\"http://www.opencyclemap.org\">OpenCycleMap</a>, &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>"
    # }).addTo(map);
    zoomControl = L.control.zoom(position: 'bottomleft')
    map.addControl zoomControl

    ###*******************************************###

    ###   Plot 'current' collection with available bike locations  ###

    ###******************************************###

    # Creates a red marker with the coffee icon
    redBike = L.AwesomeMarkers.icon(
      prefix: 'fa'
      icon: 'bicycle'
      markerColor: 'red'
      iconColor: 'white')
    # Use Leaflet markercluster group plugin
    markers = new (L.MarkerClusterGroup)
    map.addLayer markers
    # Collect bike location data
    bikesData = Current.find().fetch()
    i = bikesData.length - 1
    while i >= 1
      if !isNaN(bikesData[i].lat)
        markers.addLayer new (L.Marker)(new (L.LatLng)(bikesData[i].lat, bikesData[i].lng), icon: redBike)
        # console.log(bikesData[i]);
      else
        console.log 'Bad Bike Location (NaN) - i.e. the current database is empty'
        console.log bikesData[i]
      i--
    map.addLayer markers

    ###*******************************************###

    ###   Plot the user          ###

    ###******************************************###

    # Create marker
    meMarker = L.AwesomeMarkers.icon(
      prefix: 'fa'
      icon: 'user'
      markerColor: 'blue'
      iconColor: 'white')
    # Locate, zoom and plot
    map.locate(setView: true).on 'locationfound', (e) ->
      marker = L.marker([
        e.latitude
        e.longitude
      ], icon: meMarker).addTo(map)
      console.log([e.latitude, e.longitude]);
    return
  return