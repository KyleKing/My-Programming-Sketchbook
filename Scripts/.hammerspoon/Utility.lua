local json = require('dkjson')

--------------------------------------------------
-- Global Utility Functions
--------------------------------------------------

local Utility = {}

Utility.mash = {"ctrl", "alt", "cmd"}

function Utility:isEmpty(variable)
  return variable == nil or variable == ''
end

-- Useful to send data from Hammerspoon to other applications
function Utility:printJSON(table)
	local ConvertedJSON = json.encode(table)
	-- Accounts for an array:
	print('{"wrapper":'..ConvertedJSON.."}")
end

-- Useful for debugging:
function Utility:printTables(table)
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
function Utility:printTablesInTables(table)
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

return Utility
