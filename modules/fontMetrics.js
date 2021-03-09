var FontMetrics = new function() {
	var div = document.createElement("nobr");
	var nobr = document.createElement("span");
	nobr.appendChild(div);

	function ready() {
		if (nobr.parentNode != document) {
			document.body.appendChild(nobr);
			nobr.setAttribute("style", "position:absolute; top:-1000px; visibility:hidden");
		}
	}

	function getBox(element) {
		if (element.getBoundingClientRect) { // Internet Explorer, Firefox 3+, Google Chrome, Opera 9.5+, Safari 4+
			var rect = element.getBoundingClientRect();
			x = rect.left;
			y = rect.top;
			w = rect.right - rect.left;
			h = rect.bottom - rect.top;
			return {
				"x" : x,
				"y" : y,
				"w" : w,
				"h" : h
			};
		} else {
			return {
				"x" : 0,
				"y" : 0,
				"w" : 0,
				"h" : 0
			};
		}
	}
	/**
	 * @param style {String} 'font-size:10px; font-weight: bold;'
	 * @param str {String} text
	 * @returns JSON {JSON} {x:0, y:0, w:0, h:0}
	 */
	this.getSize = function(style, str) {
		ready();
		if (style)
			div.setAttribute("style", style);
		setText(div, str);
		return getBox(div);
	};
	/**
	 * @param style {String} 'font-size:10px; font-weight: bold;'
	 * @param w {Number} cutting width .. pixel
	 * @param str {String} text
	 * @returns {String}
	 */
	this.toClip = function(style, w, str) {
		ready();
		if (style)
			div.setAttribute("style", style);
		setText(div, str);
		if (getBox(div)["w"] <= w) {
			return str;
		}

		setText(div, '');
		for ( var i = 0; i < str.length; i++) {
			var o = getText(div);

			addText(div, str.charAt(i));
			if (getBox(div)["w"] > w) {
				return String(o);
			}
		}
	};
	/**
	 * @param style {String} 'font-size:10px; font-weight: bold;'
	 * @param w {Number} cutting width .. pixel
	 * @param str {String} text
	 * @returns {String}
	 */
	this.toEllipsis = function(style, w, str) {
		ready();
		if (style)
			div.setAttribute("style", style);
		setText(div, str);
		if (getBox(div)["w"] <= w) {
			return str;
		}

		var s = "";
		setText(div, '...');
		for ( var i = 0; i < str.length; i++) {
			var o = getText(div);

			s += str.charAt(i);
			setText(div, s + "...");
			if (getBox(div)["w"] > w) {
				return String(o);
			}
		}
	};
	/**
	 * @param style {String} 'font-size:10px; font-weight: bold;'
	 * @param w {Number} cutting width .. pixel
	 * @param str {String} text
	 * @returns {Array}
	 */
	this.toArray = function(style, w, str) {
		ready();
		if (style)
			div.setAttribute("style", style);
		setText(div, str);
		if (getBox(div)["w"] <= w) {
			return [ str ];
		}

		var arr = [];
		setText(div, '');
		for ( var i = 0; i < str.length; i++) {
			var o = getText(div);

			var ch = str.charAt(i);
			if (ch != '\n') {
				addText(div, ch);
				if (getBox(div)["w"] > w) {
					arr.push(o);
					setText(div, ch);
				}
			} else {
				arr.push(o);
				setText(div, '');
			}
		}

		//남는 텍스트
		var modText = getText(div);
		if (modText.length > 0) {
			arr.push(modText);
		}
		return arr;
	};
	function getText(element) {
		return element.textContent || element.innerText;
	}
	function setText(element, txt) {
		if ('textContent' in element) {
			element.textContent = txt;
		} else {
			element.innerText = txt;
		}
	}
	function addText(element, txt) {
		if ('textContent' in element) {
			element.textContent += txt;
		} else {
			element.innerText += txt;
		}
	}
};