# My Hammerspoon Config

Hammerspoon is a great utility to simplify really mundane, but useful things. For example, I have multiple applications (iTunes, Spotify, and Streamkeys - for chrome) that expect input using the <kbd>f7</kbd> (Rewind), <kbd>f8</kbd> (Play/Pause), and <kbd>f9</kbd> (Fast forward) keys. Usually Spotify is the lowest in this hierarchy, so I would have to manually change songs; however with Hammerspoon, there is a really easy alternative to map the commands to a second set of shortcut keys -> [read the code here](https://github.com/KyleKing/My-Programming-Sketchbook/blob/master/Lua/.hammerspoon/MacUtilities.lua#L20-L41).

I've been working on using Alfred to trigger functions, to learn more about my progress, visit [my alfred-specific folder of this repo](https://github.com/KyleKing/My-Programming-Sketchbook/master/Alfred). I'm also working on a time logger, simliar to rescuetime, but that is way less developed.

## Rundown of the included Files

- ```HelloWorld.lua```: My notes as I followed the getting started guide
- ```MacUtilities.lua```: Useful utilities for battery watching, spotify, and dot files, with more to come
- ```Utility.lua```: Set of functions used across this app, such as printing proper JSON
	- ```dkjson.lua```: module used within ```Utility.lua```
- ```init.lua```: An index file that triggers successive files to be run and includes the AlfredFunction()
- ```windowTiling.lua```: The most essential of all the shortcuts
- ```z_In Progress.lua```: Mostly notes and functions that may work!
- ```z_debugging.lua```: Playing around with some debugging utilities, but haven't really used
