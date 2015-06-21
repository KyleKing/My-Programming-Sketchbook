A Better Web Clock
===================

I'm not a huge fan of the WebClock interface and would often mistake clocking in and clocking out. After adding a bit of logic inside my first Chrome extension, only the button I want is visible.

## The things to be developed:
1. ~~Add option to manually override synced status~~
1. Stylize the [buttons](http://cssdeck.com/labs/beautiful-flat-buttons) and probably the whole page, while I'm at it
1. [Upload to the chrome web store](https://developer.chrome.com/webstore/publish)
1. Return link to return to the time sheets page?

## References
> This was my first extension after all

- Built with [Bootstrap-Switch](http://www.bootstrap-switch.org/), Bootstrap, jQuery, and plenty of guides
- This guide got me started by [Carl Topham](https://carl-topham.com/theblog/post/creating-chrome-extension-uses-jquery-manipulate-dom-page/) (Note: make sure to see his update at the bottom with fixes for Manifest Version 2)
- Described as overkill, but turned out to be perfect for this application. A hide_text function was copied from [TJ Crowder's extensive answer](http://stackoverflow.com/questions/5824091/jquery-hiding-text-only-in-h2-block-not-background)
- The blue clock icon is from [this article](http://webdesign.tutsplus.com/articles/making-web-icons-smarter--webdesign-15586)
- [Eloquent JavaScript is my go to reference](http://eloquentjavascript.net/03_functions.html)
- Built in [Atom.io](https://atom.io/) with quick [reloads](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)
