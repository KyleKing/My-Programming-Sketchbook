ELMS and CrocoDoc FullScreen
===================
> Canvas has a great set of tools for editing, but everything is trapped in a tiny view. This extension just directly opens the feedback in the same window, full screen!

# From the [chrome webstore app page]
Canvas has a great set of tools for editing (CrocoDoc), but everything is trapped in a tiny view. You can manually inspect the source code of the page and open the feedback form in a new tab; however, this extension does it for you. The extension changes the link of the "View Feedback" button to open the document in the same page or by clicking the arrow in a new tab.

If you are looking for an alternative option to open any iframe in a new tab, see Open Frame at: https://chrome.google.com/webstore/detail/open-frame/kdhjgkkaacdhdioocfbpmhjidbinfajj

## The things to be developed:
1. ~~Find iframe link with jQuery~~
1. ~~Redirect page to new tab~~
1. Store list of recent links and display the last 5? Bookmarks for documents? [guide](https://developer.chrome.com/extensions/browserAction)
1. Connect to the Canvas API and send a notification when you receive feedback?

## References
> How the app was built

- Built with Bootstrap, jQuery, and plenty of guides
- Sometimes it helps to return to the [fundamentals](http://jqfundamentals.com/chapter/jquery-basics)
- [Eloquent JavaScript is my go to reference](http://eloquentjavascript.net/03_functions.html)
- This [StackOverflow](http://stackoverflow.com/a/4990263/3219667) answer helped overcome a small bug with font awesome
- It always helps to know where the [invisible background page is](http://stackoverflow.com/questions/10257301/where-to-read-console-messages-from-background-js-in-a-chrome-extension)
- Built in [Sublime](https://atom.io/) with quick [reloads](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) and [lots of color choices](http://coolors.co/app/)
