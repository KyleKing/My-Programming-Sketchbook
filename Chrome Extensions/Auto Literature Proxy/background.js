// The code that is fired upon page load
jQuery(function($) {
  // get currnet url
  var str =  window.location.href;
  console.log("window.location.href = " + str);

  // Hard code the proxy link
  var proxyLink = '.proxy-um.researchport.umd.edu';

  // Example string split function with clean output
  // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
  function splitString(stringToSplit, separator) {
    var arrayOfStrings = stringToSplit.split(separator);

    console.log('The original string is: "' + stringToSplit + '"');

    // Catch error case
    if (arrayOfStrings.length != 2){
      console.log('Split error, there are ' + arrayOfStrings.length + ' elements');
      return 'Error';
    }

    // Request redirect to split and joined url
    var redirectUrl = arrayOfStrings.join(separator + proxyLink);
    console.log('The array has ' + arrayOfStrings.length + ' elements: ' + redirectUrl);

    chrome.extension.sendRequest({redirect: redirectUrl});
    // Controllable test
    // chrome.extension.sendRequest({redirect: 'http://www.google.com'});
    console.log('Request Sent');
  }

  // The goal:
  // http://pubs.rsc.org.proxy-um.researchport.umd.edu/en/Content/ArticleLanding/2007/LC/b712893m#!divAbstract
  // http://pubs.rsc.org/en/content/articlelanding/2007/lc/b712893m#!divAbstract
  // Need check for when the site has redirected to stop redirecting because the links are identical
  splitString(str, '.org');
});
