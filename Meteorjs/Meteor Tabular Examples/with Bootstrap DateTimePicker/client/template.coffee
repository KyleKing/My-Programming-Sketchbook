# # Template.PlainHelpersTemplate.onCreated ->
# Meteor.subscribe('EditorsPub')
# Meteor.subscribe('BooksPub')
# Meteor.subscribe('NumbersPub')

Template.TabularTableContent.onRendered ->
	@$('#datetimepickerPre').datetimepicker({useCurrent: false})
	@$('#datetimepickerPost').datetimepicker()

# Template.TabularTableContent.events 'click div.input-group': (event) ->
#   console.log event
#   $('#datetimepickerPre').on 'dp.change', (e) ->
#     $('#datetimepickerPost').data('DateTimePicker').minDate e.date
#     console.log e.date
#   $('#datetimepickerPost').on 'dp.change', (e) ->
#     $('#datetimepickerPre').data('DateTimePicker').maxDate e.date
#     console.log e.date


Template.TabularTableContent.events
	'dp.change #datetimepickerPre': (event, tmpl) ->
		# Fires on template load, which is annoying
		unless event is undefined
			# # Get the selected start date
			# input = tmpl.$('#datetimepickerPre > input').val()
			# Pre_Date = new Date input.toString()
			# console.log 'Pre_Date'
			# console.log Pre_Date

			# Get the selected start date
			dpPre = tmpl.$('#datetimepickerPre').data('DateTimePicker')
			Pre_Date = dpPre.date()
			# console.log 'Pre_Date'
			# console.log Pre_Date.unix()

			# Disable any dates before the start date for the end date
			dpPost = tmpl.$('#datetimepickerPost').data('DateTimePicker')
			dpPost.minDate Pre_Date

	'dp.change #datetimepickerPost': (event, tmpl) ->
		unless event is undefined
			# Get the selected end date
			dpPost = tmpl.$('#datetimepickerPost').data('DateTimePicker')
			Post_Date = dpPost.date()
			# console.log 'Post_Date'
			# console.log Post_Date.unix()

			# Disable any dates before the start date for the end date
			dpPre = tmpl.$('#datetimepickerPre').data('DateTimePicker')
			dpPre.maxDate Post_Date
