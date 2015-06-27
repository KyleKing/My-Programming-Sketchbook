A Better Web Clock
===================
> I wanted to improve the WebClock interface as I would often mistake clocking in/out.


Here's the difference:
![Comparison](../A%20Better%20WebClock%20Promotional/Comparison.png)

# From the [chrome webstore app page](https://chrome.google.com/webstore/detail/web-clock-ux/bemigfbpfihgefbnbncjddfbgknchfaf)
This app simplifies the "clock in"/out screen by remembering the the last user event. When you "clock out", the app hides the "clock out" button and only displays the "clock in" button.

- Bigger, color-coded buttons
- Simplified interface (1/2 the buttons!)
- AND only the button you want (either "clock in" or out!)

To get started, add the extension to chrome. Click the browser icon in the top right corner, which prompts a popup menu. Select your current status and refresh the current page to see an update.

Disclaimer: This extension is not associated with WorkForce in any way and may interfere with clocking in and out. Please always confirm that this doesn't interfere with regular use.

## The things to be developed:
1. ~~Add option to manually override synced status~~
2. ~~Create button that takes link from ".TIME_SHEET" and adds button below clock button~~
1. ~~Stylize the [buttons](http://cssdeck.com/labs/beautiful-flat-buttons) and probably the whole page, while I'm at it~~ Not going any farther with design, tried [Wave](http://fian.my.id/Waves/#start) but looks too difficult
1. ~~[Upload to the chrome web store](https://developer.chrome.com/webstore/publish)~~

It was fun building my first extension and am looking forward to future projects!

## References
> This was my first extension after all

- Built with [Bootstrap-Switch](http://www.bootstrap-switch.org/), Bootstrap, jQuery, and plenty of guides
- This guide got me started by [Carl Topham](https://carl-topham.com/theblog/post/creating-chrome-extension-uses-jquery-manipulate-dom-page/) (Note: make sure to see his update at the bottom with fixes for Manifest Version 2)
- Described as overkill, but turned out to be perfect for this application. A hide_text function was copied from [TJ Crowder's extensive answer](http://stackoverflow.com/questions/5824091/jquery-hiding-text-only-in-h2-block-not-background)
- The flat button styles are based off of [this article](http://www.commentredirect.com/make-awesome-flat-buttons-css/)
- The blue clock icon is from [this article](http://webdesign.tutsplus.com/articles/making-web-icons-smarter--webdesign-15586)
- [Eloquent JavaScript is my go to reference](http://eloquentjavascript.net/03_functions.html)
- Built in [Atom.io](https://atom.io/) with quick [reloads](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) and [lots of color choices](http://coolors.co/app/)
