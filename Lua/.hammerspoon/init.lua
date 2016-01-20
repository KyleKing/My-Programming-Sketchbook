-- Learn LUA quickly!
-- https://learnxinyminutes.com/docs/lua/

--------------------------------------------------
-- Initialize Variables
--------------------------------------------------

local json = require('dkjson')
local mash = {"ctrl", "alt", "cmd"}

--------------------------------------------------
-- Global Utility Functions
--------------------------------------------------

-- Source: http://stackoverflow.com/questions/19664666/check-if-a-string-isnt-nil-or-empty-in-lua
local function isEmpty(s)
  return s == nil or s == ''
end

-- Useful to send data from Hammerspoon to other applications
function printJSON(table)
	local ConvertedJSON = json.encode(table)
	-- Accounts for an array:
	print('{"wrapper":'..ConvertedJSON.."}")
end

-- Useful for debugging:
function printTables(table)
	if type(table) == 'table' then
	  for k, v in pairs( table ) do
		  print(k.."="..v)
		end
		print('-  End Table  -')
	else
		print('This table is not a table:')
		print(table)
	end
end
function printTablesInTables(table)
	if type(table) == 'table' then
		print('')
		print('---Start Multi-Table---')
	  for k, v in pairs( table ) do
		  printTables(v)
		end
		print('---End Multi-Table---')
		print('')
	else
		print('This multi-table is not a table:')
		print(table)
	end
end

-- --
-- -- Create logging tool for debugging
-- --
-- local log = hs.logger.new('mymodule','debug')
-- log.i('Initializing') -- will print "[mymodule] Initializing" to the console

