-- Fetch a list of all tabs titles and corresponding URLs from any open Chrome window
-- Format that output into an object that is returned as a string:
-- Returns:
-- {
	-- tab_titles: ["str", "str", etc.]
	-- tab_URLs: ["str", "str", etc.]
-- }

-- Init:
set JSON to "{"
set tab_titles to "\"tab_titles\": ["
set tab_URLs to "\"tab_URLs\": ["
set firstTerm to true

-- List tab titles in Google Chrome windows to determine current song playing
-- Inspiration: https://gist.github.com/dblandin/4659973
tell application "Google Chrome"
	set window_list to every window

	repeat with the_window in window_list
		set tab_list to every tab in the_window

		repeat with the_tab in tab_list
			set the_URL to the URL of the_tab
-- Remove apostrophes (34), quotes (39), and slashes (escape characters) (92)
-- Character ID appears to be: UTF-16 (decimal)
-- Used: http://www.fileformat.info/search/google.htm for character codes
set AppleScript's text item delimiters to {return & linefeed, linefeed, return, character id 34, character id 39, character id 92}
set the_URL_new to text items of the_URL
set AppleScript's text item delimiters to {"!"}
set the_URL_new to the_URL_new as text
			set the_title to the title of the_tab
-- Remove apostrophes:
set AppleScript's text item delimiters to {return & linefeed, linefeed, return, character id 34, character id 39, character id 92}
set the_title_new to text items of the_title
set AppleScript's text item delimiters to {"!"}
set the_title_new to the_title_new as text
			set delim to ", "
			if firstTerm is true then
				set tab_URLs to tab_URLs & "\"" & the_URL_new & "\""
				set tab_titles to tab_titles & "\"" & the_title_new & "\""
				set firstTerm to false
			else
				set tab_URLs to tab_URLs & delim & "\"" & the_URL_new & "\""
				set tab_titles to tab_titles & delim & "\"" & the_title_new & "\""
			end if
		end repeat

	end repeat
	set JSON to "{" & tab_titles & "], " & tab_URLs & "]}"
	return JSON
end tell
