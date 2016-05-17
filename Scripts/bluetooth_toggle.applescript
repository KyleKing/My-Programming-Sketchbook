-- Symlinked into ~/Library/Services/ dir to be run as an Apple Service

-- Using "blueutil" installed at:
set blueutilpath to "/usr/local/bin/blueutil"
-- Toggle Bluetooth off
set sb to last word of (do shell script blueutilpath & " status")
if sb is "on" then
	do shell script blueutilpath & " off"
	return "Bluetooth is now off"
else
	do shell script blueutilpath & " on"
	return "Bluetooth is now on"
end if
