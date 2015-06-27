$( document ).ready(function() {
  // Get session variables and such from the link
  var aElmnt = $('a.modal_preview_link.Button--link');
  var theLink = aElmnt.eq(0).attr('data-crocodoc_session_url');
  // console.log('theLink = ' + theLink);

  // Settings
  var Content = 'View Feedback';
  var icon = ['arrows-alt', 'icon-external-link'];

  // get iframe
  var PrevFrame = $('head', window.frames['preview_frame'].document);
  console.log(PrevFrame);
  if (typeof PrevFrame !== 'undefined' ) {
    // Who doesn't like a wonderful set of scalable icons? Font awesome insert!
    $('head', window.frames['preview_frame'].document).append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">');
    console.log(PrevFrame);
  }

  // Wait for page to load the first iframe element with the link
  if (typeof theLink !== 'undefined') {
    // Supersede the ELMS view feedback button with one that opens the widget in the current tab
    var host = 'https://myelms.umd.edu/'; // Concatenate the url
    $('div.col-xs-5.align-right').append("<a class='fullscreen-Widget-Kyle' href='" + host + theLink + "' target='_top' ><i class='fa fa-" + icon[1] + " fa-1x'></i> &nbsp; " + Content + "</a>  ");
      // <a class='fullscreen-Widget-Kyle' href='" + host + theLink + "' target='_new' ><i class='fa fa-" + icon[2] + " fa-1x'></i>" + ' or ' + "</a>");
    aElmnt.addClass("hide");
  }
});