-- Toggle Notification Center's DND on Yosemite
-- Base on [Zettt's Gist](https://gist.github.com/Zettt/fd9979100d4603e548d6)
tell application "System Events"
	option key down
	delay 0.1
	
	try
		# Turn Do Not Disturb on
		click menu bar item "Notification Center" of menu bar 2 of application process "SystemUIServer"
	end try
	try
		# Turn Do Not Disturb off
		click menu bar item "NotificationCenter, Do Not Disturb enabled" of menu bar 2 of application process "SystemUIServer"
	end try
	
	option key up
	beep
end tell
