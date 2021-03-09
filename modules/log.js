var Log = new function() {
	var self = this;
	var isShow = false;
	var div = document.createElement("DIV");
	div.style.zIndex = "200";
	div.style.position = "fixed";
	div.style.right = "0px";
	div.style.top = "0px";
	div.style.backgroundColor = "gray";

	var btnDiv = document.createElement("DIV");
	var btn0 = document.createElement("INPUT");
	btn0.type = "button";
	btn0.value = " 클리어 ";
	btn0.style.margin = "3px 5px";
	btn0.onclick = function() {
		self.clean();
	};
	var btn2 = document.createElement("INPUT");
	btn2.type = "button";
	btn2.value = " 축소 ";
	btn2.style.margin = "3px 5px";
	btn2.onclick = function() {
		self.zoomOut();
	};
	var btn3 = document.createElement("INPUT");
	btn3.type = "button";
	btn3.value = " 확대 ";
	btn3.style.margin = "3px 5px";
	btn3.onclick = function() {
		self.zoomIn();
	};
	var btn4 = document.createElement("INPUT");
	btn4.type = "button";
	btn4.value = " 닫기 ";
	btn4.style.margin = "3px 5px";
	btn4.onclick = function() {
		self.hide();
	};

	btnDiv.appendChild(btn0);
	btnDiv.appendChild(btn2);
	btnDiv.appendChild(btn3);
	btnDiv.appendChild(btn4);
	div.appendChild(btnDiv);

	var textArea = document.createElement("TEXTAREA");
	textArea.readOnly = true;
	textArea.rows = 20;
	textArea.cols = 40;
	textArea.style.border = "0px";
	textArea.style.backgroundColor = "black";
	textArea.style.color = "white";
	textArea.style.overflow = "auto";
	div.appendChild(textArea);

	this.zoomOut = function() {
		textArea.rows = 20;
		textArea.cols = 40;
	};
	this.zoomIn = function() {
		textArea.rows = 40;
		textArea.cols = 80;
	};
	this.show = function() {
		document.body.appendChild(div);
		isShow = true;
	};
	this.hide = function() {
		div.parentNode.removeChild(div);
		isShow = false;
	};
	this.clean = function() {
		textArea.value = "";
	};
	/**
	 * @param msg {String}
	 */
	this.out = function(msg) {
		textArea.value += msg;
		textArea.value += '\n';
		textArea.scrollTop = textArea.scrollHeight;
	};
	function addEvent(obj, type, fn) {
		var key = 'e' + type + fn;

		if (!obj[key]) {
			obj[key] = function(e) {
				e = e || window.event;
				var target = e.target || e.srcElement;
				var current = e.currentTarget || obj;

				return fn(obj, target, current, e);
			};

			if (obj.attachEvent) {
				obj.attachEvent("on" + type, obj[key]);
			} else if (obj.addEventListener) {
				obj.addEventListener(type, obj[key], false);
			}
		}
	}
	addEvent(document, 'keyup', function(o, t, c, e) {
		switch (e.keyCode) {
		case 27: //ESC
			if (isShow) {
				self.hide();
			} else {
				self.show();
			}
			break;
		}
	});
	addEvent(window, 'load', function() {
		console.log = function(msg) {
			self.out(msg)
		};
		self.zoomIn();
		self.show();
	});
};