CrocDoc FullScreen
===================
> Canvas has a great set of tools for editing, but viewing feedback is challenging...set the croc doc iframe free with this automatic redirect.

The app searches for an iframe:

It will looks something like this:
```html
<iframe src="https://view-api.box.com/1/sessions/af8e02e7628544asdfasdfkljhasdf0828347/view" allowfullscreen="" data-reactid=".0.1"></iframe>
```
Try looking for it yourself.

But what if there was something that on request would automatically open the link in a new screen!
TaDa! This guy does it. Well maybe once Kyle gets around to coding and not working on his equally cool English assignment.


# From the [chrome webstore app page]
...TBDone

## The things to be developed:
1. Find iframe link with jQuery
1. Redirect page to new tab
1. Store list of recent links and display the last 5?

## References
> How the app was built

- Built with Bootstrap, jQuery, and plenty of guides
- [Eloquent JavaScript is my go to reference](http://eloquentjavascript.net/03_functions.html)
- It always helps to know where the [invisible background page is](http://stackoverflow.com/questions/10257301/where-to-read-console-messages-from-background-js-in-a-chrome-extension)
- Built in [Atom.io](https://atom.io/) with quick [reloads](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) and [lots of color choices](http://coolors.co/app/)
