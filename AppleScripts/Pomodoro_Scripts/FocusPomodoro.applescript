--
-- Start/Break End/Interrupt End
--

-- Open Focus for 25 minutes (will also be shut off by timer if needed)
do shell script "open focus://focus?minutes=25"

-- Toggle KYA
-- If KYA running, quit. Wait a moment to fully close. Then regardless of status, open the now "closed" app and trigger the aforementioned setting,  "Activate on Launch."
tell application "KeepingYouAwake"
  if it is running then
    quit
    set status to "reactivated."
  else
    set status to "activated."
  end if
  delay 0.01 -- allow KYA to close, don't blink!
  launch -- always launch
end tell

-- Doesn't work for Yosemite:
-- -- Turn Do Not Disturb on
-- -- Base on [Zettt's Gist](https://gist.github.com/Zettt/fd9979100d4603e548d6)
-- tell application "System Events"
--   option key down
--   delay 0.1
--   try
--     click menu bar item "Notification Center" of menu bar 2 of application process "SystemUIServer"
--   end try
--   option key up
--   beep
-- end tell
-- Toggle Notification Center's DND on Yosemite
-- Base on [Zettt's Gist](https://gist.github.com/Zettt/fd9979100d4603e548d6)

-- tell application "System Events"
--   option key down
--   delay 0.1

--   try
--     # Turn Do Not Disturb on
--     click menu bar item "Notification Center" of menu bar 2 of application process "SystemUIServer"
--   end try
--   try
--     # Turn Do Not Disturb off
--     click menu bar item "NotificationCenter, Do Not Disturb enabled" of menu bar 2 of application process "SystemUIServer"
--   end try

--   option key up
--   beep
-- end tell

-- tell application "System Events"
--   tell process "Notification Center"
--     key down option
--     -- Triggers text
--     -- click second menu bar's first menu bar item
--     key up option
--   end tell
-- end tell


--
-- End/interrupt
--

-- Turn Focus off  and open free access to internet
do shell script "open focus://unfocus"

-- If KYA running, quit. Wait a moment to fully close
tell application "KeepingYouAwake"
  if it is active then
    quit
    set status to "deactivated."
  else
    set status to "still active."
  end if
end tell

-- Turn Do Not Disturb off
-- Base on [Zettt's Gist](https://gist.github.com/Zettt/fd9979100d4603e548d6)
tell application "System Events"
  option key down
  delay 0.1
  try
    click menu bar item "NotificationCenter, Do Not Disturb enabled" of menu bar 2 of application process "SystemUIServer"
  end try
  option key up
  beep
end tell


--
-- Random
--

-- Based on [Stack Overflow Answer](http://stackoverflow.com/questions/3690167/how-can-one-invoke-a-keyboard-shortcut-from-within-an-applescript)
tell application "Safari" to activate
tell application "System Events"
  keystroke "t" using command down
end tell

tell application "System Events"
  keystroke "e" using {command down, option down, control down}
end tell