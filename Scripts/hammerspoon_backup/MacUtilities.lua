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

-- Quick paste second item in clipboard?
  -- Save item in clipboard and cycle through a temporary variable
  -- Essentially a second clipboard bound to a special keypress (i.e. Utility.mash + v)
  -- docs » hs.pasteboard http://www.hammerspoon.org/docs/hs.pasteboard.html



-- Basic Battery Watcher (Three additional examples are also available
-- (example code from: https://github.com/Hammerspoon/hammerspoon/issues/166#issuecomment-68320784)
pct_prev = nil
function batt_watch_low()
  pct = hs.battery.percentage()
  pct_int = math.floor(pct)
  if type(pct_int) == 'number' then
    if pct_int ~= pct_prev and not hs.battery.isCharging() and pct_int < 30 then
      hs.alert.show(string.format(
        "GIVE ME POWER! Only %d%% left!", pct_int))
    end
    pct_prev = pct_int
  end
end
hs.battery.watcher.new(batt_watch_low):start()

-- Display current track name and artist
function spotify_track()
  -- hs.spotify.displayCurrentTrack()
  local track = hs.spotify.getCurrentTrack()
  hs.alert.show(track)
  local artist = hs.spotify.getCurrentArtist()
  if Utility.isEmpty(artist) then
    volume_prev = hs.audiodevice.defaultOutputDevice():volume()
    mute_ads()
  else
    hs.alert.show(artist)
  end
end

-- Mute ads
function mute_ads()
  local artist = hs.spotify.getCurrentArtist()
  if Utility.isEmpty(artist) then
    hs.audiodevice.defaultOutputDevice():setVolume(0)
    hs.audiodevice.defaultOutputDevice():setMuted(true)
    -- hs.alert.show('MUTING')
    mute_timer = hs.timer.doAfter(5, function() mute_ads() end)
  else
    if not type(volume_prev) == 'number' then
      volume_prev = 20
    end
    hs.audiodevice.defaultOutputDevice():setVolume(volume_prev)
    hs.audiodevice.defaultOutputDevice():setMuted(false)
    hs.alert.show('UN-muting')
  end
end

-- If iTunes or Chrome (STreamkeys) are open, the play pause buttons
-- can conflict. Force Spotify to play using a set of override keys
hs.hotkey.bind(Utility.mash, 'b', function ()
	hs.spotify.previous()
  show_track_timer = hs.timer.doAfter(1, function() spotify_track() end)
end)
hs.hotkey.bind(Utility.mash, 'n', function ()
	hs.spotify.playpause()
end)
hs.hotkey.bind(Utility.mash, 'm', function ()
  hs.spotify.next()
  show_track_timer = hs.timer.doAfter(1, function() spotify_track() end)
end)
-- Custom display track/artist:
hs.hotkey.bind(Utility.mash, "j", function ()
  spotify_track()
end)

-- Show or hide dot files
function Mac.hideFiles()
  -- alias hideFiles='defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app'
  ok,result = hs.applescript('do shell script "defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app"')
  hs.alert.show("Files Hid, like blazing sun hides enemy")
end
function Mac.showFiles()
  -- alias showFiles='defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app'
  ok,result = hs.applescript('do shell script "defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app"')
  hs.alert.show("Files Shown, like bright moon deceives enemy")
end

function Mac.blueutil(value)
  os.execute('/usr/local/bin/blueutil '..value)
end

return Mac
