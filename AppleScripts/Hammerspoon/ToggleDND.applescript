on run {arg}
	if (arg is "on") then
		-- Turn Do Not Disturb On
		do shell script "defaults -currentHost write ~/Library/Preferences/ByHost/com.apple.notificationcenterui doNotDisturb -boolean true"
		set theDate to quoted form of (do shell script "date -u +\"%Y-%m-%d %H:%M:%S +0000\"")
		do shell script "defaults -currentHost write ~/Library/Preferences/ByHost/com.apple.notificationcenterui doNotDisturbDate -date " & theDate
		do shell script "killall NotificationCenter"
	else
		-- Turn Do Not Disturb Off
		do shell script "defaults -currentHost write ~/Library/Preferences/ByHost/com.apple.notificationcenterui doNotDisturb -boolean false"
		try
			do shell script "defaults -currentHost delete ~/Library/Preferences/ByHost/com.apple.notificationcenterui doNotDisturbDate"
		end try
		do shell script "killall NotificationCenter"
	end if
end run