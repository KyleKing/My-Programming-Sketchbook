-- --
-- -- Create logging tool for debugging
-- --
-- local log = hs.logger.new('mymodule','debug')
-- log.i('Initializing') -- will print "[mymodule] Initializing" to the console



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

