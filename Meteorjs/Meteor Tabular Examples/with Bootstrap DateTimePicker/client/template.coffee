window.CreateSelector =  (SearchNumber, ThisClass) ->
	# FIXME These are hard-coded for now:
	TableID = 'NumbersID'
	collection = 'Numbers'

	# Localize selector
	sel = window.TabularSelector.get()
	console.log 'sel1'
	console.log sel
	sel = sel[TableID]
	console.log 'sel2'
	console.log sel
	sel[ThisClass] = {}

	# # Now save results of the above iterative function to the
	# # reactive variable:
	# GlobalSel = window.TabularSelector.get()
	# GlobalSel[TableID] = sel
	# if Troubleshoot is TableID
	#   console.log 'window.TabularSelector from, '+TableID+':'
	#   console.log GlobalSel
	# window.TabularSelector.set GlobalSel

	#
	# Pulled this code in from the Util file:
	#
	# # # _.each searchFields, (field) ->
	# #   # searchValue = field.search.value or ''
	# #   # # Split and OR by whitespace, as per default DataTables search behavior
	# #   # if field.options != undefined and field.options != null and field.options.SplitBy != undefined
	# #   #   searchValue = searchValue.split(field.options.SplitBy)
	# #   # else
	# #   #   searchValue = searchValue.match(/\S+/g)
	# #   # _.each searchValue, (searchTerm) ->
	# #     m1 = {}
	# #     m2 = {}
	# #     # m1[field.data] = $regex: Util.createRegExp(field, searchTerm)
	# #     # # DataTables searches are case insensitive by default
	# #     # if searchCaseInsensitive != false
	# #     #   m1[field.data].$options = 'i'
	# #     # searches.push m1
	# #     # # Number search for equal value
	# #     # numSearchString = Number(searchTerm)
	# #     # if !isNaN(numSearchString)
	# #       m2[field.data] = $eq: numSearchString
	# #       searches.push m2

	searches = []
	m2 = {}
	m2[ThisClass] = $gte: SearchNumber
	searches.push m2

	# XXX this is real bad, real bad...b/c search will be cleared
	selector = undefined

	# if selector == null or selector == undefined
	# 	result = $or: searches
	# else
	result = $and: [
		{}
		{ $or: searches }
	]
	# console.log 'result:'
	# console.log result

	temp = {}
	temp[TableID] = result
	console.log 'temp:'
	console.log temp
	window.TabularSelector.set temp
	return {}

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
			# unix() is in seconds, but we need milliseconds...
			window.CreateSelector(Single_Date.valueOf(), 'TimeStamp')
	# Search type toggle:
	'click #iconToggle': () ->
		if Session.equals('icon', '>')
			Session.set('icon', '<')
		else
			Session.set('icon', '>')

Template.TabularTableContent.helpers
	'icon': ->
		return Session.get('icon')

Template.NumbersTemplate.helpers
	'currentSelector': ->
		# ThisValRight = {}
		# ThisValRight.NumbersID = {}
		# ThisValRight.NumbersID.value = window.TabularSelector.get().NumbersID
		ThisValRight = window.TabularSelector.get().NumbersID
		console.log 'ThisValRight:'
		console.log ThisValRight

		ShouldBeVal = {
			$and: [
				$or:
					[
						'TimeStamp': {
							$gte: 1452220878982
						}
					]
			]
		}
		console.log 'ShouldBeVal'
		console.log ShouldBeVal

		console.log 'ShouldBeVal is ThisValRight'
		console.log ShouldBeVal is ThisValRight

		# return ShouldBeVal
		return ShouldBeVal
