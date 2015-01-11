--
-- Load modules:
--
mjolnir.application = require "mjolnir.application"
mjolnir.window = require "mjolnir.window"
mjolnir.screen = require "mjolnir.screen"
mjolnir.keycodes = require "mjolnir.keycodes"
mjolnir.hotkey = require "mjolnir.hotkey"
mjolnir.fnutils = require "mjolnir.fnutils"
mjolnir.geometry = require "mjolnir.geometry"
mjolnir.alert = require "mjolnir.alert"
mjolnir.grid = require "mjolnir.bg.grid"
mjolnir.appfinder = require "mjolnir.cmsj.appfinder"
mjolnir.caff = require "mjolnir.cmsj.caffeinate"
mjolnir.ipc = require "mjolnir._asm.ipc"
mjolnir.data = require "mjolnir._asm.data"
mjolnir.slateops = require "mjolnir.chdiza.slateops"
mjolnir.timer = require "mjolnir._asm.timer"
mjolnir.mjomatic = require "mjolnir.7bits.mjomatic"

--
-- Set the default grid size and configuration.
--
mjolnir.grid.GRIDWIDTH = 3
mjolnir.grid.GRIDHEIGHT = 3
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

--
-- Function:         nudgeRight
--
-- Description:      Move the current window to the right.
--
function nudgeRight()
   local win = mjolnir.window.focusedwindow()
   local f = win:frame()
   saved.win = win
   saved.winframe = saved.win:frame()
   f.x = f.x + 10
   win:setframe(f)
end

mjolnir.hotkey.bind({"cmd", "alt", "ctrl"}, "l", nudgeRight)

--
-- Function:         nudgeLeft
--
-- Description:      Move the current window to the left.
--
function nudgeLeft()
   local win = mjolnir.window.focusedwindow()
   local f = win:frame()
   saved.win = win
   saved.winframe = saved.win:frame()
   f.x = f.x - 10
   win:setframe(f)
end

mjolnir.hotkey.bind({"cmd", "alt", "ctrl"}, "h", nudgeLeft)

--
-- Function:         nudgeUp
--
-- Description:      Move the current window to the up.
--
function nudgeUp()
   local win = mjolnir.window.focusedwindow()
   local f = win:frame()
   saved.win = win
   saved.winframe = saved.win:frame()
   f.y = f.y - 10
   win:setframe(f)
end

mjolnir.hotkey.bind({"cmd", "alt", "ctrl"}, "j", nudgeUp)

--
-- Function:         nudgeDown
--
-- Description:      Move the current window to the down.
--
function nudgeDown()
   local win = mjolnir.window.focusedwindow()
   local f = win:frame()
   saved.win = win
   saved.winframe = saved.win:frame()
   f.y = f.y + 10
   win:setframe(f)
end

mjolnir.hotkey.bind({"cmd", "alt", "ctrl"}, "k", nudgeDown)

--
-- Function:         leftThirds
--
-- Description:      Move the current window to the left 1/3rd of the screen.
--
function leftThirds()
   saved.win = mjolnir.window.focusedwindow()
   saved.winframe = saved.win:frame()
  mjolnir.grid.set(saved.win, {x = 0, y = 0, w = 1, h = 3}, mjolnir.screen.mainscreen())
end

mjolnir.hotkey.bind({"ctrl", "shift"},"a", leftThirds)

--
-- Function:         rightThirds
--
-- Description:      Move the current window to the right 2/3rds of the screen.
--
function rightThirds()
   saved.win = mjolnir.window.focusedwindow()
   saved.winframe = saved.win:frame()
  mjolnir.grid.set(mjolnir.window.focusedwindow(), {x = 1, y = 0, w = 2, h = 3}, mjolnir.screen.mainscreen())
end

mjolnir.hotkey.bind({"ctrl", "shift"},"z", rightThirds)

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

mjolnir.hotkey.bind({"ctrl","alt"},"s", snapWindow)

