-- Symlinked into ~/Library/Services/ dir to be run as an Apple Service
-- [Inspired by this guide](http://www.makeuseof.com/tag/3-tools-unleash-mac-os-menu-bar/)

to conditionalclose(application_name)
	tell application application_name
		if it is running then
			quit
			return "Quit " & application_name
		else
			-- 	display dialog "Already quit  " & application_name
			return "Already quit " & application_name
		end if
	end tell
	delay 0.4
end conditionalclose

-- Close KYA and sleep the computer
conditionalclose("KeepingYouAwake")
tell application "Finder" to sleep
