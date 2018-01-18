on run {}
	tell application "System Preferences"
		activate
		-- Doesn't work?
		set the current pane to pane "com.apple.preferences.trackpad"
	end tell

	-- tell application "System Events"
	-- 	tell process "System Preferences"
	-- 		tell window "Sharing"
	-- 			delay 0.25
	-- 			set theCheckbox to checkbox 1 of row 7 of table 1 of scroll area 1 of group 1
	-- 			tell theCheckbox
	-- 				set checkboxStatus to value of theCheckbox as boolean
	-- 				if checkboxStatus is not true then click theCheckbox
	-- 			end tell
	-- 			click
	-- 			delay 0.25
	-- 			if (exists sheet 1) then
	-- 				if (exists button "Turn Wi-Fi On" of sheet 1) then
	-- 					click button "Turn Wi-Fi On" of sheet 1
	-- 				end if
	-- 				click button "Start" of sheet 1
	-- 			end if
	-- 		end tell
	-- 	end tell
	-- end tell

	-- tell application "System Preferences"
	-- 	quit
	-- end tell
end run
