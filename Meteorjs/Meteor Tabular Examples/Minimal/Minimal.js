// First create a collection
// Note: not created with 'var' because we want this to a global value
sales = new Mongo.Collection('sales');

// This is the basic code for creating Tabular Tables
TabularTables = {};
Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);
TabularTables.sales = new Tabular.Table({
    name: "sales",
    collection: sales,
    info: true,
    "dom": 'firt<"bottom"lp><"clear">',
    "lengthMenu": [5, 10, 25, 50],
    columns: [
      { data: "date", title: "date", class: "date", width: "12%"},
      { data: "quantity", title: "quantity", class: "quantity", width: "12%"},
      { data: "sales", title: "sales", class: "sales", width: "11%"},
      { data: "discount", title: "discount", class: "discount", width: "11%"},
      { data: "profit", title: "profit", class: "profit", width: "11%"},
      { data: "region", title: "region", class: "region", width: "11%"},
      { data: "segment", title: "segment", class: "segment", width: "12%"},
      { data: "category", title: "category", class: "category", width: "12%"},
      { tmpl: Meteor.isClient && Template.SalesActionBtns, title: "Edit/Delete", width: '8%'}
    ]
});

// Initiate the tabular tables functions for searching
if (Meteor.isClient) {
	Template.TableContainer.created = function() {
	    return TCS.Created('salesdata');
	};
	Template.TableContainer.rendered = function() {
	    return TCS.Rendered('salesdata', 'sales');
	};
	Template.TableContainer.helpers({
	    currentSelector: function() {
	        return TCS.Helper('salesdata');
	    }
	});
}

// Not implemented:
// Template.TableContainer.created = function(){
//     Meteor.subscribe("singlesale", Session.get('salesID'));
// }

// Create some really fake seed data
if (Meteor.isServer && sales.find().count() === 0) {
  sales.insert({date: 'test 1', quantity: 2, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
  sales.insert({date: 'test 3', quantity: 3, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
  sales.insert({date: 'test 4', quantity: 4, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
  sales.insert({date: 'test 2', quantity: 5, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
}
