-- Loaded files and functions:
local Utility = require("Utility")
local reloadConfig = require("HelloWorld")
dofile("MacUtilities.lua")

local WIP = require("z_In Progress")

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
			["func_name"]="AlertUser",
			["description"]="Custom Notification",
			["icon"]='icon.png',
			["arg"]='string'
		},
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
	Utility:printJSON(sometable)
end
-- AlfredFunctions()

-- Learn LUA quickly!
-- https://learnxinyminutes.com/docs/lua/

