# Make global for sort function
@TabularTables = {}

Meteor.isClient and Template.registerHelper('TabularTables', TabularTables)

# Used several times:
urlRegExp = ['^https?:\\/\\/(?:w{3})?[.]?([^\\/]*)', '[^\\/]*', '[^\\/]*', null]

TabularTables.Books = new (Tabular.Table)(
  name: 'BookList'
  collection: Books
  columns: [
    {
      data: 'title'
      title: 'Title'
      class: 'title'
    }
    {
      data: 'url'
      title: 'URL'
      class: 'url'
      # searchable: false
    }
    {
      data: 'urlParse()'
      title: 'urlParse()'
      class: 'url'
      # orderable: false
      # searchable: false
      options: {
        SplitBy: ','
        # To turn RegExp off:
        # regex: ['^https?:\/\/(?:w{3})?[.]?([^\/]*)', null, '[^\/]*']
        # Reliable RegExp that uses grouping for client:
        # Note the '^' should help speed up the regex search
        regex: urlRegExp
        # # Stronger (not reliable...) RegExp that only captures the
        # # hostname, if used without global flag
        # regex: ['[^(?:http)(?:https)\/(?:w{3})\.][^\/]*', '[^\/]*', '[^\/]*']
        sortfield: 'URLSort'
      }
    }
    {
      data: 'URLSort'
      title: 'URLSort'
      searchable: false
      # orderable: false
    }
    {
      data: 'parent.0.child'
      title: 'Sample Dot Notation'
      class: 'parent.0.child'
    }
  ]
  extraFields: ['url', 'URLSort']
)

Books.helpers urlParse: ->
  # column = _.filter columns, (item, index) ->
  #   if Troubleshoot is TableID
  #     console.log 'filter '+(item.title is ColTitle)+' for '+index
  #   # From SO: http://stackoverflow.com/a/32879608/3219667
  #   _.contains( [ColTitle], item.title)
  # TODO FIX WHEN #columns changes...
  regex = new RegExp urlRegExp[0]
  @url.match(regex)[1]



TabularTables.Editors = new (Tabular.Table)(
  name: 'EditorList'
  collection: Editors
  columns: [
    {
      data: '_id'
      title: 'Doc ID'
      class: '_id'
    }
    {
      data: 'fullName()'
      title: 'fullName()'
      class: 'firstName lastName'
      options: {
        # Multiple RegExp example:
        regex: [
          [null]
          # ['^(?:', null, ')', '^\\D{2}']
          # One approach to select from the list of characters
          ['^[', null, ']{1,2}', 2]
        ]
      }
    }
    {
      data: 'other'
      title: 'Extra Data'
      class: 'other'
    }
  ]
  extraFields: ['firstName', 'lastName']
)

Editors.helpers fullName: ->
  # TODO FIX WHEN #columns changes...
  # regex = new RegExp TabularTables.Editors.options.columns[1].options.regex[1][0]
  # The same regexp can't always be used:
  # (Note, when creating a new RegExp from a string,
  # use two '\' or the '\' will be removed)
  regex = new RegExp '^\\D{2}'
  @firstName+' '+@lastName.match(regex)+'.'




TabularTables.Numbers = new (Tabular.Table)(
  name: 'NumberList'
  collection: Numbers
  columns: [
    {
      data: 'Text'
      title: 'Sample Text'
      class: 'Text'
    }
    {
      data: 'TimeStamp'
      title: 'TimeStamp'
    }
    {
      data: 'NiceDate()'
      title: 'NiceDate()'
    }
  ]
)

Numbers.helpers NiceDate: ->
  DateFormats =
    shortest: 'hh:mm:ss a'
    short: 'hh:mm:ss a M-D-YY'
    long: 'dddd DD.MM.YYYY hh:mm:ss a'
  # UI.registerHelper 'formatDate', (@Positions[0].Timestamp, format) ->
  if moment
    format = 'shortest'
    # can use other formats like 'lll' too
    format = DateFormats[format] or format
    moment(@TimeStamp).format format
  else
    @TimeStamp



TabularTables.Lots = new (Tabular.Table)(
  name: 'LotsList'
  collection: Lots
  columns: [
    {
      data: 'title'
      title: 'Title'
      searchable: false
    }
    {
      data: 'fullName()'
      title: 'fullName()'
      class: 'firstName lastName'
      options: {
        # Multiple RegExp example:
        regex: [
          [null]
          ['^[', null, ']{1,2}', 2]
        ]
      }
    }
    {
      data: 'urlParse()'
      title: 'urlParse()'
      class: 'url'
      options: {
        regex: urlRegExp
        sortfield: 'URLSort'
      }
    }
  ]
  extraFields: ['firstName', 'lastName', 'url', 'URLSort']
)

Lots.helpers
  fullName: ->
    @firstName+' '+@lastName.match(/\D{2}/)+'.'
  urlParse: ->
    regex = new RegExp urlRegExp[0]
    @url.match(regex)[1]


