# Run Once
Template.BooksTemplate.created = ->
  TabularSelectorInit('BooksID')
# Run whenever template changes occur (i.e. re-render)
Template.BooksTemplate.rendered = ->
  TabularSelectorMain('BooksID', 'Books')
# Create helper to ...
Template.BooksTemplate.helpers
  currentSelector: ->
    TabularSelectorHelper('BooksID')

Template.EditorsTemplate.created = ->
  TabularSelectorInit('EditorsID')
Template.EditorsTemplate.rendered = ->
  TabularSelectorMain('EditorsID', 'Editors')
Template.EditorsTemplate.helpers
  currentSelector: ->
    TabularSelectorHelper('EditorsID')

Template.NumbersTemplate.created = ->
  TabularSelectorInit('NumbersID')
Template.NumbersTemplate.rendered = ->
  TabularSelectorMain('NumbersID', 'Numbers')
Template.NumbersTemplate.helpers
  currentSelector: ->
    TabularSelectorHelper('NumbersID')

