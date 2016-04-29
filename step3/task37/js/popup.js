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
	/**
	 * popup surface widget to show info
	 * @param  {string} id	   the id of the html element generated
	 * @param  {Json} config   the configuration of the popup widget
	 * @return {Object}		     the widget object
	 */
	var popup = function(id, config){
		if(this instanceof popup)
		{
			this.id = id || "POPUP";
			this.config = config || this.default_config;
			this.init();
		}else{
			return new popup(id, config);
		}
	}

	return {
		popup: popup
	};
}());

Widgets.popup.prototype = {
	// default config map
	default_config: {
		width: '300px',
		height: '200px',
		title_height: '28px',
		title: 'Title',
		content: 'Contents',
		ismovable: true,//是否可移动
		isresizable: true,//是否可以改变大小
		confirmCallback: function(){alert('confirm')},
		cancelCallback: function(){alert('cancel')},
	},

	// Create a new popup widget
	init: function(){
		// If there isn't one, create one at the start of the document.
		var popup = document.getElementById(this.id);
		if (!popup) {
			popup = document.createElement("div");
			popup.id = this.id;
			popup.className = "popup";
			document.body.insertBefore(popup, document.body.firstChild);
			// set style
			ps = popup.style;
			ps.width = this.config.width;
			ps.height = this.config.height;
			ps.background = "#FFFFFF"
			ps.position = "fixed";
			ps.left = "50%";
			ps.top = "50%";
			ps.marginRight = "-50%";
			ps.transform = "translate(-50%, -50%)";
			ps.zIndex = "9999";
			ps.border = "3px outset gray";
			// set rest
			this.setTitle(popup);
			this.setContent(popup);
			this.setButton(popup);
			this.setMask();
		}
	},


	setTitle: function(popup){
		var title = document.createElement("header");
		title.className = "popup-header";
		title.innerHTML = this.config.title;
		popup.appendChild(title);
		// set style
		ts = title.style;
		ts.position = "relative";
		ts.top = "0px";
		ts.height = this.config.title_height;
		ts.padding = "3px 5px 2px 5px";
		ts.background = "#aaa";
		ts.borderBottom = "2px groove gray"
		ts.fontFamily = "bold";
		ts.fontSize = "14pt"
	},

	setContent: function(popup){
		var content = document.createElement("section");
		content.className = "popup-content";
		content.innerHTML = this.config.content;
		popup.appendChild(content);
		// set style
		cs = content.style;
		cs.position = "relative";
		cs.height = "125px";
		cs.padding = "5px";
		cs.margin = "0px";
		cs.overflow = "auto";
		cs.background = "#fff";
		cs.fontSize = "12px";
	},

	setButton: function(popup){
		self = this;
		var btnWrapper = document.createElement("div");
		btnWrapper.className = "btn-wrapper";
		// set wrapper style
		bws = btnWrapper.style;
		bws.position = "absolute";
		bws.right = "10px";
		bws.bottom = "0px";
		bws.height = "30px";
		popup.appendChild(btnWrapper);
		var confirmBtn = document.createElement("button");
		confirmBtn.innerHTML = "确认";
		setBtnStyle(confirmBtn);
		confirmBtn.onclick = function(){
			self.config.confirmCallback();
			self.delete();
		}
		btnWrapper.appendChild(confirmBtn);
		var cancelBtn = document.createElement("button");
		cancelBtn.innerHTML = "取消";
		setBtnStyle(cancelBtn);
		cancelBtn.onclick = function(){
			self.config.cancelCallback();
			self.delete();
		}
		btnWrapper.appendChild(cancelBtn);

		function setBtnStyle(btn, callback){
			bs = btn.style;
			bs.background = "gray";
			bs.padding = "5px 10px";
			bs.marginRight = "5px";
			bs.color = "white";
			bs.cursor = "pointer";
		}
	},

	// mask that covers the rest area
	setMask: function(){
    mask = document.createElement("div");
    mask.id = this.id + "-mask";
    document.body.insertBefore(mask, document.body.firstChild);
    // set style
    ms = mask.style;
    ms.position = "fixed";
    ms.height = "100%";
    ms.width = "100%";
    ms.background = "gray";
    ms.opacity = "0.3";
	},

	setEvent: function(){
		// drag
		// resize
	},

	// Delete the popup widget if exists
	delete: function(id){
		var id = id || this.id;
		var popup = document.getElementById(id);
		if (popup) {
			document.body.removeChild(popup);
      var mask = document.getElementById(id + "-mask");
      document.body.removeChild(mask);
			return true;
		} else {
			return false;
		}
	}
}
