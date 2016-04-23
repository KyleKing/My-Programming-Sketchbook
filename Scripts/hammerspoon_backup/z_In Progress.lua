local Utility = require("Utility")
local WIP = {}

--------------------------------------------------
-- WIP
--------------------------------------------------

--------------------------------------------------
-- Time Tracking
--------------------------------------------------

-- hs.uielement.focusedElement()

-- hs.hotkey.bind(Utility.mash, "p", function()
-- 	local kyle = hs.uielement.focusedElement()
-- 	hs.alert.show(kyle)
-- end)


-- Fails?
-- hs.hotkey.bind(Utility.mash, "p", function()
-- 	local AppTitle = hs.application:title()
-- 	hs.alert.show(AppTitle)
-- end)

--------------------------------------------------

-- Activity Logger
-- Critical:
-- Time events
	-- docs » hs.timer http://www.hammerspoon.org/docs/hs.timer.html
-- Get application name, window title, etc.

-- -- React to application events
-- function applicationWatcher(appName, eventType, appObject)
-- 		-- hs.alert.show(appName)
-- 		-- hs.alert.show('eventType: '..eventType) -- number (concatenate to become string)
-- 		print('appObject from application watcher:')
-- 		print(appObject:title())
-- 		print(appObject)
-- 		print('--------------')
-- 		print('Event driven parse:')
-- 	  print('application: '..hs.window.focusedWindow():application():title())
-- 	  print('title: '..hs.window.focusedWindow():title())
-- 	  print('id: '..hs.window.focusedWindow():id())
-- 	  print('role: '..hs.window.focusedWindow():role())
-- 	  print('subrole: '..hs.window.focusedWindow():subrole())
-- 	  print('visibleWindows(): ')
-- 	  -- Source: https://coronalabs.com/blog/2014/09/02/tutorial-printing-table-contents/
-- 	  for k, v in pairs( hs.window.visibleWindows() ) do
-- 		   print(k, v)
-- 		end
-- 		print('==============================')

-- 		-- check if application activate event (vs. close?)
-- 		if (eventType == hs.application.watcher.activated) then
-- 				-- hs.alert.show(appName)
-- 				-- -- if (appName == "Finder") then
-- 				-- -- 		-- Bring all Finder windows forward when one gets activated
-- 				-- -- 		appObject:selectMenuItem({"Window", "Bring All to Front"})
-- 				-- -- end
-- 		end
-- end
-- local appWatcher = hs.application.watcher.new(applicationWatcher)
-- -- appWatcher:start()

-- -- Keep working on this:
-- -- http://www.hammerspoon.org/docs/hs.uielement.html
-- -- Necessary for watching for change in application title
-- -- http://www.hammerspoon.org/docs/hs.uielement.watcher.html
-- hs.hotkey.bind(Utility.mash, "p", function()
-- 	print('*********************')
-- 	print('UI focusedElements')
-- 	print(hs.uielement.focusedElement():isApplication())
-- 	print(hs.uielement.focusedElement():isWindow())
-- 	print('role'..hs.uielement.focusedElement():role())
-- 	-- print('title'..hs.uielement.focusedElement():title())
-- 	if hs.uielement.focusedElement():selectedText() then
-- 		print('selectedText'..hs.uielement.focusedElement():selectedText())
-- 	else
-- 		print('No access to selectedText')
-- 	end

-- 	print('*********************')
-- end)


-- Cool:
-- Get location: docs » hs.location http://www.hammerspoon.org/docs/hs.location.html
-- Get lux values using brightness module (i.e. how dark/bright is room?)
-- Communicate over URL from chrome extension to log url changes


--------------------------------------------------


