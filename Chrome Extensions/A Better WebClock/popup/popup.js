CheckStatus(MainLogic);

// Check status of the user
function CheckStatus(callback) {
  chrome.storage.sync.get("status", function (obj) {
    console.log('From inside CheckStatus: obj.status = ' + obj.status);
    callback(obj.status);
  });
}

// Determine which button to show and change DOM
function MainLogic(val) {
	console.log(val);
  // Based on UserStatus determine if currently clocked out or in respectively
  if (val != 'Working') {
		$("#switch-state").prop('checked', false);
		console.log('not working');
  }
  $("#switch-state").bootstrapSwitch('destroy', true, true);
  // Create Switch
  Initiate();
}

function Initiate() {
	// Change some settings, see more here: http://www.bootstrap-switch.org/options.html
	var defaults = $.fn.bootstrapSwitch.defaults;
	defaults.size = 'large';
	defaults.onText = 'IN';
	defaults.offText = 'OUT';
	// Declare bootstrap switch target
	$("#switch-state").bootstrapSwitch();

	$("#switch-state").on('switchChange.bootstrapSwitch', function(event, state) {
	  console.log(state); // true | false
	  // Convert T/F logic to Working/Relaxing
	  // True = Working
	  if (state) {
	  	var status = 'Working';
	  } else {
	  	var status = 'Relaxing';
	  }
	  // Save value using the Chrome extension storage API
	  chrome.storage.sync.set({'status': status}, function (result) {
	    chrome.storage.sync.get('status', function (result) {
	      console.log('From inside ClickAction/chrome.storage.sync.set: val = ' + result.status);
	    });
	  });

    // Reload current tab
    // Source: http://stackoverflow.com/questions/8342756/chrome-extension-api-for-refreshing-the-page/25246060#25246060
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
      var code = 'window.location.reload();';
      chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
    });
	});
}