--------------------------------------------------
-- Basic Guide (http://www.hammerspoon.org/go/)
--------------------------------------------------

-- -- Basic Hello World:
-- hs.hotkey.bind({"cmd", "alt", "ctrl"}, "W", function()
--   hs.alert.show("Hello World!")
-- end)

-- -- Hello World with native OSX notifications:
-- hs.hotkey.bind(mash, "W", function()
--   hs.notify.new({title="Hammerspoon", informativeText="Hello World"}):send()
-- end)

-- Reload Configuration with Shortcut
function manualReload()
  hs.reload()
end
hs.hotkey.bind(mash, "r", manualReload)

-- Automatically Reload Configuration:
function reloadConfig(files)
		doReload = false
		for _,file in pairs(files) do
				if file:sub(-4) == ".lua" then
						doReload = true
				end
		end
		if doReload then
				hs.reload()
		end
end
hs.pathwatcher.new(os.getenv("HOME").."/.hammerspoon/", reloadConfig):start()
hs.alert.show("Config loaded")

--------------------------------------------------
-- Window Tiling
--------------------------------------------------
hs.window.animationDuration = 0

-- Alternatively, use the grid function
	-- docs » hs.grid http://www.hammerspoon.org/docs/hs.grid.html
function AdjustWindow( WidthOffset, HeightOffset, WidthModifier, HeightModifier )
  if hs.window.focusedWindow() then
		local win = hs.window.focusedWindow()
		local f = win:frame()
		local screen = win:screen()
		local max = screen:frame()

		-- Determine start coordinates
		if WidthOffset == 0 then
			f.x = max.x
		else
			f.x = max.x + (max.w * WidthOffset)
		end
		if HeightOffset == 0 then
			f.y = max.y
		else
			f.y = max.y + (max.h * HeightOffset)
		end
		-- Determine width/height coordinates
		f.w = max.w * WidthModifier
		f.h = max.h * HeightModifier
		win:setFrame(f)
	else
		hs.alert.show("No active window")
  end
end

--
-- Common Window Movements
--
-- Arrow Key Options for Quad-Grid ("Tri")
hs.hotkey.bind(mash, "Left", function()
 AdjustWindow(0, 0, 1/2, 1)
end)
hs.hotkey.bind(mash, "Right", function()
 AdjustWindow(1/2, 0, 1/2, 1)
end)
-- Mini Window Layout:
hs.hotkey.bind(mash, "Up", function()
 AdjustWindow(1/2, 0, 1, 1/2)
end)
hs.hotkey.bind(mash, "Down", function()
 AdjustWindow(1/2, 1/2, 1, 1/2)
end)

-- Legacy Mjolnir Commands
hs.hotkey.bind(mash, "y", function()
 AdjustWindow(0, 0, 10/12, 1)
end)
hs.hotkey.bind(mash, "u", function()
 AdjustWindow(0, 0, 1, 1)
end)
hs.hotkey.bind(mash, "i", function()
 AdjustWindow(1/12, 0, 11/12, 1)
end)

----------------------------------------------------
-- Custom Alfred Triggers
--------------------------------------------------
-- Configure:
if ( hs.ipc.cliStatus() == false ) then
	hs.alert.show('Installing hammerspoon cli tool')
	hs.ipc.cliInstall()
end
-- Call by typing /usr/local/bin/hs -c 'hideFiles()' or just $ hs -c 'hideFiles()'

function AlfredFunctions()
	local sometable = {
		{
			["func_name"]="manualReload",
			["description"]="Reloads Hammerspoon",
			["icon"]='icon.png'
		},
		{
			["func_name"]="hideFiles",
			["description"]="Hides dot files",
			["icon"]='icon.png'
		},
		{
			["func_name"]="showFiles",
			["description"]="Shows dot files",
			["icon"]='/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/BookmarkIcon.icns'
		}
	};
	printJSON(sometable)
end
-- AlfredFunctions()


----------------------------------------------------
-- Functions Triggered by Alfred
--------------------------------------------------
-- Show or hide dot files
function hideFiles()
  -- alias hideFiles='defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app'
  ok,result = hs.applescript('do shell script "defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app"')
  hs.alert.show("Files Hid, like blazing sun hides enemy")
end
function showFiles()
  -- alias showFiles='defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app'
  ok,result = hs.applescript('do shell script "defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app"')
  hs.alert.show("Files Shown, like bright moon deceives enemy")
end

--------------------------------------------------
-- Macbook utilities
--------------------------------------------------

-- Basic Battery Watcher (Three additional examples are also available
-- (example code from: https://github.com/Hammerspoon/hammerspoon/issues/166#issuecomment-68320784)
pct_prev = nil
function batt_watch_low()
    pct = hs.battery.percentage()
    if pct ~= pct_prev and not hs.battery.isCharging() and pct < 22 then
        hs.alert.show(string.format(
        "Plug-in the power, only %d%% left!!", pct))
    end
    pct_prev = pct
end
hs.battery.watcher.new(batt_watch_low):start()


-- If iTunes is open, the play pause buttons can cause conflicts
-- Force Spotify to play using a set of override keys
hs.hotkey.bind(mash, 'b', function ()
	hs.spotify.previous()
end)
hs.hotkey.bind(mash, 'm', function ()
	hs.spotify.next()
end)
hs.hotkey.bind(mash, 'n', function ()
	hs.spotify.playpause()
end)

-- Custom display track/artist:
hs.hotkey.bind(mash, "j", function()
	-- hs.spotify.displayCurrentTrack()
	local track = hs.spotify.getCurrentTrack()
	hs.alert.show(track)
	local artist = hs.spotify.getCurrentArtist()
	if not isEmpty(artist) then
		hs.alert.show(artist)
	end
end)


--------------------------------------------------
--------------------------------------------------
-- WIP
--------------------------------------------------
--------------------------------------------------

-- hs.uielement.focusedElement()

-- hs.hotkey.bind(mash, "p", function()
-- 	local kyle = hs.uielement.focusedElement()
-- 	hs.alert.show(kyle)
-- end)


-- Fails?
-- hs.hotkey.bind(mash, "p", function()
-- 	local AppTitle = hs.application:title()
-- 	hs.alert.show(AppTitle)
-- end)


-- -- Only seems to work when called from terminal:
-- -- open -g hammerspoon://someAlert
-- hs.urlevent.bind("someAlert", function(eventName, params)
--     hs.alert.show("Received someAlert")
-- end)

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

-- hs.hotkey.bind(mash, '1', function()
-- 	-- print(spaces.debug.layout())
--   spaces.moveToSpace("1")
--   spaceChange()
-- end)
-- hs.hotkey.bind(mash, '4', function()
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
-- hs.hotkey.bind(mash, "h", function()
-- 	windowGoogle:delete()
-- end)

--------------------------------------------------


--
--
-- Good example on interacting with a menu item in Safari to map to a shortcut
--
--

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




--
--------------------------------------------------
-- What next?
--------------------------------------------------
--

-- On connect to an external display:
-- Watch for change in resolution
	-- docs » hs.screen.watcher - http://www.hammerspoon.org/docs/hs.screen.watcher.html
-- Two Use Cases:
-- Presenting to lab members
-- - Mute, Turn DnD on? Anything else?
-- Watching a movie:
-- - Turn DnD on, After delay...turn brightness off, keyboard brightness?
-- Tools:
-- Delay/Timing: docs » hs.timer http://www.hammerspoon.org/docs/hs.timer.html
-- Mute: docs » hs.audiodevice http://www.hammerspoon.org/docs/hs.audiodevice.html
-- Brightness: docs » hs.brightness http://www.hammerspoon.org/docs/hs.brightness.html
	-- Turn brightness back up when done

-- Maybe crazy?
	-- Send message if busy? http://www.hammerspoon.org/docs/hs.messages.html
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
	-- Essentially a second clipboard bound to a special keypress (i.e. mash + v)
	-- docs » hs.pasteboard http://www.hammerspoon.org/docs/hs.pasteboard.html
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
-- hs.hotkey.bind(mash, "p", function()
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
--------------------------------------------------
-- Simple way to keep track of all available shortcut keys:
-- http://www.hammerspoon.org/docs/hs.hotkey.html#showHotkeys
--------------------------------------------------
-- HTTP Requests? IFTTT integration?
-- http://www.hammerspoon.org/docs/hs.http.html
--------------------------------------------------
-- Remove multiple menubar icons when not needed (i.e. Drive, Dropbox, etc?)
-- Sort of a free and code-configured app?
-- http://www.hammerspoon.org/docs/hs.menubar.html#setTooltip
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
-- Get list of hammerspoon functions and then create custom workflows for user!
-- Essentially customized alfred task runner for Hammerspoon
--------------------------------------------------

--------------------------------------------------



--------------------------------------------------
-- Things that didn't work
--------------------------------------------------

-- Shows little icons and allows you to press a letter to
-- switch between screens on the same page
-- Doesn't seem that useful and bad UI
-- hs.hotkey.bind(mash, "p", function()
-- 	-- hs.alert.show('hint?')
-- 	hs.hints.windowHints(nil)
-- end)


-- -- Not for spaces:
-- hs.hotkey.bind(mash, "p", function()
-- 	hs.window.focusedWindow():moveOneScreenEast()
-- 	hs.alert.show('Attempt')
-- end)

