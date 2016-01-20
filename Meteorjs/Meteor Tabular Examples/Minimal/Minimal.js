// Would otherwise be in the lib folder:
var sales = new Mongo.Collection('sales');

if (Meteor.isServer && sales.find().count() === 0) {
  sales.insert({date: 1, quantity: 2, sales: 3, discount: 4, profit: 12, region: 15, segment: 16, category: 1});
}

TabularTables = {};
Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);
TabularTables.sales = new Tabular.Table({
    name: "sales",
    collection: sales,
    info: true,
    "dom": 'firt<"bottom"lp><"clear">',
    "lengthMenu": [5, 10, 25, 50],
    columns: [
      { data: "date", title: "date", class: "my_col", width: "12%" },
      { data: "quantity", title: "quantity", class: "my_col", width: "12%" },
      { data: "sales", title: "sales", class: "my_col", width: "11%" },
      { data: "discount", title: "discount", class: "my_col", width: "11%" },
      { data: "profit", title: "profit", class: "my_col", width: "11%" },
      { data: "region", title: "region", class: "my_col", width: "11%" },
      { data: "segment", title: "segment", class: "my_col", width: "12%" },
      { data: "category", title: "category", class: "my_col", width: "12%" },
      { tmpl: Meteor.isClient && Template.SalesActionBtns, title: "Edit/Delete", width: "8%"}
    ]
});

if (Meteor.isClient) {
    //Client:
    Template.TableContainer.created = function() {
        Meteor.subscribe("singlesale", Session.get('salesID'));
    }
    var Troubleshoot;
    Troubleshoot = null;
    this.TabularSelectorInit = function(TableID) {
        var sel;
        if (typeof window.TabularSelector === 'undefined') {
            window.TabularSelector = new ReactiveVar({});
        }
        sel = window.TabularSelector.get();
        sel[TableID] = {};
        sel[TableID].TheseClasses = [];
        return window.TabularSelector.set(sel);
    };
    this.TabularSelectorMain = function(TableID, collection) {
        var SelectedTable;
        SelectedTable = '#' + TableID + ' thead th';
        return $(SelectedTable).each(function() {
            var $input, ColTitle, ThisClass, htmlSnippet, sel;
            sel = window.TabularSelector.get()[TableID];
            ColTitle = $(SelectedTable).eq($(this).index()).text();
            ThisClass = $(SelectedTable).eq($(this).index()).attr(
                'class');
            ThisClass = ThisClass.replace(/(sortin)\w+/gi, '').trim();
            if (typeof(_.findWhere(sel, ThisClass)) === 'undefined') {
                sel.TheseClasses.push(ThisClass);
            }
            if (!(typeof ThisClass === 'undefined' || ThisClass ===
                '')) {
                htmlSnippet =
                    '<input type="text" placeholder="Search ';
                $input = $(htmlSnippet + ColTitle + '"' + 'class="' +
                    ThisClass + '"/>');
                $(this).html($input);
                $input.on('click', function(e) {
                    return e.stopPropagation();
                });
                return $input.on('keyup', function(e) {
                    var GlobalSel, SearchString, column,
                        columns;
                    SearchString = this.value;
                    sel = window.TabularSelector.get()[
                        TableID];
                    sel[ThisClass] = {};
                    if (SearchString) {
                        columns = TabularTables[collection]
                            .options.columns;
                        column = _.clone(_.filter(columns,
                            function(item, index) {
                                return item.title ===
                                    ColTitle;
                            }));
                        sel[ThisClass].value = Util.getPubSelector({},
                            SearchString, {}, true,
                            column);
                    } else {
                        delete sel[ThisClass];
                    }
                    GlobalSel = window.TabularSelector.get();
                    GlobalSel[TableID] = sel;
                    if (Troubleshoot === TableID) {
                        console.log(
                            'window.TabularSelector from, ' +
                            TableID + ':');
                        console.log(GlobalSel);
                    }
                    return window.TabularSelector.set(
                        GlobalSel);
                });
            }
        });
    };
    this.TabularSelectorHelper = function(TableID) {
        var ReactiveTest, sel;
        sel = window.TabularSelector.get();
        sel = sel[TableID];
        ReactiveTest = {};
        ReactiveTest['$and'] = [{}];
        _.each(sel.TheseClasses, function(ThisClass) {
            if (typeof sel[ThisClass] !== 'undefined') {
                if (typeof sel[ThisClass].value !== 'undefined') {
                    return ReactiveTest['$and'].push(sel[ThisClass]
                        .value);
                }
            }
        });
        if (Troubleshoot === TableID) {
            console.log('ReactiveTest Variable from ' + TableID +
                ' Helper Function:');
            console.log(ReactiveTest);
        }
        return ReactiveTest;
    };
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

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
