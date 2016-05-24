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
			set the_title to the title of the_tab
			set delim to ", "
			if firstTerm is true then
				set tab_URLs to tab_URLs & "\"" & the_URL & "\""
				set tab_titles to tab_titles & "\"" & the_title & "\""
				set firstTerm to false
			else
				set tab_URLs to tab_URLs & delim & "\"" & the_URL & "\""
				set tab_titles to tab_titles & delim & "\"" & the_title & "\""
			end
		end repeat

	end repeat
	set JSON to "{" & tab_titles & "], " & tab_URLs & "]}"
	return JSON
end tell
