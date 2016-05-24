-- MOTIV & NFCU by SCOPS & ??

-- Format output:
set JSArray to "["
set firstTerm to true

-- Chrome error on any subroutine:
-- error "Google Chrome got an error: Can’t continue createJSArray." number -1708
-- Failed subroutine?
-- on createJSArray(term)
-- 	-- set delim to "&&&&%"
-- 	-- set delim to "\\n"
-- 	-- set delim to return
-- 	set delim to ", "
-- 	if firstTerm is true then
-- 		set JSArray to JSArray & term
-- 		set firstTerm to false
-- 	else
-- 		set JSArray to JSArray & delim & term
-- 	end
--  return "true"
-- end createJSArray

-- Failed subroutine?
-- Example of complex logging: http://stackoverflow.com/a/21341372/3219667
-- on space_check(threshold_percentage)
-- 	log threshold_percentage
-- end space_check
-- space_check(20)

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

-- set AppleScript's text item delimiters to "soundcloud.com"
-- set match to text item 1 of the_URL
-- if match is "https://" then
	-- set the_title to "song name by artist group"
	-- set AppleScript's text item delimiters to " by "
	-- set song to text item 1 of the_title
	-- say song -- for troubleshooting
	-- set artist to text item 2 of the_title
	-- say artist -- for troubleshooting
-- end if

-- display dialog "The URL is: " & return & the_title buttons {"OK"} default button 1
-- set result to createJSArray(the_title)

-- -- Failed subroutine?
-- on space_check(threshold_percentage)
-- 	delay threshold_percentage
-- return "kyle"
-- end space_check

-- List tab titles in Google Chrome windows to determine current song playing
-- original: https://gist.github.com/dblandin/4659973
tell application "Google Chrome"
	set window_list to every window -- get the windows

	repeat with the_window in window_list -- for every window
		set tab_list to every tab in the_window -- get the tabs

		repeat with the_tab in tab_list -- for every tab
			-- Make output accessible from Hammerspoon/JS
			set the_URL to the URL of the_tab
			set the_title to the title of the_tab
			set delim to ", "
			if the_URL contains "soundcloud.com" then

				if firstTerm is true then
					set JSArray to JSArray & the_title
					set firstTerm to false
				else
					set JSArray to JSArray & delim & the_title
				end

			else if the_URL contains "spotify.com" then

				if firstTerm is true then
					set JSArray to JSArray & the_title
					set firstTerm to false
				else
					set JSArray to JSArray & delim & the_title
				end

			else if the_URL contains "pandora.com" then

				if firstTerm is true then
					set JSArray to JSArray & the_title
					set firstTerm to false
				else
					set JSArray to JSArray & delim & the_title
				end

			end if
		end repeat
	end repeat
	set JSArray to JSArray & "]"
	return JSArray
end tell

-- -- Echo for stdout idea: http://stackoverflow.com/a/15605567/3219667
-- do shell script "echo " & quoted form of JSArray
