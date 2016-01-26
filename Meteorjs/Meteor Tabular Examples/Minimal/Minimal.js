// Could be in lib/collections.js
sales = new Mongo.Collection('sales');

// Declared on both client and server, so could be in a folder called 'both'
// But not in the client or server folders
TabularTables = {};
Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);
TabularTables.sales = new Tabular.Table({
    name: "sales",
    collection: sales,
    info: true,
    "dom": 'firt<"bottom"lp><"clear">',
    "lengthMenu": [5, 10, 25, 50],
    columns: [
      { data: "date", title: "date", class: "date"},
      { data: "quantity", title: "quantity", class: "quantity"},
      { data: "sales", title: "sales", class: "sales"},
      { data: "discount", title: "discount", class: "discount"},
      { data: "profit", title: "profit", class: "profit"},
      { data: "region", title: "region", class: "region"},
      { data: "segment", title: "segment", class: "segment"},
      { data: "category", title: "category", class: "category"},
      { tmpl: Meteor.isClient && Template.SalesActionBtns, title: "Edit/Delete"}
    ]
});

// Could be somewhere in the client folder:
if (Meteor.isClient) {
	Template.TableContainer.created = function() {
	    return TabularSelectorInit('salesdata');
	};
	Template.TableContainer.rendered = function() {
	    return TabularSelectorMain('salesdata', 'sales');
	};
	Template.TableContainer.helpers({
	    currentSelector: function() {
	        return TabularSelectorHelper('salesdata');
	    }
	});
}


// Could be in server/seed_data.js
if (Meteor.isServer && sales.find().count() === 0) {
  sales.insert({date: 'test 1', quantity: 2, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
  sales.insert({date: 'test 3', quantity: 3, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
  sales.insert({date: 'test 4', quantity: 4, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
  sales.insert({date: 'test 2', quantity: 5, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
}