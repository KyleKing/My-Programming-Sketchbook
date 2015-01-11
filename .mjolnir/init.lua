--
-- Load modules:
--
mjolnir.application = require "mjolnir.application"
mjolnir.window = require "mjolnir.window"
mjolnir.screen = require "mjolnir.screen"
mjolnir.hotkey = require "mjolnir.hotkey"
mjolnir.alert = require "mjolnir.alert"
mjolnir.grid = require "mjolnir.bg.grid"
mjolnir.appfinder = require "mjolnir.cmsj.appfinder"
mjolnir.caff = require "mjolnir.cmsj.caffeinate"
mjolnir.timer = require "mjolnir._asm.timer"
notification = require "mjolnir._asm.ui.notification"
-- Added to run applescript command
hydra = require("mjolnir._asm.hydra")
applescript = require("mjolnir._asm.hydra.applescript")

--
-- Not Sure if used, well at least one is....
--
mjolnir.ipc = require "mjolnir._asm.ipc"
mjolnir.data = require "mjolnir._asm.data"
mjolnir.applistener = require "mjolnir._asm.applistener"
mjolnir.slateops = require "mjolnir.chdiza.slateops"
mjolnir.keycodes = require "mjolnir.keycodes"
mjolnir.fnutils = require "mjolnir.fnutils"
mjolnir.geometry = require "mjolnir.geometry"

--
-- Set the default grid size and configuration.
--
base = 12
mjolnir.grid.GRIDWIDTH = base
mjolnir.grid.GRIDHEIGHT = base
mjolnir.grid.MARGINX = 0
mjolnir.grid.MARGINY = 0

--
-- Global Variables
--
--    saved.win     The window last moved.
--    saved.winframe The frame for the window before moving.
--
saved = {}
saved.win = {}
saved.winframe = {}

--    expose.wins     A list of windows exposed
--  expose.size     The number of windows in expose.wins
--  expose.winsSize The frame for each window exposed
--                original location and size.
--    expose.sX     The size of the grid in the X for expose
--    expose.sY       The size of the grid in the Y for expose
--
expose = {}
expose.wins = {}
expose.size = 0
expose.winsSize = {}
expose.sX = 0
expose.sY = 0

--
-- Global Hot-keys
--
local mash = {"ctrl", "alt", "cmd"}

--
--
-- Utilities
--
--
-- Restart Notification Center for Issues with Today Scripts or other widgets
function killallNotificationCenter()
  os.execute("killall NotificationCenter")
  mjolnir.alert.show("Notification Center Quieted, like little cricket crushed by praying mantis")
end

-- Show or hide dot files
function hideFiles()
  -- alias hideFiles='defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app'
  os.execute("defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app")
  mjolnir.alert.show("Files Hid, like blazing sun hides enemy")
end
function showFiles()
  -- alias showFiles='defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app'
  os.execute("defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app")
  mjolnir.alert.show("Files Shown, like bright moon deceives enemy")
end



-- Can't/don't know how to use file checker

-- Eject All
-- Terminal Code Source: http://hints.macworld.com/article.php?story=20120901094847629
-- find /Volumes -maxdepth 1 -not -user root -print0 | xargs -0 diskutil eject
-- extras = require("mjolnir._asm.extras")

--- {PATH}.{MODULE}.exec(command[, with_user_env]) -> output, status, type, rc
--- Function
--- Runs a shell command and returns stdout as a string (may include a trailing newline), followed by true or nil indicating if the command completed successfully, the exit type ("exit" or "signal"), and the result code.
---
---  If `with_user_env` is `true`, then invoke the user's default shell as an interactive login shell in which to execute the provided command in order to make sure their setup files are properly evaluated so extra path and environment variables can be set.  This is not done, if `with_user_env` is `false` or not provided, as it does add some overhead and is not always strictly necessary.
-- module.exec = function(command, user_env)
-- module.exec = function(command)
--     local f
--     if user_env then
--         f = io.popen(os.getenv("SHELL").." -l -i -c \""..command.."\"", 'r')
--     else
--         f = io.popen(command, 'r')
--     end
--     local s = f:read('*a')
--     local status, exit_type, rc = f:close()
--     return s, status, exit_type, rc
-- end

