var socket = io();

/** Configure development environment: */
socket.on('BROWSER_REFRESH_URL', function(BROWSER_REFRESH_URL){
  // console.log('connected: ' + BROWSER_REFRESH_URL);
  // Quick fix: http://stackoverflow.com/a/611016
  var script = document.createElement( 'script' );
  script.src = BROWSER_REFRESH_URL;
  $('body').append( script );
});

/**
 * Emit events:
 */
$( '#start-btn' ).click(function() {
  // console.log('Button pressed - Start');
  socket.emit('start');
});
$( '#stop-btn' ).click(function() {
  // console.log('Button pressed - Stop');
  socket.emit('stop');
});
$( '#capture-btn' ).click(function() {
  console.log('Button pressed - capture');
  socket.emit('capture');
});

/**
 * Respond to events
 * @param  {[numbers]} num
 * @param  {String}    newStatus
 */
socket.on('new-photo', function(newPath){
  $('#device-img').attr('src', '/photos/' + newPath);
});
socket.on('step', function(num, newStatus) {
  num.forEach(function(element, index, array) {
    // console.log('a[' + index + '] = ' + element + ' - with ' + newStatus);
    var stepID = '#Step' + element;
    $(stepID).attr('class', newStatus);
  });
});
