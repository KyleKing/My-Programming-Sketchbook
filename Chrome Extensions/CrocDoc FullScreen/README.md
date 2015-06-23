Auto Literature Proxy
===================
> Redirect to the UMD proxy for free journal access.

# From the [chrome webstore app page]
Take advantage of the wealth of publications that UMD purchases for us. When off campus, this app will redirect you to the login page and give you direct access to journal articles without any manual searching. Use google scholar and be free of the limited library.umd.edu search

## The things to be developed:
1. Create redirect from journal page
1. Add support for every umd page
1. Add switch to turn extension on/off
1. Change switch to just click icon

## References
> How the app was built

- Built with [Bootstrap-Switch](http://www.bootstrap-switch.org/), Bootstrap, jQuery, and plenty of guides
- [Eloquent JavaScript is my go to reference](http://eloquentjavascript.net/03_functions.html)
- It always helps to know where the [invisible background page is](http://stackoverflow.com/questions/10257301/where-to-read-console-messages-from-background-js-in-a-chrome-extension)
- [Or a good example to get started](https://developer.chrome.com/extensions/samples#search:webrequest) [scroll to CatBlock] and the [more general guide](https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest)
- And if I ever use Regexp, I [will start here](http://regexr.com/) and use [match.index](http://stackoverflow.com/questions/2295657/return-positions-of-a-regex-match-in-javascript) and possibly this [example code](https://github.com/blunderboy/requestly/blob/master/src/background/background.js#L148) or this [answer](http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url)
- Built in [Atom.io](https://atom.io/) with quick [reloads](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) and [lots of color choices](http://coolors.co/app/)



Notes
```json
{
  "permissions": [
  	"webRequest",
  	"webRequestBlocking",
  	"*://*/*",
  	"storage"
  ],

  "content_scripts": [ {
    "js": [ "lib/jquery-2.1.4.min.js", "background.js" ],
    "css": [ ],
    "matches": [
      "http://pubs.rsc.org/*"
      ]
  }],
}
```
