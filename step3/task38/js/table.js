/**
 * Widgets Module containing all the widget object available.
 */
var Widgets = (function() {

  var sortTable = function(id, names, data, getSortFns) {
    if (this instanceof sortTable) {
      for (var p in data) {
        if (data[p].length != names.length - 1) {
          throw {
            message: "colomn not match",
            name: "DimenssionException"
          }
        }
      }
      this.id = id || "SORTTABLE";
      this.names = names;
      this.data = data;
      this.getSortFns = getSortFns;
      this.init();
    } else {
      return new sortTable(id, names, data, getSortFns);
    }
  }

  return {
    // popup: popup,
    sortTable: sortTable,
  };
}());

Widgets.sortTable.prototype = {
  init: function() {

  }
}
