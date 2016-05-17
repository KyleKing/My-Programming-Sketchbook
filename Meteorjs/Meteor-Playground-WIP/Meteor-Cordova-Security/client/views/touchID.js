if (Meteor.isCordova) {
  console.log("Printed only in mobile cordova apps");

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    ready = true;
  }

  function localLogin() {
    if (ready) {
      monaca.touchid.auth (
        function() {
          alert("login GOOAAAAAALLLLLL!");
          window.location.assign("simple-todos.html");
        },
        function(errorMessage) {
          alert("login failed!");
        },
        "Hello TouchID!");
      };
    }
  }