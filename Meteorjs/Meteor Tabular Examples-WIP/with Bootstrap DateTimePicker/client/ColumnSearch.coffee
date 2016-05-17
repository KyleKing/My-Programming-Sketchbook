# If you want to see this in JS, try: http://js2.coffee/

# Nice for controlled debugging
# Troubleshoot = 'EditorsID'
# Troubleshoot = 'NumbersID'
Troubleshoot = 'BooksID'
# Troubleshoot = null

# The [TableID] allows for multiple tables in the same template
# This function is called once to initialize necessary variables
# Attach reactive var to window name space for reactivity and saving settings
@TabularSelectorInit = (TableID) ->
  if typeof window.TabularSelector is 'undefined'
    window.TabularSelector = new ReactiveVar({})
  sel = window.TabularSelector.get()
  sel[TableID] = {}
  sel[TableID].TheseClasses = []
  window.TabularSelector.set sel

# Create input boxes and attach event listener on key up
# Collect any values into the above initialized reactive var
@TabularSelectorMain = (TableID, collection) ->
  SelectedTable = '#' + TableID + ' thead th'
  $(SelectedTable).each ->
    # Localize the selector object:
    sel = window.TabularSelector.get()[TableID]
    # Fetch a List of "ColTitles" to differentiate between columns
    ColTitle = $(SelectedTable).eq($(this).index()).text()

    # Fetch and Store a List of "Classes" set in Tabular Tables
    # definition (i.e. {class = 'profile.name'})
    ThisClass = $(SelectedTable).eq($(this).index()).attr('class')
    # Remove excess sorting, sorting_asc class etc.
    ThisClass = ThisClass.replace(/(sortin)\w+/gi, '').trim()
    # Store classes for the reactive variable in the helper function
    if typeof(_.findWhere(sel, ThisClass)) is 'undefined'
      sel.TheseClasses.push(ThisClass)

    unless typeof ThisClass is 'undefined' or ThisClass is ''
      #
      # Create HTML Elements:
      #
      # Create input text input
      htmlSnippet = '<input type="text" placeholder="Search '
      $input = $(htmlSnippet + ColTitle + '"' + 'class="' + ThisClass + '"/>')
      $(this).html $input
      # Prevent sorting on click of input box
      $input.on 'click', (e) ->
        e.stopPropagation()
      #
      # Capture events on typing
      #
      $input.on 'keyup', (e) ->
        SearchString = @value
        # Localize selector
        sel = window.TabularSelector.get()[TableID]
        sel[ThisClass] = {}
        # If text in the input box:
        if SearchString
          # Find which column the user typed into
          columns = TabularTables[collection].options.columns
          # if Troubleshoot is TableID
          #   console.log 'columns values looking for class, '+ThisClass
          #   console.log columns
          column = _.clone(_.filter(columns, (item, index) ->
            (item.title is ColTitle)))
          # if Troubleshoot is TableID
          #   console.log 'column values from (Title) '+ColTitle
          #   console.log column
          #   console.log ' '
          # Util function from Meteor-Tabular
          sel[ThisClass].value = Util.getPubSelector({}, SearchString,
            {}, true, true, column)
        else
          # Otherwise clear text box
          delete sel[ThisClass]
        # Now save results of the above iterative function to the
        # reactive variable:
        GlobalSel = window.TabularSelector.get()
        GlobalSel[TableID] = sel
        if Troubleshoot is TableID
          console.log 'window.TabularSelector from, '+TableID+':'
          console.log GlobalSel
        window.TabularSelector.set GlobalSel

# Create a MongoDB selector that will cause Tabular Tables to reactively update
@TabularSelectorHelper = (TableID) ->
  # Get all selectors, but filter for only this TableID
  sel = window.TabularSelector.get()
  sel = sel[TableID]
  # Modify selector watched by Tabular Tables to update search parameters
  ReactiveTest = {}
  ReactiveTest['$and'] = [{}]
  _.each sel.TheseClasses, (ThisClass) ->
    unless typeof(sel[ThisClass]) is 'undefined'
      unless typeof(sel[ThisClass].value) is 'undefined'
        ReactiveTest['$and'].push((sel[ThisClass].value))
  if Troubleshoot is TableID
    console.log 'ReactiveTest Variable from '+TableID+' Helper Function:'
    console.log ReactiveTest
  ReactiveTest
