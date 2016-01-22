local Utility = require("Utility")

print('')
print('>> Loading Mac Utilities for:')
print('   Battery Watcher')
print('   Spotify')
print('   Dot Files')

--------------------------------------------------
-- Macbook utilities
--------------------------------------------------

local Mac = {}

-- Basic Battery Watcher (Three additional examples are also available
-- (example code from: https://github.com/Hammerspoon/hammerspoon/issues/166#issuecomment-68320784)
pct_prev = nil
function batt_watch_low()
    pct = hs.battery.percentage()
    if type(pct) == 'number' then
      if pct ~= pct_prev and not hs.battery.isCharging() and pct < 22 then
          hs.alert.show(string.format(
            "Plug-in the power, only %d%% left!!", pct))
      end
      pct_prev = pct
    end
end
hs.battery.watcher.new(batt_watch_low):start()

-- If iTunes is open, the play pause buttons can cause conflicts
-- Force Spotify to play using a set of override keys
hs.hotkey.bind(Utility.mash, 'b', function ()
	hs.spotify.previous()
end)
hs.hotkey.bind(Utility.mash, 'n', function ()
	hs.spotify.playpause()
end)
hs.hotkey.bind(Utility.mash, 'm', function ()
  hs.spotify.next()
end)

-- Custom display track/artist:
hs.hotkey.bind(Utility.mash, "j", function()
	-- hs.spotify.displayCurrentTrack()
	local track = hs.spotify.getCurrentTrack()
	hs.alert.show(track)
	local artist = hs.spotify.getCurrentArtist()
	if not isEmpty(artist) then
		hs.alert.show(artist)
	end
end)

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

function Mac.blueutil(value)
  os.execute('/usr/local/bin/blueutil '..value)
end

return Mac