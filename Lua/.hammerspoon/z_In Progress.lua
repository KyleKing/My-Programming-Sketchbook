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
-- Watch for number of changes to a file? Or would Github be better?
	-- filesystem watchers: http://www.hammerspoon.org/docs/hs.fs.html
	-- Also this may make hardlinking files inside of a meteor package easier
-- Get location: docs » hs.location http://www.hammerspoon.org/docs/hs.location.html
-- Use one of the wifi watchers? http://www.hammerspoon.org/docs/hs.wifi.watcher.html
-- Get lux values using brightness module (i.e. how dark/bright is room?)
-- Communicate over URL from chrome extension to log url changes








-- -- From: https://gist.github.com/TwoLeaves/a9d226ac98be5109a226
-- -- Update the fan and temp. Needs iStats CLI tool from homebrew.
-- local function updateStats()
--   fanSpeed = os.capture("iStats fan speed | cut -c14- | sed 's/\\..*//'")
--   temp = os.capture("iStats cpu temp | cut -c11- | sed 's/\\..*//'")
-- end
-- -- Makes (and updates) the topbar menu filled with the current Space, the
-- -- temperature and the fan speed. The Space only updates if the space is changed
-- -- with the Hammerspoon shortcut (option + arrows does not work).
-- local function makeStatsMenu(calledFromWhere)
--   if statsMenu == nil then
--     statsMenu = hs.menubar.new()
--   end
--   if calledFromWhere == "spaceChange" then
--     currentSpace = tostring(spaces.currentSpace())
--   else
--     updateStats()
--   end
--   statsMenu:setTitle("Space " .. currentSpace)
--   -- statsMenu:setTitle("Space " .. currentSpace .. " | Fan: " .. fanSpeed .. " | Temp: " .. temp)
-- end
-- -- Gets a list of windows and iterates until the window title is non-empty.
-- -- This avoids focusing the hidden windows apparently placed on top of all
-- -- Google Chrome windows. It also checks if the empty title belongs to Chrome,
-- -- because some apps don't give any of their windows a title, and should still
-- -- be focused.
-- local function spaceChange()
-- 	-- print('currentSpace = '..currentSpace)
--   makeStatsMenu("spaceChange")
--   visibleWindows = hs.window.orderedWindows()
--   for i, window in ipairs(visibleWindows) do
--     if window:application():title() == "Google Chrome" then
--       if window:title() ~= "" then
--         window:focus()
--         break
--       end
--     else
--       window:focus()
--       break
--     end
--   end
-- end
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


-- On connect to an external display:
-- Watch for change in resolution
	-- docs » hs.screen.watcher - http://www.hammerspoon.org/docs/hs.screen.watcher.html
-- Watching a movie:
-- - Turn DnD on, After delay...turn brightness off, keyboard brightness?
-- Tools:
-- Delay/Timing: docs » hs.timer http://www.hammerspoon.org/docs/hs.timer.html
-- Mute: docs » hs.audiodevice http://www.hammerspoon.org/docs/hs.audiodevice.html
-- Brightness: docs » hs.brightness http://www.hammerspoon.org/docs/hs.brightness.html
	-- Turn brightness back up when done

--------------------------------------------------

-- Fix boom issue, on Boom close, change audio to defaults:
	-- docs » hs.audiodevice http://www.hammerspoon.org/docs/hs.audiodevice.html

--------------------------------------------------

-- RPI:
-- Manage network service order?
	-- docs » hs.usb.watcher http://www.hammerspoon.org/docs/hs.usb.watcher.html
	-- and get list of USB's http://www.hammerspoon.org/docs/hs.usb.html

--------------------------------------------------

-- Quick paste second item in clipboard?
	-- Save item in clipboard and cycle through a temporary variable
	-- Essentially a second clipboard bound to a special keypress (i.e. Utility.mash + v)
	-- docs » hs.pasteboard http://www.hammerspoon.org/docs/hs.pasteboard.html


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

-- - Reduce Sound Effect Volume when using headphones..

--------------------------------------------------

return WIP