# A Better Web Clock

I'm not a huge fan of my employer's web clock interface and would often mistake clocking in and clocking out. Adding a bit of logic inside my first Chrome extension, only the button I want is visible.

# The things to be developed:
1. Add option to manually override synced status
1. Stylize the [buttons](http://cssdeck.com/labs/beautiful-flat-buttons) and probably the whole page, while I'm at it
1. [Upload to the chrome web store](https://developer.chrome.com/webstore/publish)
1. Return link to return to the main page?

# References
> This was my first extension after all

- This guide got me started by [Carl Topham](https://carl-topham.com/theblog/post/creating-chrome-extension-uses-jquery-manipulate-dom-page/) make sure to see his update at the bottom with fixes for Manifest Version 2
- Described as overkill, but turned out to be perfect for this application. A hide_text function was copied from [TJ Crowder's extensive answer](http://stackoverflow.com/questions/5824091/jquery-hiding-text-only-in-h2-block-not-background)
- The icon is from [this wonderful article](http://webdesign.tutsplus.com/articles/making-web-icons-smarter--webdesign-15586)
- [Eloquent Javascript is my go to reference](http://eloquentjavascript.net/03_functions.html)
- Built in [Atom.io](https://atom.io/) with quick [reloads](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)