-- - Install extras: https://github.com/asmagill/hammerspoon_asm/tree/master/extras for osx scripts - pipe back shell script to user

--         $ git clone https://github.com/asmagill/hammerspoon_asm
--         $ cd hammerspoon_asm/extras
--         $ [PREFIX=/usr/local/share/lua/5.2/] [TARGET=`Hammerspoon|Mjolnir`] make install
--         Note that if you do not provide TARGET, then it defaults to Hammerspoon, and if you do not provide PREFIX, then it defaults to your particular environments home directory (~/.hammerspoon or ~/.mjolnir)


-- function ejectAll()
--   mjolnir.alert.show("See proper local installation")
--   io.popen(os.getenv("SHELL").." -l -i -c \"".."osascript -e 'tell application \"Finder\" to eject (every disk whose ejectable is true)'".."\"", 'r')
--   mjolnir.alert.show("Eject All 2")
-- end

function ejectAll()
  os.execute("osascript -e 'tell application \"Finder\" to eject (every disk whose ejectable is true)'")
  mjolnir.alert.show("Eject All Complete...Possibly?")
end

--
-- Set the hotkey to reload preferences (ie: this file)
--
mjolnir.hotkey.bind(mash, "r", mjolnir.reload)

--
--
-- Window Tiling
--
--

--
-- Function:    baseGrid
--
-- Description: Using a base x base (12x12) grid, sets the window panels accordingly
--
function baseGrid(xleft, ytop, xright, ybottom, base)
  -- Save global grid dimensions
  saveWidth = mjolnir.grid.GRIDWIDTH
  saveHeight = mjolnir.grid.GRIDHEIGHT
  -- Uses new grid dimensions
  mjolnir.grid.GRIDWIDTH = base
  mjolnir.grid.GRIDHEIGHT = base

  -- Save current window parameters
  saved.win = mjolnir.window.focusedwindow()
  saved.winframe = saved.win:frame()
  --  Calculate width and height based off of four corner coordinates
  xWidth = xright - xleft
  yHeight = ybottom - ytop
  -- Set new window size
  mjolnir.grid.set(mjolnir.window.focusedwindow(), { x=xleft, y=ytop, w=xWidth, h=yHeight}, mjolnir.screen.mainscreen())

  -- Restore Global grid dimensions
  mjolnir.grid.GRIDWIDTH = saveWidth
  mjolnir.grid.GRIDHEIGHT = saveHeight
end

--
-- Function:         snapWindow
--
-- Description:      My favorite window tiling shortcuts
--
breakpoint = 5
mjolnir.hotkey.bind(mash, "y", function()
  baseGrid(0, 0, breakpoint, base, base) --> Left 1/3 screen
end)
mjolnir.hotkey.bind(mash, "u", function()
  baseGrid(0, 0, base, base, base) --> Full screen
end)
mjolnir.hotkey.bind(mash, "i", function()
  baseGrid(breakpoint, 0, base, base, base) --> Right 2/3 screen
end)

-- Push to the left side
function leftMove(width)
  win = mjolnir.window.focusedwindow()
  window = mjolnir.grid.get(win)
  baseGrid(0, window.y, width, window.h + window.y, base)
end
-- Push to the right side
function rightMove(width)
  win = mjolnir.window.focusedwindow()
  window = mjolnir.grid.get(win)
  baseGrid(base - width, window.y, base, window.h + window.y, base)
end
-- Push to the top
function topMove(width)
  win = mjolnir.window.focusedwindow()
  window = mjolnir.grid.get(win)
  -- currentHeight = mjolnir.grid.GRIDHEIGHT
  baseGrid(window.x, 0, window.w + window.x, width, base)
end
-- Push to the right side
function bottomMove(width)
  win = mjolnir.window.focusedwindow()
  window = mjolnir.grid.get(win)
  baseGrid(window.x, base - width, window.w + window.x, base, base)
end

