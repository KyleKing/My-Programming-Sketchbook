-- Symlinked into ~/Library/Services/ dir to be run as an Apple Service

-- Using "blueutil" installed at:
set blueutilpath to "/usr/local/bin/blueutil"
-- Might work? The blueutil API changed in version 2
set sb to (do shell script blueutilpath)
if "Power: 1" in sb then
	do shell script blueutilpath & " -p off"
	return "Bluetooth is now off"
else
	do shell script blueutilpath & " -p on"
	return "Bluetooth is now on"
end if
