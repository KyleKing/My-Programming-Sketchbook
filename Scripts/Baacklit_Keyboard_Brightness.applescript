property brightnessLevel : 0.25

ChangeBrightness(brightnessLevel) --Set this value between 0 and 1 to adjust brightness

if brightnessLevel is 0.25 then
	set brightnessLevel to 0.5
else
	set brightnessLevel to 0.25
end if

on ChangeBrightness(BrightnessValue)
	tell application "System Preferences"
		--activate
		set current pane to pane "com.apple.preference.displays"
	end tell
	tell application "System Events" to tell process "System Preferences"

		tell radio button "Display" of tab group 1 of window 1 to if value is 0 then
			repeat until value is 1
				click
			end repeat
		end if


		tell slider 1 of group 1 of tab group 1 of window 1 to set value to BrightnessValue
	end tell


	tell application "System Preferences" to quit
end ChangeBrightness