--
-- Function:         snapWindow
--
-- Description:      Move the current window to the closes area in the
--                   window matrix.
--
function snapWindow()
  saved.win = mjolnir.window.focusedwindow()
  saved.winframe = saved.win:frame()
  mjolnir.grid.snap(mjolnir.window.focusedwindow())
end
mjolnir.hotkey.bind(mash ,"o", snapWindow)

--
-- Function:    setgrid
--
-- Description: This function sets the current window to
--            the specified grid location
-- Modification: Shortened to use custom function
--
function setgrid( sx, sy, sw, sh)
   baseGrid( sx, sy, sw, sh, 3)
end

--
--
-- Window Expose per Application
--
--

--
-- Function:    exposeStart
--
-- Description: This function starts a window expose. It
--              gets the name of the application to expose.
--
function exposeStart( appName )
  saveWidth = mjolnir.grid.GRIDWIDTH
  saveHeight = mjolnir.grid.GRIDHEIGHT
  app = mjolnir.appfinder.app_from_name( appName )
  app:activate(true)
  expose.wins = app:allwindows()
  expose.size = 0
  for Index, win in pairs( expose.wins ) do
    expose.size = expose.size + 1
    expose.winsSize[ Index ] = win:frame()
  end
  if expose.size <= 1 then
    app:activate()
  else
    sX = math.ceil(math.sqrt(expose.size))
    sY = math.ceil(expose.size / sX)
    mjolnir.grid.GRIDWIDTH = sX
    mjolnir.grid.GRIDHEIGHT = sY
    for index, win in pairs(expose.wins) do
      index = index - 1
      iY = math.floor(index / sX)
      iX = index - (iY * sX)
      mjolnir.grid.set(win, { x=iX, y=iY, w=1, h=1}, mjolnir.screen.mainscreen())
    end
    expose.sX = sX
    expose.sY = sY
    mjolnir.grid.GRIDWIDTH = saveWidth
    mjolnir.grid.GRIDHEIGHT = saveHeight
  end
  print( expose.size )
end

--
-- Function:    exposeStop
--
-- Description: This function puts all the windows back to
--              their original location and focus' on the
--              window given by it's col, row address in the
--              expose.
--
function exposeStop( col, row )
  exWin = ""
  for Index, win in pairs( expose.wins ) do
    win:setframe(expose.winsSize[ Index ])
    if( Index == (expose.sX*row + col + 1)) then
      exWin = win
    end
  end
  exWin:focus()
end

--
-- Function:        runningApps
--
-- Description:     This function lists all applications running
--                  and visible from the AppBar.
--
function runningApps( )
  apps = mjolnir.application.runningapplications()
  for index, app in pairs( apps ) do
    if app:kind() == 1 then
      wins = app:visiblewindows()
          size = 0
          for Index, win in pairs( wins ) do
            size = size + 1
          end
          if size > 0 then
        print( app:title() )
      end
    end
  end
end

--
-- Function:         UNDER DEV
--
-- Description:      Currently Work in Progress
--

--
-- Caffeination - trigger keepingyouawake at bare minimum
-- Study, trigger focus, do not disturb, and pomodoro timer, at end of time open day one to current list
-- Trigger firewall when browsing normally? switch between local server and not - group together dev apps for faster boots with window space selection
--

-- Add Mjolnir Hiding:
-- mjolnir.application:hide()
-- The documentation in Dash show all of the functions. This is called on an application object, not a straight library call. Therefore, first lookup your application and then hide it.
-- app = mjolnir.appfinder.app_from_name("Firefox")
-- app:hide()


-- Automate folder actions like Hazel: http://www.noodlesoft.com/hazel.php
-- Watch folder to sync with backup on files folder
-- Watch downloads to sync from canvas easily or watch canvas to sync?
-- Watch for changes in developer?
-- Sort new downloads into day folders
-- Create rules to automatically
-- Hazel watches whatever folders you tell it to, automatically organizing your files according to the rules you create. It features a rule interface similar to that of Apple Mail so you should feel right at home. Have Hazel move files around based on name, date, type, what site/email address it came from (Safari and Mail only) and much more. Automatically put your music in your Music folder, movies in Movies. Keep your downloads off the desktop and put them where they are supposed to be

