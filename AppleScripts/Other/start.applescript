do shell script "open focus://focus?minutes=25"

# if appplication running, quit KYA. Wait a moment to fully close. Then regardless of status, open the now "closed" app and trigger the aforementioned setting,  "Activate on Launch."

tell application "KeepingYouAwake"
	if it is running then
		quit
		set status to "reactivated."
	else
		set status to "activated."
	end if
	
	delay 0.01 # allow KYA to close, don't blink!
	launch # always launch
	
	set output to "KeepingYouAwake has been " & status
	
	return output
	
end tell

# Turn Do Not Disturb On
do shell script "defaults -currentHost write ~/Library/Preferences/ByHost/com.apple.notificationcenterui doNotDisturb -boolean true"
set theDate to quoted form of (do shell script "date -u +\"%Y-%m-%d %H:%M:%S +0000\"")
do shell script "defaults -currentHost write ~/Library/Preferences/ByHost/com.apple.notificationcenterui doNotDisturbDate -date " & theDate
do shell script "killall NotificationCenter"

delay 1
beep
