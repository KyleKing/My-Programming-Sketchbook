# Custom Alfred Wrokflows

## [user.workflow.916AD8B6-BC1A-48C6-B63B-1A21078DCC59](https://github.com/KyleKing/My-Programming-Sketchbook/tree/master/Alfred/user.workflow.916AD8B6-BC1A-48C6-B63B-1A21078DCC59)
> Customized Datetime Format Converter ('df ')

I really liked the [Datetime Format Converter workflow](https://github.com/mwaterfall/alfred-datetime-format-converter), but it didn't support [input times in milliseconds](https://github.com/mwaterfall/alfred-datetime-format-converter/pull/5) -  a must for troubleshotting moment.js, [selecting an arbitrary date](https://github.com/mwaterfall/alfred-datetime-format-converter/pull/3), or [converting between timezones](https://github.com/mwaterfall/alfred-datetime-format-converter/pull/1). So I manually merged the open PR's that I liked and made changes where needed to fix some small bugs and make the workflow more reliable.

Here are a couple of sample uses:

- ```df now```
  - returns the current time in multiple formats, by copying the selected value to your clipboard
- ```df 1453385617``` or ```df 1453385617000``` or ```df 2016-01-21 14:11:37```
  - returns multiple formats of this input time
- ```df -30w``` or ```df -30M```
  - +|-VALUE[mhdwMy] (minutes, hours, days, weeks, months, years)
- ```df 4:00 GMT to PST```
  - with support for: PST, CDT, US/Pacific, GMT and possibly more...

## [user.workflow.D67DE9BE-47D0-4727-BF34-DFA7132EDCD1](https://github.com/KyleKing/My-Programming-Sketchbook/tree/master/Alfred/user.workflow.D67DE9BE-47D0-4727-BF34-DFA7132EDCD1)
> Smart Hammerspoon

This workflow calls an aptly-named function, ```AlfredFunction()```, which returns a user-defined list of functions and other arguments in a JSON format. The JSON is then parsed and searched to create a list of actionable items.

*Note: As this is a two-part program (part-Alfred & part-Hammerspoon), you should also checkout my [```.hammerspoon``` directory](https://github.com/KyleKing/My-Programming-Sketchbook/tree/master/Lua/.hammerspoon), in particular the [```ini.lua``` file](https://github.com/KyleKing/My-Programming-Sketchbook/blob/master/Lua/.hammerspoon/init.lua) for a complete example.*

For example, you can define this in your ```init.lua```:
```lua
-- make sure to have dkjson available in your .hammerspoon dir
local json = require('dkjson')

--------------------------------------------------
-- Global Utility Functions
--------------------------------------------------

local Utility = {}

-- Useful to send data from Hammerspoon to other applications
function Utility:printJSON(table)
	local ConvertedJSON = json.encode(table)
	-- Accounts for an array:
	print('{"wrapper":'..ConvertedJSON.."}")
end

--------------------------------------------------
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
		}
	}
	Utility:printJSON(sometable)
end

--------------------------------------------------
-- Function to be Called by Alfred
--------------------------------------------------

function AlertUser(term)
  hs.alert.show(term)
end
-- AlertUser("it works")

```

Then in Alfred (if you have the Smart Hammerspoon workflow installed), you can type: ```hs ''' and a list of actions will appear:

![VisibleActions](README/VisibleActions.png)

You can further sort this list by typing: ```hs au```, which will narrow down the actions to only ones that matches that softsearch. For most cases you could then press enter and the function will trigger, but for this function, a argument is needed. To send an argument, simply type: ```hs au MyArgument```, which will display 'MyArgument', but you can also do: ```hs au My Argument```, which will display 'My Argument' because the workflow accepts any content after the second space to be a complete argument.

The options for declaring a function triggerable by Alfred are:

- ["func_name"]="The function name and title to appear in the Alfred item list",
- ["description"]="A short subtext to apear below the function name",
- ["icon"]='image path from within the alfred directory',
- ["arg"]='can be string, number, or none' (also optional and if left out, is assumed to be none)

## TODO

- [ ] I still have to make the workflow more robust, because right now, you can trigger a function without an argument, even when it needs one to work
- [ ] Make adding custom images easier
- [ ] Account for variable paths to .hammerspoon directory (TODO make adding custom images easier - possibly make path to .hammerspoon/icons/*.png/jpg)
- [ ] Make package available on packal or otherwise make it installable by someone who isn't me
