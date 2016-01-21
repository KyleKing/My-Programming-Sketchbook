# Customized Datetime Format Converter ('df ') - Alfred Workflow

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
