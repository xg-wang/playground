/**
 * Widgets Module containing all the widget object available.
 */
var Widgets = (function() {

  var sortTable = function(id, headers, data, getLargerFunc) {
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
      this.getLargerFunc = getLargerFunc;
      this.init();
    } else {
      return new sortTable(id, headers, data, getLargerFunc);
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
      return '<th style="position: relative; padding-right: 16px">' + item + '</th>';
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
    this.setSort();
  },

  setSort: function() {
    var self = this;

    for (var i = 0; i < this.headers.length; i++) {
      var key = this.headers[i];
      var larger = this.getLargerFunc(key);
      if (larger) {
        var arrows = addArrows(i);
        this.dom.firstChild.firstChild.children[i].appendChild(arrows);
      }
    }

    function addArrows(i) {
      // structure
      var wrapper = document.createElement('div');
      var up = document.createElement('div');
      var down = document.createElement('div');
      wrapper.appendChild(up);
      wrapper.appendChild(down);
      // style
      wrapper.style.width = '8px';
      wrapper.style.height ='20px';
      wrapper.style.display = 'block';
      wrapper.style.position = 'absolute';
      wrapper.style.top = '2px';
      wrapper.style.right = '4px';
      us = up.style;
      ds = down.style;
      // us.display = ds.display = 'inline-block';
      us.position = ds.position = 'absolute';
      us.top = '0px';
      ds.top = '12px';
      us.width = ds.width = '0px';
      us.height = ds.height = '0px';
      us.borderLeft = ds.borderLeft
                    = us.borderRight
                    = ds.borderRight
                    = '4px solid transparent';
      us.borderBottom = '8px solid gray';
      ds.borderTop = '8px solid gray';

      // listener
      larger = self.getLargerFunc(self.headers[i]);
      up.onclick = function() {
        self.currOrder.sort(function(l, r) {
          return -larger(self.data[l][i - 1], self.data[r][i - 1]);
        });
        self.render();
      }
      down.onclick = function() {
        self.currOrder.sort(function(l, r) {
          return larger(self.data[l][i - 1], self.data[r][i - 1]);
        });
        self.render();
      }
      return wrapper;
    }
  }
}
