/**
 * addEventHandler方法
 * 跨浏览器实现事件绑定
 */
function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+event, hanlder);
    } else  {
        ele["on" + event] = hanlder;
    }
}

/**
 * Widgets Module containing all the widget object available.
 */
var Widgets = (function() {

  // sortTable
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
  };
  sortTable.prototype = {
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
      innerHTML += '<thead><tr>';
      innerHTML += this.headers.map(function(item) {
        return '<th style="position: relative; padding-right: 16px">' + item + '</th>';
      }).join('');
      innerHTML += '</tr></thead>';

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
  
  // frozenTable
  var frozenTable = function(id, headers, data, getLargerFunc) {
    if (this instanceof frozenTable) {
      sortTable.call(this, id, headers, data, getLargerFunc);
      this.setFrozenStyle();
    } else {
      return new frozenTable(id, headers, data, getLargerFunc);
    }
  };
  // inherit from sortTable
  frozenTable.prototype = Object.create(sortTable.prototype);
  frozenTable.prototype.constructor = frozenTable;
  
  frozenTable.prototype.setFrozenStyle = function() {
    self = this;
    table = this.dom;
    headElement = table.firstChild.firstChild;
    // clone a fixed fake head
    var fixedHeadElement = headElement.cloneNode(true);
    fixedHeadElement.style.display = 'none';
    fixedHeadElement.style.position = 'fixed';
    fixedHeadElement.style.top = '0px';
    fixedHeadElement.style.display = 'none';
    fixedHeadElement.style.zIndex = '9999';
    if (!fixedHeadElement.style.background) {
      fixedHeadElement.style.background = 'white';
    }
    headElement.parentNode.insertBefore(fixedHeadElement, headElement);
    
    hs = headElement.style;
    addEventHandler(window, "scroll", scrollFixEvent);
    
    function scrollFixEvent() {
      var scrollTop = document.documentElement.scrollTop
                      || document.body.scrollTop;
      if (self.dom.offsetTop - scrollTop <= 0 &&
          self.dom.offsetTop + parseInt(getComputedStyle(self.dom).height)
                             - scrollTop >= 0) {
        fixedHeadElement.style.display = 'table-row';
      } else {
        fixedHeadElement.style.display = 'none';
      }
    }
    
  }

  return {
    // popup: popup,
    sortTable: sortTable,
    frozenTable: frozenTable,
  };
}());


