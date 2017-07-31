// PebbleKit JS (pkjs)

var myAPIKey = 'bdecc599b3dc8bbf12ac58ccc6858d97';

Pebble.on('message', function(event) {
  // Get the message that was passed
  var message = event.data;

  if (message.fetch) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      var url = 'http://api.openweathermap.org/data/2.5/weather' +
              '?lat=' + pos.coords.latitude +
              '&lon=' + pos.coords.longitude +
              '&appid=' + myAPIKey;

      request(url, 'GET', function(respText) {
        var cityData = JSON.parse(respText);
        
      });
      console.log("Lat/Long url:")
      console.log(url)
      // The URL must use the city ID or name and will not work for the Lat/Long (FYI)
      //   http://bulk.openweathermap.org/sample/city.list.json.gz
      url = "http://api.openweathermap.org/data/2.5/weather?id=4773711&appid=" + myAPIKey
      http://api.openweathermap.org/data/2.1/find/city?lat=38.89&lon=-77.07=&cnt=1

      request(url, 'GET', function(respText) {
        var weatherData = JSON.parse(respText);

        Pebble.postMessage({
          'weather': {
            // Convert from Kelvin
            'celcius': Math.round(weatherData.main.temp - 273.15),
            'fahrenheit': Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32),
            'desc': weatherData.weather[0].main
          }
        });
      });
    }, function(err) {
      console.error('Error getting location');
    },
    { timeout: 15000, maximumAge: 60000 });
  } else {
    Pebble.postMessage({
      'weather': {
        'celcius': 999,
        'fahrenheit': 999,
        'desc': "Testing"
      }
    });
  }
});

function request(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    // HTTP 4xx-5xx are errors:
    if (xhr.status >= 400 && xhr.status < 600) {
      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
      return;
    }
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}