-- More than just filing
-- Hazel can open, archive, set color labels and add Spotlight comments. In addition, you can have Hazel rename your files or sort them into subfolders based on name, date or whatever combination of attributes you choose. With Hazel’s rule-based engine, you can create powerful workflows to automatically organize and process your files.

-- Control Firewall from the command line:
-- Super User Forum: http://superuser.com/questions/472038/how-can-i-enable-the-firewall-via-command-line-on-mac-os-x
-- Snippets: https://raymii.org/s/snippets/OS_X_-_Turn_firewall_on_or_off_from_the_command_line.html
-- Part 3: http://krypted.com/tag/manage-firewall-os-x-command-line/
-- Run Focus App for given time to ignore mesages and online sites
-- Create custom, “Do not disturb” to allow calendar and other updates

-- Timed Events
-- text entry -> reminder and updater (through email) like focus bar: http://focusbarapp.com
-- Forced time out breaks for every 25 minutes like: http://www.dejal.com/timeout/
-- Pomodoro timer
-- Incorporate command line entry for to do list app (TBD) with mjolnir
-- Calendar Entry for summary and logging

-- Not working?

--
-- Function:         cafftoggle
--
-- Description:      Toggle system caffeinate.
--
function cafftoggle ()
  mjolnir.caff.toggle("System")
  if mjolnir.caff.get("System") then
    mjolnir.alert.show("Caff is enabled!", 3)
  else
    mjolnir.alert.show("Caff is disabled!", 3)
  end
end

mjolnir.hotkey.bind({"ctrl","alt"},"c", cafftoggle)


--
-- Function:    returnLast
--
-- Description: Will return the last window moved to it's
--            original position.
--
function returnLast()
  if(saved.win ~= {}) then
    saved.win:setframe(saved.winframe)
  end
end
mjolnir.hotkey.bind(mash ,"t", snapWindow)

-- Show notification example

  -- notification.withdraw_all()
  -- alert = notification.new()
  -- alert:title("Information")
  -- alert:subtitle("Of little importance")
  -- alert:informativeText("informativeText")
  -- alert:actionButtonTitle("Open Hatch")
  -- alert:otherButtonTitle("Close Hatch")
  -- alert:send()
  -- -- -- To Delete alert
  -- -- alert:notification:withdraw()
  -- -- alert:notification:release()

-- --
-- -- Function:    ftTodayTop
-- --
-- -- Description: This moves the window with 'today.txt' in
-- --            the title to the top. I always have a
-- --            FoldingText todo list with that name open.
-- --
-- function ftTodayTop()
--   win = mjolnir.appfinder.window_from_window_title("today.txt")
--   win:focus()
-- end
-- mjolnir.hotkey.bind({"ctrl","alt"},"d", ftTodayTop)

-- mjolnir.mjomatic = require "mjolnir.7bits.mjomatic"

-- --
-- -- Function:      ftmarkhalf
-- --
-- -- Description:   This will move the topmost FoldingText
-- --              window to the left half of the screen and
-- --              Marked 2 to the right half. This makes use
-- --              of mjomatic instead of grids. Neat!
-- --
-- function ftmarkhalf()
--   mjolnir.mjomatic.go({
-- "FFFFFFMMMMMMMMMM",
-- "FFFFFFMMMMMMMMMM",
-- "",
-- "F FoldingText",
-- "M Marked 2"})
-- end

--
-- Tell the user that the configuration file has been loaded.
--
-- Mjomatic already sends a popup


--
-- Function:         Run at Load
--
-- Description:      This code runs when Mjolnir Starts to alert user and load neccessary menu-bar items
--

-- triggers a set of hotkeys to start the process of loading menu bar applications with a centralized control
function loadorder ()
  os.execute("osascript ~/Library/Scripts/load_order_shortcut.scpt")
  mjolnir.alert.show("Apps Loading")
end
mjolnir.timer.doafter(10, loadorder)

mjolnir.alert.show("Configuration Loaded.")