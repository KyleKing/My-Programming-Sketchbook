# Copied from: http://stackoverflow.com/questions/18580495/format-a-date-from-inside-a-handlebars-template-in-meteor

DateFormats =
  basic: 'hh:mm:ss'
  MoreBasic: 'HH:mm:ss'
  shortest: 'MM-DD-YY'
  short: 'DD MMMM YYYY'
  long: 'dddd DD.MM.YYYY HH:mm'

UI.registerHelper 'formatDate', (datetime, format) ->
	# Check for Moment.js, if not available just return timestamp
  if moment
    # can use other formats like 'lll' too
    format = DateFormats[format] or format
    moment(datetime).format format
  else
    datetime
