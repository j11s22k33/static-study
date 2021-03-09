/**
 * 
 * 버전 1.0 2013-05-31
 * 
 * **/
window.width = function() {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};
window.height = function() {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};
String.prototype.trim = function() {
	return this.replace(/^\s/g, '');
};
String.prototype.replaceAll = function(serchString, replaceString) {
	return this.replace(new RegExp(serchString, 'g'), replaceString);
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.toHTML = function() {
	if (!this.valueOf()) return " ";
	 var d = this;
     
    return f.replace(/(\s|\&|\>|\<|\"|\'|\\n)/gi, function($1) {
        switch ($1) {
        	case " ": return "&nbsp;";
    		case "&": return "&amp;";
    		case ">": return "&gt;";
    		case "<": return "&lt;";
    		case "\"": return "&quot;";
    		case "\'": return "&apos;";
    		case "\\n": return "<br>";
            default: return $1;
        }
    });
};
HTMLIFrameElement.prototype.getWindow = function() {
	return this.contentWindow || this.contentDocument.defaultView;
};
HTMLIFrameElement.prototype.getDocument = function() {
	return this.contentWindow.document || this.contentDocument;
};
HTMLSelectElement.prototype.getSelectedOption = function() {
	return this.options[this.options.selectedIndex];
};
HTMLSelectElement.prototype.getSelectedOptionValue = function() {
	return this.options[this.options.selectedIndex].value;
};
HTMLSelectElement.prototype.getSelectedOptionName = function() {
	return this.options[this.options.selectedIndex].text;
};
HTMLSelectElement.prototype.setSelectedOption = function(selectedOptionValue) {
	for ( var i = 0; i < this.options.length; i++) {
		if (this.options[i]["value"] == selectedOptionValue) {
			this.options.selectedIndex = i;
			break;
		}
	}
};

var $D = {};
$D.all = function() {
	return document.all || document.getElementsByTagName("*");
};
$D.create = function(tag) {
	return document.createElement(tag);
};
$D.get = function(cssSelector, parentNode) {
	switch (arguments.length) {
		case 1:
			return document.querySelector(cssSelector);
		case 2:
			return parentNode.querySelector(cssSelector);
	}
};
$D.getAll = function(cssSelector, parentNode) {
	switch (arguments.length) {
		case 1:
			return document.querySelectorAll(cssSelector);
		case 2:
			return parentNode.querySelectorAll(cssSelector);
	}
};
Element.prototype.getClass = function() {
	var className = this.getAttribute('class');
	if (className) {
		return className;
	} else {
		return '';
	}
};
Element.prototype.hasClass = function(cls) {
	var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	return this.getClass().match(reg);
};
Element.prototype.addClass = function(cls) {
	if (!this.hasClass(cls)) {
		this.setAttribute('class', this.getClass() + ' ' + cls);
	}
	return this;
};
Element.prototype.removeClass = function(cls) {
	var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	this.setAttribute('class', this.getClass().replace(reg, ' '));
	return this;
};
Element.prototype.replaceClass = function(oldcls, newcls) {
	var reg = new RegExp('(\\s|^)' + oldcls + '(\\s|$)');
	this.setAttribute('class', this.getClass().replace(reg, ' ' + newcls + ' '));
	return this;
};
Element.prototype.position = function() {
	return {
		left : this.offsetLeft,
		top : this.offsetTop,
	};
};
Element.prototype.offset = function() {
	return {
		left : this.offsetLeft,
		top : this.offsetTop,
		width : this.offsetWidth,
		height : this.offsetHeight,
	};
};
Element.prototype.bounds = function(parentNode) {
	var myR = this.getBoundingClientRect();
	var rect = {
		left : myR.left,
		right : myR.right,
		top : myR.top,
		bottom : myR.bottom,
		width : myR.width ? myR.width : myR.right - myR.left,
		height : myR.height ? myR.height : myR.bottom - myR.top,
	};
	switch (arguments.length) {
		case 1:
			var parentR = parentNode.getBoundingClientRect();
			rect.left = rect.left - parentR.left;
			rect.right = rect.right - parentR.right;
			rect.top = rect.top - parentR.top;
			rect.bottom = rect.bottom - parentR.bottom;
			break;
	}
	return rect;
};
Element.prototype.appendTo = function(parentNode) {
	parentNode.appendChild(this);
	return this;
};
Element.prototype.append = function(childNode) {
	this.appendChild(childNode);
	return this;
};

Element.prototype.remove = function() {
	this.parentNode.removeChild(this);
	return this;
};
Element.prototype.empty = function() {
	if ('innerHTML' in this) {
		this.innerHTML = '';
	} else {
		while (this.hasChildNodes()) {
			this.removeChild(this.firstChild);
		}
	}
	return this;
};
//backgroundColor
Element.prototype.css = function(key, val) {
	switch (arguments.length) {
		case 1:
			return this.style[key];
		case 2:
			this.style[key] = val;
			return this;
	}
};
Element.prototype.attr = function(key, val) {
	switch (arguments.length) {
		case 1:
			return this.getAttribute(key);
		case 2:
			this.setAttribute(key, val);
			return this;
	}
};
Element.prototype.text = function(text, replaceText) {
	switch (arguments.length) {
		case 0:
			if ('textContent' in this) {
				return this.textContent;
			} else {
				return this.innerText;
			}
		case 1:
			if ('textContent' in this) {
				this.textContent = text;
			} else {
				this.innerText = text;
			}
			return this;
		case 2:
			if ('textContent' in this) {
				this.textContent = this.textContent.replace(new RegExp(text, 'g'), replaceText);
			} else {
				this.textContent = this.innerText.replace(new RegExp(text, 'g'), replaceText);
			}
			return this;
	}
};
Element.prototype.html = function(html, replaceHtml) {
	switch (arguments.length) {
		case 0:
			return this.innerHTML;
		case 1:
			this.innerHTML = html;
			return this;
		case 2:
			this.innerHTML = this.innerHTML.replace(new RegExp(html, 'g'), replaceHtml);
			return this;
	}
};
Element.prototype.val = function(val, replaceVal) {
	switch (arguments.length) {
		case 0:
			return this.value;
		case 1:
			this.value = val;
			return this;
		case 2:
			this.value = this.value.replace(new RegExp(val, 'g'), replaceVal);
			return this;
	}
};
Element.prototype.opacity = function(value) {
	this.style.opacity = (value / 100); //CHROME
	this.style.MozOpacity = (value / 100); //NETSCAPE
	this.style.KhtmlOpacity = (value / 100); //SAFARI 1.x
	this.style.filter = "alpha(opacity=" + value + ")"; //IE 5-7
	this.style.MsFilter = " 'progid:DXImageTransform.Microsoft.Alpha(opacity=" + value + ")' "; // IE 8
	return this;
};

/**	event = event || window.event;
	var target = event.target || event.srcElement;
	var current = event.currentTarget || this; 
*/
Element.prototype.setEvent = function(type, fn) {
	switch (arguments.length) {
		case 1:
			this['on' + type] = null;
			break;
		case 2:
			this['on' + type] = fn;
			break;
	}
	return this;
};

/**
 * iframe onload 가 없다. 그런데 addEvent 하면 동작한다!!?
 * */
Element.prototype.addEvent = function(type, fn, useCapture) {
	if (arguments.length < 3) {
		useCapture = false;
	}
	var key = 'e' + type + fn;
	if (!this[key]) {
		this[key] = fn;
		if (this.attachEvent) {
			this.attachEvent('on' + type, this[key]);
		} else if (this.addEventListener) {
			this.addEventListener(type, this[key], useCapture);
		}
	}
	return this;
};
Element.prototype.removeEvent = function(type, fn, useCapture) {
	if (arguments.length < 3) {
		useCapture = false;
	}
	var key = 'e' + type + fn;
	if (this[key]) {
		if (this.detachEvent) {
			this.detachEvent('on' + type, this[key]);
		} else if (this.removeEventListener) {
			this.removeEventListener(type, this[key], useCapture);
		}
		this[key] = null;
	}
	return this;
};
//eventType = click, dbclick
Element.prototype.trigger = function(eventType, targetElement) {
	if ( /*@cc_on ! @*/false) {
		targetElement.fireEvent('on' + eventType);
	} else {
		var event = document.createEvent("Events");
		event.initEvent(eventType, true, true);
		targetElement.dispatchEvent(event);
	}
};
