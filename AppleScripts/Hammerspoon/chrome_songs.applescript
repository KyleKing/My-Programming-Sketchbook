-- MOTIV & NFCU by SCUP & ??

-- List tab titles in Google Chrome windows
-- original: https://gist.github.com/dblandin/4659973

-- Returning data from sub-routine:
-- Source: http://www.macosxautomation.com/applescript/sbrt/
-- on remove_extension(this_name)
-- 	if this_name contains "." then
-- 	set this_name to ¬
-- 	(the reverse of every character of this_name) as string
-- 	set x to the offset of "." in this_name
-- 	set this_name to (text (x + 1) thru -1 of this_name)
-- 	set this_name to (the reverse of every character of this_name) as string
-- 	end if
-- 	return this_name
-- end remove_extension

-- Format output:
set stdOut to "
"

-- Only chrome because this is meant to work alongside the Streamkeys chrome extension
tell application "Google Chrome"
	set window_list to every window -- get the windows

	repeat with the_window in window_list -- for every window
		set tab_list to every tab in the_window -- get the tabs

		repeat with the_tab in tab_list -- for every tab
			-- Make output accessible from Hammerspoon
			set the_URL to the URL of the_tab
			set the_title to the title of the_tab
			-- Identify the correct tab:
			-- --------------------
			-- Old method:
			-- set AppleScript's text item delimiters to "soundcloud.com"
			-- set match to text item 1 of the_URL
			-- if match is "https://" or match is "https://www." or match is "http://" or match is "http://www." then
			-- 	set stdOut to the title of the_tab
			-- 	do shell script "echo " & quoted form of stdOut
			-- 	-- -- Parse the tab title:
			-- 	-- set the_title to the title of the_tab
			-- 	-- set AppleScript's text item delimiters to " by "
			-- 	-- set song to text item 1 of the_title
			-- 	-- say song -- for troubleshooting
			-- 	-- set artist to text item 2 of the_title
			-- 	-- say artist -- for troubleshooting
			-- end if
			-- --------------------
			-- New Method
			if the_URL contains "soundcloud.com" then
				set stdOut to stdOut & the_title & "*%*%*%*"
			else if the_URL contains "spotify.com" then
				set stdOut to stdOut & the_title & "*%*%*%*"
			else if the_URL contains "pandora.com" then
				set stdOut to stdOut & the_title & "*%*%*%*"
			end if
		end repeat
	end repeat
end tell

-- Clever idea: http://stackoverflow.com/a/15605567/3219667
do shell script "echo " & quoted form of stdOut
