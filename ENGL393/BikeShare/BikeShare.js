if (Meteor.isClient) {
  Template.map.rendered = function() {
    var HERE_hybridDayMobile, map;
    if (Meteor.isClient) {
      map = new L.Map('BikeMap', {
        center: new L.LatLng(38.987701, -76.940989),
        maxZoom: 20,
        zoom: 16,
        zoomControl: false
      });
      HERE_hybridDayMobile = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day.mobile/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
        attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
        subdomains: '1234',
        mapID: 'newest',
        app_id: 'JIX0epTdHneK1hQlqfkr',
        app_code: 'PchnUPPBcZ5VAuHmovac8g',
        base: 'aerial',
        minZoom: 0,
        maxZoom: 20
      }).addTo(map);
    }
  };
  return;
}

// ---
// generated by coffee-script 1.9.2


// Template.map.rendered = function() {
//   return Meteor.subscribe('AvailableBikeLocationsPub', function() {
//     var HERE_hybridDayMobile, bikesData, i, map, markers, meMarker, redBike, zoomControl;
//     if (Meteor.isClient) {
//       console.log(AvailableBikeLocations.find().count());
//
//       /******************************************** */
//
//       /*   Configure Leaflet Map */
//
//       /******************************************* */
//       map = new L.Map('map', {
//         center: new L.LatLng(38.987701, -76.940989),
//         maxZoom: 20,
//         zoom: 16,
//         zoomControl: false
//       });
//       HERE_hybridDayMobile = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/hybrid.day.mobile/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
//         attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
//         subdomains: '1234',
//         mapID: 'newest',
//         app_id: 'JIX0epTdHneK1hQlqfkr',
//         app_code: 'PchnUPPBcZ5VAuHmovac8g',
//         base: 'aerial',
//         minZoom: 0,
//         maxZoom: 20
//       }).addTo(map);
//       zoomControl = L.control.zoom({
//         position: 'bottomleft'
//       });
//       map.addControl(zoomControl);
//
//       /******************************************** */
//
//       /*   Plot 'current' collection with available bike locations */
//
//       /******************************************* */
//       redBike = L.AwesomeMarkers.icon({
//         prefix: 'fa',
//         icon: 'bicycle',
//         markerColor: 'red',
//         iconColor: 'white'
//       });
//       markers = new L.MarkerClusterGroup;
//       map.addLayer(markers);
//       bikesData = AvailableBikeLocations.find().fetch();
//       console.log(bikesData);
//       i = bikesData.length - 1;
//       while (i >= 1) {
//         if (!isNaN(bikesData[i].Positions.Lat)) {
//           markers.addLayer(new L.Marker(new L.LatLng(bikesData[i].Positions.Lat, bikesData[i].Positions.Lng), {
//             icon: redBike
//           }));
//           console.log(bikesData[i]);
//         } else {
//           console.log('Bad Bike Location (NaN) - i.e. the current database is empty');
//           console.log(bikesData[i]);
//         }
//         i--;
//       }
//       map.addLayer(markers);
//
//       /******************************************** */
//
//       /*   Plot the user */
//
//       /******************************************* */
//       meMarker = L.AwesomeMarkers.icon({
//         prefix: 'fa',
//         icon: 'user',
//         markerColor: 'blue',
//         iconColor: 'white'
//       });
//       map.locate({
//         setView: true
//       }).on('locationfound', function(e) {
//         var marker;
//         marker = L.marker([e.latitude, e.longitude], {
//           icon: redMarker
//         }).addTo(map);
//       });
//     }
//   });
// };
//
// // ---
// // generated by coffee-script 1.9.2
