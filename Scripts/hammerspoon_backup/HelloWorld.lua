--------------------------------------------------
-- Basic Guide (http://www.hammerspoon.org/go/)
--------------------------------------------------

local Utility = require("Utility")

function AlertUser(term)
  hs.alert.show(term)
end
-- AlertUser("it works")

-- -- Basic Hello World:
-- hs.hotkey.bind({"cmd", "alt", "ctrl"}, "W", function()
--   hs.alert.show("Hello World!")
-- end)

-- -- Hello World with native OSX notifications:
-- hs.hotkey.bind(Utility.mash, "W", function()
--   hs.notify.new({title="Hammerspoon", informativeText="Hello World"}):send()
-- end)

-- Reload Configuration with Shortcut
function manualReload()
  hs.reload()
end
hs.hotkey.bind(Utility.mash, "r", manualReload)

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


--
--
-- Good example on interacting with a menu item in Safari to map to a shortcut
--
--
