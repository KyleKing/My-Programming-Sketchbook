// // Copyright (c) 2012 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.
//
// // Simple extension to replace lolcat images from
// // http://icanhascheezburger.com/ with loldog images instead.
//
// chrome.webRequest.onBeforeRequest.addListener(
//   function(info) {
//     console.log("Cat intercepted: " + info.url);
//     alert("Cat intercepted: " + info.url)
//     // Redirect the lolcal request to a random loldog URL.
//     var i = Math.round(Math.random() * loldogs.length);
//     return {redirectUrl: loldogs[i]};
//   },
//   // filters
//   {
//     urls: [
//       "https://i.chzbgr.com/*"
//     ],
//     types: ["image"]
//   },
//   // extraInfoSpec
//   ["blocking"]);

// var _redirectURL = "";
// // Register an event listener which
// //traces all requests before being fired
// chrome.webRequest.onBeforeRequest.addListener(function (details) {
//     console.log('before request: ' + details);
//     if (_redirectURL != "") {
//         console.log(_redirectURL);
//         console.log('blocked');
//         return {
//             redirectUrl: "http://www.google.com/" /*Redirection URL*/
//         };
//     }
// }, {
//     urls: ["*://www.facebook.com/*"] /* List of URL's */
// }, ["blocking"]); // Block intercepted requests until this handler has finished
//
//
// chrome.webRequest.onHeadersReceived.addListener(function (details) {
//     console.log(details);
//     if (_redirectURL == "") {
//       // force reload with new url
//       console.log('redirect');
//         var secondaryURL = "http://www.google.com/";
//         // extractSecondaryURL(details);
//         _redirectUrl = secondaryURL;
//         // chrome.tabs.reload();
//     }
// }, {
//     urls: ["http://*/*", "https://*/*"]
// }, ["blocking", "responseHeaders"]);


chrome.extension.onRequest.addListener(function(request, sender) {
    console.log('FUNCTION ' + request.redirect);
    chrome.tabs.update(sender.tab.id, {url: request.redirect});
});
