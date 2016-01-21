

-- -- Only seems to work when called from terminal:
-- -- open -g hammerspoon://someAlert
-- hs.urlevent.bind("someAlert", function(eventName, params)
--     hs.alert.show("Received someAlert")
-- end)
-- IPC module is better

--------------------------------------------------
-- Things that didn't work
--------------------------------------------------

-- Shows little icons and allows you to press a letter to
-- switch between screens on the same page
-- Doesn't seem that useful and bad UI
-- hs.hotkey.bind(Utility.mash, "p", function()
-- 	-- hs.alert.show('hint?')
-- 	hs.hints.windowHints(nil)
-- end)


-- -- Not for spaces:
-- hs.hotkey.bind(Utility.mash, "p", function()
-- 	hs.window.focusedWindow():moveOneScreenEast()
-- 	hs.alert.show('Attempt')
-- end)