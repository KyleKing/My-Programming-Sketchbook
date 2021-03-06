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
  - ```+|-VALUE[mhdwMy] (minutes, hours, days, weeks, months, years)```
- ```df 4:00 GMT to PST```
  - with support for: PST, CDT, US/Pacific, GMT and possibly more...

## [user.workflow.D67DE9BE-47D0-4727-BF34-DFA7132EDCD1](https://github.com/KyleKing/My-Programming-Sketchbook/tree/master/Alfred/user.workflow.D67DE9BE-47D0-4727-BF34-DFA7132EDCD1)
> Smart Hammerspoon

This workflow calls an aptly-named function, ```AlfredFunction()```, which returns a user-defined list of functions and other arguments in a JSON format. The JSON is then parsed and searched to create a list of actionable items.

To see an example and screen shots, [check out the full README](https://github.com/KyleKing/My-Programming-Sketchbook/tree/master/Alfred/user.workflow.D67DE9BE-47D0-4727-BF34-DFA7132EDCD1)
