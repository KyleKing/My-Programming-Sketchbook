local Utility = require("Utility")
local Tiling = require("windowTiling")

print('')
print('>> Loading Peripheral Events for:')
print('		Proscope and Ethernet USBWatching')

-- USB Watcher for Proscope Application
local usbWatcher = nil
function usbDeviceCallback(data)
	Utility:printTables(data)
	-- Turn on Internet sharing for Raspberry Pi development
	if (data["productName"] == "Apple USB Ethernet Adapter") then
		if (data["eventType"] == "added") then
			print('Start internet sharing')
			os.execute('osascript ~/Library/Services/InternetSharing.scpt on')
		elseif (data["eventType"] == "removed") then
			print('stop Internet sharing')
			os.execute('osascript ~/Library/Services/InternetSharing.scpt off')
		end
	end
	-- Turn on microscope software when USB camera connected
  if (data["productName"] == "Venus USB2.0 Camera") then
		if (data["eventType"] == "added") then
			hs.application.open("Proscope HR")
			-- Wait for application to open and move aside
			local win = nil
			while win == nil do
				win = hs.window('Proscope')
				if not Utility:isEmpty(win) then
					Tiling.MoveWindow ( 0, 0, 10/12, 1, win )
				end
			end
		elseif (data["eventType"] == "removed") then
			-- Quit Proscope HR App
			local app = hs.window('Proscope')
			if not Utility:isEmpty(app) then
				app = app:application()
				app:kill()
			end
		end
  end
end
usbWatcher = hs.usb.watcher.new(usbDeviceCallback)
usbWatcher:start()

-- For testing
hs.hotkey.bind(Utility.mash, "t", function()

	-- local win = hs.window.frontmostWindow()
	-- print(win:title())
	-- local app = hs.window('Proscope')
	-- print(app:name())
end)

