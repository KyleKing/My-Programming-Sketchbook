tell application "System Events"
	tell process "Notification Center"
		key down option
		# Triggers text
		# click second menu bar's first menu bar item
		key up option
	end tell
end tell
