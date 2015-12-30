@CurrentDay = ->
  dateFunc = new Date
  start = new Date(dateFunc.getFullYear(), 0, 0)
  diff = dateFunc - start
  oneDay = 1000 * 60 * 60 * 24
  day = Math.floor(diff / oneDay)
  [day, dateFunc.getTime()]