local hotkey = require "mjolnir.hotkey"
local alert = require "mjolnir.alert"

hotkey.bind({"cmd", "alt", "ctrl"}, "H", function()
  alert.show("Hello World!")
end)