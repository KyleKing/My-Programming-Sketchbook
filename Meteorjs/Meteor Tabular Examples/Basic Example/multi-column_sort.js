// Would otherwise be in the lib folder:
Books = new Mongo.Collection("books");

// Code shared between client and server
TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Books = new Tabular.Table({
  name: "BookList",
  collection: Books,
  columns: [
    {data: "title", title: "Title"},
    {data: "author", title: "Author"},
    {data: "url", title: "Web address"}
  ]
});


// Server only code
if (Meteor.isServer && Books.find().count() === 0) {
  var books = [
    {title: "Discover Meteor", author: "Tom Coleman and Sacha Grief", url: "https://www.discovermeteor.com/"},
    {title: "Your First Meteor Application", author: "David Turnbull", url: "http://meteortips.com/first-meteor-tutorial/"},
    {title: "Meteor Tutorial", author: "Matthew Platts", url: "http://www.meteor-tutorial.org/"},
    {title: "Meteor in Action", author: "Stephen Hochaus and Manuel Schoebel", url: "http://www.meteorinaction.com/"},
    {title: "Meteor Cookbook", author: "Abigail Watson", url: "https://github.com/awatson1978/meteor-cookbook/blob/master/table-of-contents.md"}
  ]
  _.each(books, function (book) {
    Books.insert(book);
  })

  // Now just add a ton of documents:
  for (var j = 0; j < 100; j++) {
    Books.insert({
      title: "Fake Data",
      author: faker.name.findName(),
      url: faker.internet.url()
    });
  }
}