# My Applescripts

## Really Easy Applescript Compiler

*`compile.sh`* - recursively searches through all subfolders to compile the `.applescript` files in binary, `.scpt` files that can be run as applescripts. This allows the `.applescript` files to be stored as plain text and put under git version control. In combination with a Hammerspoon file watcher, the shell script is run on any `.applescript` file change.

`runScriptFrom.py` - when Hammerspoon was causing issues with compile.sh, I tried calling a python script to call a shell script. It turned out to be an issue with working directory when Hammerspoon called the file (i.e. `~/.hammerspoon/` vs. `/the/actual/path/Applescripts/`)

## Folder: Examples

A few examples of ways to use applescripts, such as create a dialog for input, accept arguments from a shell script (`echo`), work with hotkeys, run loops, and create a log file.

## Folder: Hammerspoon

All of my actively used Applescripts: toggle bluetooth, toggle internet sharing, and selectively quit/open files.

## Folder: Dev

Possibly working files, not really sure about these ones (WIP)
