local Utility = require("Utility")

print('')
print('>> Loading Window Tiling for:')
print('   mash + Y,U,I and 4 arrow keys')

--------------------------------------------------
-- Window Tiling
--------------------------------------------------
hs.window.animationDuration = 0

local Tiling = {}

-- Alternatively, use the grid function
	-- docs » hs.grid http://www.hammerspoon.org/docs/hs.grid.html
function Tiling.MoveWindow ( WidthOffset, HeightOffset, WidthModifier, HeightModifier, win )
	local f = win:frame()
	local screen = win:screen()
	local max = screen:frame()

	-- Determine start coordinates
	if (WidthOffset == 0) or Utility.isEmpty(WidthOffset) then
		f.x = max.x
	else
		f.x = max.x + (max.w * WidthOffset)
	end
	if (HeightOffset == 0) or Utility.isEmpty(HeightOffset) then
		f.y = max.y
	else
		f.y = max.y + (max.h * HeightOffset)
	end
	-- Determine width/height coordinates
	f.w = max.w * WidthModifier
	f.h = max.h * HeightModifier
	win:setFrame(f)
end

function AdjustWindow( WidthOffset, HeightOffset, WidthModifier, HeightModifier )
  if hs.window.focusedWindow() then
		local win = hs.window.focusedWindow()
		Tiling.MoveWindow ( WidthOffset, HeightOffset, WidthModifier, HeightModifier, win )
	else
		hs.alert.show("No active window")
  end
end

--
-- Common Window Movements
--
-- Arrow Key Options for Quad-Grid ("Tri")
hs.hotkey.bind(Utility.mash, "Left", function()
 AdjustWindow(0, 0, 1/2, 1)
end)
hs.hotkey.bind(Utility.mash, "Right", function()
 AdjustWindow(1/2, 0, 1/2, 1)
end)
-- Mini Window Layout:
hs.hotkey.bind(Utility.mash, "Up", function()
 AdjustWindow(1/2, 0, 1/2, 1/2)
end)
hs.hotkey.bind(Utility.mash, "Down", function()
 AdjustWindow(1/2, 1/2, 1/2, 1/2)
end)

-- Legacy Mjolnir Commands
hs.hotkey.bind(Utility.mash, "y", function()
 AdjustWindow(0, 0, 10/12, 1)
end)
hs.hotkey.bind(Utility.mash, "u", function()
 AdjustWindow(0, 0, 1, 1)
end)
hs.hotkey.bind(Utility.mash, "i", function()
 AdjustWindow(1/12, 0, 11/12, 1)
end)

return Tiling
