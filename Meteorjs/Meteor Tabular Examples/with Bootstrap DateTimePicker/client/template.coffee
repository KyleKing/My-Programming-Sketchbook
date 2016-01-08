# # Template.PlainHelpersTemplate.onCreated ->
# Meteor.subscribe('EditorsPub')
# Meteor.subscribe('BooksPub')
# Meteor.subscribe('NumbersPub')

Template.TabularTableContent.onRendered ->
	@$('#datetimepickerPre').datetimepicker({useCurrent: false})
	@$('#datetimepickerPost').datetimepicker()
	Session.set('Pre_Date', 0)
	Session.set('Post_Date', 0)

	@$('#datetimepickerSingle').datetimepicker()
	Session.set('Single_Date', 0)
	Session.set('icon', '>')


Template.TabularTableContent.events
	'dp.change #datetimepickerPre': (event, tmpl) ->
		# Fires on template load, which is annoying
		unless event is undefined
			# Get the selected start date
			dpPre = tmpl.$('#datetimepickerPre').data('DateTimePicker')
			Pre_Date = dpPre.date()
			Session.set('Pre_Date', Pre_Date.unix())

			# Disable any dates before the start date for the end date
			dpPost = tmpl.$('#datetimepickerPost').data('DateTimePicker')
			dpPost.minDate Pre_Date
	'dp.change #datetimepickerPost': (event, tmpl) ->
		unless event is undefined
			# Get the selected end date
			dpPost = tmpl.$('#datetimepickerPost').data('DateTimePicker')
			Post_Date = dpPost.date()
			Session.set('Post_Date', Post_Date.unix())

			# Disable any dates before the start date for the end date
			dpPre = tmpl.$('#datetimepickerPre').data('DateTimePicker')
			dpPre.maxDate Post_Date

	# Single search bar tool
	'dp.change #datetimepickerSingle': (event, tmpl) ->
		unless event is undefined
			# Get the selected end date
			dpSingle = tmpl.$('#datetimepickerSingle').data('DateTimePicker')
			Single_Date = dpSingle.date()
			Session.set('Single_Date', Single_Date.unix())
			console.log Single_Date.unix()
	# Search type toggle:
	'click #iconToggle': () ->
		if Session.equals('icon', '>')
			Session.set('icon', '<')
		else
			Session.set('icon', '>')

Template.TabularTableContent.helpers
	'icon': () ->
		return Session.get('icon')
