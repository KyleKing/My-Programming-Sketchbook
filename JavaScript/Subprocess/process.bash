# Repeat sending a command to Hammerspoon
# Source: http://stackoverflow.com/a/17350229/3219667
for x in {1..20} ; do
	# # If you have Hammerspoon installed:
	# /usr/local/bin/hs -c "AlertUser('STILL RUNNING!')"
	# More universal: make the computer repeatably beep
	tput bel
	sleep 0.5
done