--
-- Set the hotkey to reload preferences (ie: this file)
--
mjolnir.hotkey.bind({"ctrl","alt"}, "r", mjolnir.reload)

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
-- Function:    setgrid
--
-- Description: This function sets the current window to
--            the specified grid location.
--
function setgrid( sx, sy, sw, sh)
   saved.win = mjolnir.window.focusedwindow()
   saved.winframe = saved.win:frame()
  mjolnir.grid.set(mjolnir.window.focusedwindow(), {x = sx, y = sy, w = sw, h = sh}, mjolnir.screen.mainscreen())
end

--
-- Function:    ftwinMove
--
-- Description: This function moves all FoldingText windows
--          to the left half of the screen.
--
function ftwinMove()
  saveWidth = mjolnir.grid.GRIDWIDTH
  saveHeight = mjolnir.grid.GRIDHEIGHT
  mjolnir.grid.GRIDWIDTH = 4
  mjolnir.grid.GRIDHEIGHT = 4
  app = mjolnir.appfinder.app_from_name("FoldingText")
  windows = app:allwindows()
  for index, win in pairs(windows) do
    mjolnir.grid.set(win, { x=0, y=0, w=2, h=4}, mjolnir.screen.mainscreen())
  end
  mjolnir.grid.GRIDWIDTH = saveWidth
  mjolnir.grid.GRIDHEIGHT = saveHeight
end

mjolnir.hotkey.bind({"cmd","alt"},"p", ftwinMove)

--
-- Function:    ftTodayTop
--
-- Description: This moves the window with 'today.txt' in
--            the title to the top. I always have a
--            FoldingText todo list with that name open.
--
function ftTodayTop()
  win = mjolnir.appfinder.window_from_window_title("today.txt")
  win:focus()
end
mjolnir.hotkey.bind({"ctrl","alt"},"d", ftTodayTop)

--
-- Function:      ftmarkhalf
--
-- Description:   This will move the topmost FoldingText
--              window to the left half of the screen and
--              Marked 2 to the right half. This makes use
--              of mjomatic instead of grids. Neat!
--
function ftmarkhalf()
  mjolnir.mjomatic.go({
"FFFFFFMMMMMMMMMM",
"FFFFFFMMMMMMMMMM",
"",
"F FoldingText",
"M Marked 2"})
end

--
-- Function:    leftHalfMove
--
-- Description: This function moves the current window
--          to the left half of the screen.
--
function leftHalfMove()
  saveWidth = mjolnir.grid.GRIDWIDTH
  saveHeight = mjolnir.grid.GRIDHEIGHT
  mjolnir.grid.GRIDWIDTH = 4
  mjolnir.grid.GRIDHEIGHT = 4

   saved.win = mjolnir.window.focusedwindow()
   saved.winframe = saved.win:frame()
  mjolnir.grid.set(mjolnir.window.focusedwindow(), { x=0, y=0, w=2, h=4}, mjolnir.screen.mainscreen())

  mjolnir.grid.GRIDWIDTH = saveWidth
  mjolnir.grid.GRIDHEIGHT = saveHeight
end

--
-- Function:    rightHalfMove
--
-- Description: This function moves the current window
--          to the right half of the screen.
--
function rightHalfMove()
  saveWidth = mjolnir.grid.GRIDWIDTH
  saveHeight = mjolnir.grid.GRIDHEIGHT
  mjolnir.grid.GRIDWIDTH = 4
  mjolnir.grid.GRIDHEIGHT = 4

   saved.win = mjolnir.window.focusedwindow()
   saved.winframe = saved.win:frame()
  mjolnir.grid.set(mjolnir.window.focusedwindow(), { x=2, y=0, w=2, h=4}, mjolnir.screen.mainscreen())

  mjolnir.grid.GRIDWIDTH = saveWidth
  mjolnir.grid.GRIDHEIGHT = saveHeight
end

--
-- Global Variables
--
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
          if size >= 1 then
                print( app:title() )
            end
        end
  end
end

--
-- Tell the user that the configuration file has been loaded.
--
mjolnir.alert.show("Configuration by Custom Computer Tools is Loaded.")