-- -- Unsupported Spaces extension. Uses private APIs but works okay.
-- -- (http://github.com/asmagill/hammerspoon_asm.undocumented)
-- -- Make sure to download release and unarchive:
-- -- Source: https://github.com/asmagill/hs._asm.undocumented.spaces
-- spaces = require("hs._asm.undocumented.spaces")

-- hs.hotkey.bind(Utility.mash, '1', function()
-- 	-- print(spaces.debug.layout())
--   spaces.moveToSpace("1")
--   spaceChange()
-- end)
-- hs.hotkey.bind(Utility.mash, '4', function()
-- 	-- print(spaces.debug.layout())
--   spaces.moveToSpace("4")
--   spaceChange()
-- end)
-- currentSpace = tostring(spaces.currentSpace())


--------------------------------------------------





-- -- Playing around with windows:
-- -- Example Code: https://gist.github.com/asmagill/633c8515e6ace3335d31

-- local windowGoogle = hs.webview.new( {x = 50, y = 50,h = 500, w = 900} )
--                         :url('http://inbox.google.com')
--                         :allowGestures(true)
--                         :allowTextEntry(true)
--                         :windowTitle('TestWindow')
--                         :windowStyle(15)
--                         :deleteOnClose(true)
--                         :show()

-- -- Appears to only be odd numbers:
-- -- 1 - Basic Bar
-- -- 3 - Close button
-- -- 5 - Minimizable button
-- -- 7 - Close/Minimize
-- -- 9 - maximize button
-- -- 11 - Close/Maximize buttons
-- -- 13 - Min/Max buttons
-- -- 15 - all three buttons

-- -- :title('TestWindow')
-- -- hs.webview.windowMasks[] -> utility
-- hs.hotkey.bind(Utility.mash, "h", function()
-- 	windowGoogle:delete()
-- end)



--------------------------------------------------




-- -- Create a Caffeine clone (i.e. interactive menu bar icon)
-- Finish Keeping You Awake Replacement
-- http://www.hammerspoon.org/docs/hs.caffeinate.html
-- local caffeine = hs.menubar.new()
-- function setCaffeineDisplay(state)
--     if state then
--         caffeine:setTitle("AWAKE")
--         -- caffeine:setIcon()
--     else
--         caffeine:setTitle("SLEEPY")
--         -- caffeine:setIcon()
--     end
-- end
-- function caffeineClicked()
--     setCaffeineDisplay(hs.caffeinate.toggle("displayIdle"))
-- end
-- if caffeine then
--     caffeine:setClickCallback(caffeineClicked)
--     setCaffeineDisplay(hs.caffeinate.get("displayIdle"))
-- end


--------------------------------------------------

-- Simple way to keep track of all available shortcut keys:
-- http://www.hammerspoon.org/docs/hs.hotkey.html#showHotkeys

--------------------------------------------------

-- HTTP Requests? IFTTT integration?
-- http://www.hammerspoon.org/docs/hs.http.html

--------------------------------------------------

-- Any bar icon
-- Make sure it is open, then change color by sending info to the UDP port:
-- echo -n "red" | nc -u localhost 1738
-- Should be:
-- echo -n "black" | nc -4u -w0 localhost 1738
-- But couldn't get it to work
-- Applescript:
-- ok,result = hs.applescript('tell application "AnyBar" to set image name to "question"')
-- Main link: https://github.com/tonsky/AnyBar
-- Node options:
-- Good: https://github.com/rumpl/nanybar
-- Best: https://github.com/sindresorhus/anybar

--------------------------------------------------


-- On connect to an external display:
-- Watch for change in resolution
	-- docs » hs.screen.watcher - http://www.hammerspoon.org/docs/hs.screen.watcher.html
-- Control screen brightness for watching a movie or other service on a larger monitor:
function WIP.ToggleBrightness()
	local brightness = hs.brightness.get()
	if Utility.isEmpty(brightness) or brightness > 20 then
		Utility.Brightness('96', 0)
	else
		Utility.Brightness('97', 30)
	end
end
hs.hotkey.bind(Utility.mash, "t", function()
	local brightness = hs.brightness.get()
	if Utility.isEmpty(brightness) or brightness > 20 then
		Utility.Brightness('96', 0)
	else
		Utility.Brightness('97', 30)
	end
end)
-- Fix boom issue, on Boom close, change audio to defaults:
	-- docs » hs.audiodevice http://www.hammerspoon.org/docs/hs.audiodevice.html

--------------------------------------------------


return WIP