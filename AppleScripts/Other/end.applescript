# Turn off focus and open access to internet
do shell script "open focus://unfocus"

# Quit KYA
tell application "KeepingYouAwake"
	quit
end tell

# Turn DND Off
do shell script "defaults -currentHost write ~/Library/Preferences/ByHost/com.apple.notificationcenterui doNotDisturb -boolean false"
try
	do shell script "defaults -currentHost delete ~/Library/Preferences/ByHost/com.apple.notificationcenterui doNotDisturbDate"
end try
do shell script "killall NotificationCenter"

beep
