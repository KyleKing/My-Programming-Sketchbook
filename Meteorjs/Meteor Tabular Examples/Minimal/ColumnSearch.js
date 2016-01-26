if (Meteor.isClient) {

  var Troubleshoot = 'salesdata';

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
      ThisClass = $(SelectedTable).eq($(this).index()).attr('class');
      ThisClass = ThisClass.replace(/(sortin)\w+/gi, '').trim();
      if (typeof (_.findWhere(sel, ThisClass)) === 'undefined') {
        sel.TheseClasses.push(ThisClass);
      }
      if (!(typeof ThisClass === 'undefined' || ThisClass === '')) {
        htmlSnippet = '<input type="text" placeholder="Search ';
        $input = $(htmlSnippet + ColTitle + '"' + 'class="' + ThisClass + '"/>');
        $(this).html($input);
        $input.on('click', function(e) {
          return e.stopPropagation();
        });
        return $input.on('keyup', function(e) {
          var GlobalSel, SearchString, column, columns;
          SearchString = this.value;
          sel = window.TabularSelector.get()[TableID];
          sel[ThisClass] = {};
          if (SearchString) {
            columns = TabularTables[collection].options.columns;
            column = _.clone(_.filter(columns, function(item, index) {
              return item.title === ColTitle;
            }));
            sel[ThisClass].value = Util.getPubSelector({}, SearchString, {}, true, true, column);
          } else {
            delete sel[ThisClass];
          }
          GlobalSel = window.TabularSelector.get();
          GlobalSel[TableID] = sel;
          if (Troubleshoot === TableID) {
            console.log('window.TabularSelector from, ' + TableID + ':');
            console.log(GlobalSel);
          }
          return window.TabularSelector.set(GlobalSel);
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
          return ReactiveTest['$and'].push(sel[ThisClass].value);
        }
      }
    });
    if (Troubleshoot === TableID) {
      console.log('ReactiveTest Variable from ' + TableID + ' Helper Function:');
      console.log(ReactiveTest);
    }
    return ReactiveTest;
  };

  // ---
  // generated by coffee-script 1.9.2

}