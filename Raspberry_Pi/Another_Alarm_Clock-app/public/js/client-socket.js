var socket = io(); // eslint-disable-line

$('.data-toggle').change(function() {
  if ($(this).prop('checked')) {
    socket.emit('start', $(this).prop('id'));
    console.log('STARTING: ' + $(this).prop('id'));
  } else {
    socket.emit('stop', $(this).prop('id'));
    console.log('STOPPING: ' + $(this).prop('id'));
  }
  // socket.emit('toggle', $(this).id, $(this).prop('checked'));
});

/** Configure development environment: */
socket.on('BROWSER_REFRESH_URL', function(BROWSER_REFRESH_URL) {
  // console.log('connected: ' + BROWSER_REFRESH_URL);
  // Quick fix: http://stackoverflow.com/a/611016
  var script = document.createElement('script');
  script.src = BROWSER_REFRESH_URL;
  $('body').append(script);
});

/**
 * Emit events:
 */
// $('.start').click(function() {
//   socket.emit('start', this.id);
// });
// $('.stop').click(function() {
//   socket.emit('stop', this.id);
// });
$('.edit').click(function() {
  // open text boxes in place of view plane
  socket.emit('edit', this.id, false);
});
$('.save').click(function() {
  // Plus rest of edited textboxes
  socket.emit('save', this.id, true);
});
$('.remove').click(function() {
  // Plus rest of edited textboxes
  console.log('FIRING?');
  socket.emit('remove', this.id);
});

/**
 * Respond to events
 * @param  {[numbers]} num
 * @param  {String}    newStatus
 */
socket.on('new-photo', function(newPath) {
  $('#device-img').attr('src', `/photos/${newPath}`);
});
socket.on('step', function(num, newStatus) {
  num.forEach(function(element) {
    // console.log('a[' + index + '] = ' + element + ' - with ' + newStatus);
    var stepID = `#Step ${element}`;
    $(stepID).attr('class', newStatus);
  });
});
