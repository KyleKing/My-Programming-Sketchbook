Template.notifications.rendered = function () {
  //- tooltip demo
  $('.tooltip-demo').tooltip({
    selector: "[data-toggle=tooltip]",
    container: "body"
  });
  //- popover demo
  $("[data-toggle=popover]").popover();
};