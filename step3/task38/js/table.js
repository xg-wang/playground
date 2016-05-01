/**
 * Widgets Module containing all the widget object available.
 */
var Widgets = (function() {

  var sortTable = function(id, headers, data, getSortFns) {
    if (this instanceof sortTable) {
      for (var p in data) {
        if (data[p].length != headers.length - 1) {
          throw {
            message: 'colomn not match',
            name: 'DimenssionException'
          }
        }
      }
      this.id = id || 'SORTTABLE';
      this.headers = headers || ['h1', 'h2'];
      this.data = data || [1, 2];
      this.getSortFns = getSortFns;
      this.init();
    } else {
      return new sortTable(id, headers, data, getSortFns);
    }
  }

  return {
    // popup: popup,
    sortTable: sortTable,
  };
}());

Widgets.sortTable.prototype = {
  init: function() {
    var table = document.getElementById(this.id);
    if (!table) {
      table = document.createElement('table');
      table.id = this.id;
      document.body.insertBefore(table, document.body.firstChild);
    }
    this.dom = table;
    this.currOrder = Object.keys(this.data);
    this.render();
  },

  render: function() {
    var innerHTML = '';
    innerHTML += '<tr>';
    innerHTML += this.headers.map(function(item) {
      return '<th>' + item + '</th>';
    }).join('');
    innerHTML += '</tr>';

    for (var i = 0; i < this.currOrder.length; i++) {
      var key = this.currOrder[i];
      innerHTML += '<tr><td>' + key + '</td>';
      innerHTML += this.data[key].map(function(item) {
        return '<td>' + item + '</td>';
      }).join('');
      innerHTML += '</tr>';
    }

    this.dom.innerHTML = innerHTML;
  }
}
