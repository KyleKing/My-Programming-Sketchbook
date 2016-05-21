-- Accept user input via a dialog with two buttons
set prompt to display dialog "Turn internet sharing on?" buttons {"Yes", "No"} default button 1
set answer to button returned of prompt

if answer is equal to "Yes" then
	-- -- Note: Need path to internetSharing.scpt file (inside My-Programming-Sketchbook/Applescripts/Hammerspoon/compiled/)
	-- -- turn internet sharing on
	-- do shell script "osascript InternetSharing.scpt on"
	say answer as string
	delay 1
else if answer is equal to "No" then
	-- -- turn internet sharing off
	-- do shell script "osascript InternetSharing.scpt off"
	say answer as string
	delay 1
end if
