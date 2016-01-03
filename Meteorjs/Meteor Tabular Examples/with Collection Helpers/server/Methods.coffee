Meteor.methods SquareOne: () ->
  # Generally a bad idea...but...
  Books.remove({})
  Editors.remove({})
  Numbers.remove({})
  'Erased'

Meteor.methods FreshStart: () ->
  # Now repopulate the database:
  editors = [
    { firstName: 'David', lastName: 'Turnbull', other: '1_words' },
    { firstName: 'Tom', lastName: 'Coleman', other: '2_words' },
    { firstName: 'Matthew', lastName: 'Platts', other: '3_words' },
    { firstName: 'Stephen', lastName: 'Hochaus', other: '4_words' },
    { firstName: 'Abigail', lastName: 'Watson', other: '5_words' }
  ]
  _.each editors, (editor) ->
    Editors.insert editor

  books = [
    {
      title: 'Discover Meteor'
      author: faker.name.findName()
      url: 'http://www.dd.com/aaaaaa'
      parent: [{
        child: 'dd'
      }]
    }
    {
      title: faker.commerce.productName()
      author: faker.name.findName()
      url: 'https://.bb.com/bbbbb'
      parent: [{
        child: 'bb'
      }]
    }
    {
      title: faker.commerce.productAdjective()
      author: faker.name.findName()
      url: 'https://www.cc.com/cccccc'
      parent: [{
        child: 'cc'
      }]
    }
    {
      title: 'Discover Meteor'
      author: 'Tom Coleman and Sacha Grief'
      url: 'https://www.discovermeteor.com/ddddd'
      parent: [{
        child: 'aaaaaa'
      }]
    }
    {
      title: 'Your First Meteor Application'
      author: 'David Turnbull'
      url: 'http://meteortips.com/first-meteor-tutorial/aa'
      parent: [{
        child: 'bbbbb'
      }]
    }
    {
      title: 'Meteor Tutorial'
      author: 'Matthew Platts'
      url: 'http://www.meteor-tutorial.org/eeeee'
      parent: [{
        child: 'cccccc'
      }]
    }
    {
      title: 'Meteor in Action'
      author: 'Stephen Hochaus and Manuel Schoebel'
      url: 'http://www.meteorinaction.com/'
      parent: [{
        child: 'ddddd'
      }]
    }
    {
      title: faker.company.companyName()
      author: 'Tom Coleman and Sacha Grief'
      url: 'http://www.aa.com/'
      parent: [{
        child: 'aa'
      }]
    }
    {
      title: 'Meteor Cookbook'
      author: 'Abigail Watson'
      url: 'https://github.com/awatson1978/meteor-cookbook/blob/master/table-of-contents.md'
      parent: [{
        child: 'eeeee'
      }]
    }
  ]
  # Create Regex
  regex = new RegExp /^https?:\/\/(?:w{3})?[.]?([^\/]{2})[^\/]*/
  console.log 'regex: '+regex
  _.each books, (book) ->
    # For later to show lookup between collections/documents
    # # This isn't exciting, but demonstrates a collection helper in use
    # FirstName = book.author.split(' ')[0].trim()
    # book.editorid = Editors.findOne({
    #   firstName: FirstName
    # })._id
    #
    # Make field to sort the urlParse fields by:
    book.URLSort = book.url.match(regex)[1]
    console.log 'book.URLSort: '+book.URLSort
    Books.insert book

  CurrentDay = ->
    dateFunc = new Date
    start = new Date(dateFunc.getFullYear(), 0, 0)
    diff = dateFunc - start
    oneDay = 1000 * 60 * 60 * 24
    day = Math.floor(diff / oneDay)
    [day, dateFunc.getTime()]

  [today, now] = CurrentDay()
  numbers = [
    { Text: 'Kyle', TimeStamp: 1 },
    { Text: 'Chuff', TimeStamp: 2 },
    { Text: 'David', TimeStamp: 3 },
    { Text: 'Tom', TimeStamp: 5 },
    { Text: 'Matthew', TimeStamp: 7 },
    { Text: 'Stephen', TimeStamp: 9 },
    { Text: 'Abigail', TimeStamp: 11 }
  ]
  _.each numbers, (number) ->
    Numbers.insert {
      Text: number.Text
      TimeStamp: now - (1000000 * number.TimeStamp)
    }


  # Now just add a ton of documents:
  j = 0
  while j < 1000
    Link = faker.internet.url()+'/'+faker.company.catchPhrase().replace(/\s/g, '/')
    Lots.insert {
      title: 'Fake Data'
      firstName: faker.name.firstName()
      lastName: faker.name.lastName()
      url: Link
      URLSort: Link.match(regex)[1]
    }
    j++

  'mission accomplished'
