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

to conditionalopen(application_name)
	tell application application_name
		if it is running then
			-- 	display dialog "Already running " & application_name
			return application_name & " is already open"
		else
			launch
			return "Opened " & application_name
		end if
	end tell
	delay 0.2
end conditionalopen

-- if you are not sure about the exact name, start "Activity Monitor" (e.g. search it with Spotlight)
-- and look up the "Process Name" (first column) in the list of running processes

-- Open apps if not open already:
conditionalopen("Sip")
conditionalopen("Dash")
conditionalopen("PopClip")
conditionalopen("Dropshelf")
conditionalopen("RescueTime")
conditionalopen("Flux")
conditionalopen("Numi")
-- Background Apps
conditionalopen("Snappy")
-- conditionalopen("Beautiful Earth")
-- conditionalopen("Satellite Eyes")
-- conditionalopen("Kuvva")
conditionalopen("Irvue")
conditionalopen("Rocket")
-- conditionalopen("Scroll Reverser")
-- conditionalopen("Micro Snitch")
-- conditionalopen("Forecast Bar")
conditionalopen("BetterTouchTool")
conditionalopen("EvernoteHelper")
-- conditionalopen("Hocus Focus")
-- conditionalopen("Focus")
-- conditionalopen("Boom")
conditionalopen("Bartender 2")
conditionalopen("Dropbox")
conditionalopen("Spotifree")
-- Background Apps ^



-- Debugging:

-- Use console to log timestamp and info to console upon error
-- to logit(log_string, log_file)
-- 	do shell script ¬
-- 		"echo `date '+%Y-%m-%d %T: '`\"" & log_string & ¬
-- 		"\" >> $HOME/Library/Logs/" & log_file & ".log"
-- end logit

-- Quit any unneccessary apps
conditionalclose("KeepingYouAwake")
conditionalclose("Kite")

-- TODO!
-- tell application "Finder" to sleep

-- Other method of printing results
set dateStamp to date string of (current date)
set timeStamp to time string of (current date)
return "This script was run on " & dateStamp & " at " & timeStamp
