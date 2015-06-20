// The code that is fired upon page load

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
    //   alert(result.status);
    });
  });

  // Rerun original function to rerender the page
  CheckStatus(MainLogic);
};



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
      // Stop the link for testing
      event.preventDefault();
      // Update internal db with user status
      ClickAction(val);
    });
    // The Hero
    $(UserStatus).removeClass("hide");
    $(UserStatus).addClass("button");
    // The Villian
    $(antiUserStatus).addClass("hide");
    $(antiUserStatus).removeClass("button");
  });
}

// Check status of the user
function CheckStatus(callback) {
  chrome.storage.sync.get("status", function (obj) {
    console.log('From inside CheckStatus: obj.status = ' + obj.status);
    callback(obj.status);
  });
}

jQuery(function($) {
  // Who doesn't like a wonderful set of scalable icons?
  $('head').append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">');
  // chrome.storage.sync.set({'status': 'Relaxing'}, function (result) {
  //   chrome.storage.sync.get('status', function (result) {
  //     alert(result.status);
  //   });
  // });
  CheckStatus(MainLogic);
});
