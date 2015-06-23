// The code that is fired upon page load
jQuery(function($) {
  // Who doesn't like a wonderful set of scalable icons?
  $('head').append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">');

  $('.primary-buttons').append("<div class='button-column' style='width: 50%;'><a href='" + link + "' class='TIME_SHEET_ALT primary-button flat_button' id='8459448626'><h2 class='small_myDescriptors'><i class='fa fa-calculator fa-1x'></i>&nbsp;  Back to Timesheet</h2></a> </div>");

  // chrome.storage.sync.set({'status': 'Relaxing'}, function (result) {
  //   chrome.storage.sync.get('status', function (result) {
  //     alert(result.status);
  //   });
  // });
  CheckStatus(MainLogic);
});

// Check status of the user
function CheckStatus(callback) {
  chrome.storage.sync.get("status", function (obj) {
    console.log('From inside CheckStatus: obj.status = ' + obj.status);
    // SOmetimes this is undefined or otherwise weird...
    if (obj.status != 'Working' && obj.status != 'Relaxing') {
      // Send it to be updated
      obj.status = 'Working';
      ClickAction(obj.status);
    }
    callback(obj.status);
  });
}

// Determine which button to show and change DOM
function MainLogic(val) {
  // Based on UserStatus determine if currently clocked out or in respectively
  if (val != 'Working') {
    var UserStatus = '.IN_FOR_DAY';
    var antiUserStatus = '.OUT_FOR_DAY';
    var direction = 'in';
  } else {
    var UserStatus = '.OUT_FOR_DAY';
    var antiUserStatus = '.IN_FOR_DAY';
    var direction = 'out';
  }

  // Use jQuery to manipulate the DOM
  jQuery(function($) {
    $(UserStatus).hideText();
    $(UserStatus).append("<h2 class='myDescriptors'><i class='fa fa-sign-" + direction + " fa-1x'></i>&nbsp;  Clock " + direction + "</h2>");
    $(UserStatus).click(function() {
      // Stop the link for testing, but doesn't work in production...
      // event.preventDefault();
      // Update internal db with user status
      ClickAction(val);
    });
    // The Hero
    $(UserStatus).removeClass("hide");
    $(UserStatus).addClass("flat_button");
    // The Villain
    $(antiUserStatus).addClass("hide");
    $(antiUserStatus).removeClass("flat_button");

    // Get rid of the borders
    $('.last-border').addClass("hide");

    // Add return to Time Sheet button to the main screen
    var link = document.getElementById('8459448626').getAttribute('href');
    // console.log(link);
  });
}

// Perfectly overkill for hiding the less than stellar text
// Source: from: http://jsbin.com/evafa5/edit?html,js,output
(function($) {
    $.fn.hideText = function() {
        this.html(function() {
            var $this = $(this);
            $this.attr('data-oldtext', $this.html());
            return '&nbsp;';
        });
        return this;
    };
    $.fn.showText = function() {
        this.html(function() {
            var $this = $(this);
            return $this.attr('data-oldtext') || $this.html();
        });
        return this;
    };
})(jQuery);


// On a click event, update the Users' Status
var ClickAction = function(val) {
  console.log('From inside ClickAction: val = ' + val);

  // Use some inverted logic to switch up the status
  if (val != 'Working') {
    var UpdateStatus = 'Working';
  } else {
    var UpdateStatus = 'Relaxing';
  }

  // Save value using the Chrome extension storage API
  chrome.storage.sync.set({'status': UpdateStatus}, function (result) {
    chrome.storage.sync.get('status', function (result) {
      console.log('From inside ClickAction/chrome.storage.sync.set: val = ' + result.status);
      // alert(result.status);
    });
  });

  // Rerun original function to re-render the page
  CheckStatus(MainLogic);
};
