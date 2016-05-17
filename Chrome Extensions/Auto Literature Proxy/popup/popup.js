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
	  // console.log(this); // DOM element
	  // console.log(event); // jQuery event
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
	    //   alert(result.status);
	    });
	  });
	});
}

// Original from examples page
// Anonymous function
// (function() {
//   var $confirm;

//   $confirm = null;

//   $(function() {
//     var $createDestroy, $window, sectionTop;
//     $window = $(window);
//     sectionTop = $(".top").outerHeight() + 20;
//     $createDestroy = $("#switch-create-destroy");
//     $("a[href*=\"#\"]").on("click", function(event) {
//       var $target;
//       event.preventDefault();
//       $target = $($(this).attr("href").slice("#"));
//       if ($target.length) {
//         return $window.scrollTop($target.offset().top - sectionTop);
//       }
//     });
//     $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch();
//     $("[data-switch-get]").on("click", function() {
//       var type;
//       type = $(this).data("switch-get");
//       return alert($("#switch-" + type).bootstrapSwitch(type));
//     });
//     $("[data-switch-set]").on("click", function() {
//       var type;
//       type = $(this).data("switch-set");
//       return $("#switch-" + type).bootstrapSwitch(type, $(this).data("switch-value"));
//     });
//     $("[data-switch-toggle]").on("click", function() {
//       var type;
//       type = $(this).data("switch-toggle");
//       return $("#switch-" + type).bootstrapSwitch("toggle" + type.charAt(0).toUpperCase() + type.slice(1));
//     });
//     $("[data-switch-set-value]").on("input", function(event) {
//       var type, value;
//       event.preventDefault();
//       type = $(this).data("switch-set-value");
//       value = $.trim($(this).val());
//       if ($(this).data("value") === value) {
//         return;
//       }
//       return $("#switch-" + type).bootstrapSwitch(type, value);
//     });
//     $("[data-switch-create-destroy]").on("click", function() {
//       var isSwitch;
//       isSwitch = $createDestroy.data("bootstrap-switch");
//       $createDestroy.bootstrapSwitch((isSwitch ? "destroy" : null));
//       return $(this).button((isSwitch ? "reset" : "destroy"));
//     });
//     return $confirm = $("#confirm").bootstrapSwitch({
//       size: "large",
//       onSwitchChange: function(event, state) {
//         event.preventDefault();
//         return console.log(state, event.isDefaultPrevented());
//       }
//     });
//   });

// }).call(this);
