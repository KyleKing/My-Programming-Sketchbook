# Based on [Stack Overflow Answer](http://stackoverflow.com/questions/3690167/how-can-one-invoke-a-keyboard-shortcut-from-within-an-applescript)
tell application "Safari" to activate
tell application "System Events"
	keystroke "t" using command down
end tell

tell application "System Events"
	keystroke "e" using {command down, option down, control down}
end tell
