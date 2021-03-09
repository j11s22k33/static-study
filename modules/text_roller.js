var Roller = {
	roller : {
		timer : null,
		txt : null,
		ele : null,
	},
	/*start : function(ele, txt, fontSize, width) {
		if (Roller.roller["timer"]) {
			return 0;
		}

		txt += "   ";

		var i = 0;
		Roller.roller["ele"] = ele;
		Roller.roller["txt"] = ele.innerHTML;
		Log.out(FontMetrics.getSize(fontSize, txt)["w"]+"//////"+width);
		if (FontMetrics.getSize(fontSize, txt)["w"] > width) {
			Roller.roller["timer"] = setInterval(function() {
				var s = txt.substring(i, txt["length"]) + txt;
				ele.innerHTML = FontMetrics.toClip(fontSize, width, s);
				i += 1;
				if (i >= txt["length"]) {
					i = 0;
				}
			}, 1000);
		}
	},
	stop : function() {
		clearInterval(Roller.roller["timer"]);
		if (Roller.roller["ele"]) {
			Roller.roller["ele"].innerHTML = Roller.roller["txt"];
		}
		Roller.roller["timer"] = null;
	},*/

	/////////////////////////// HTML5
	/*
	.textLeftTransition {
		-webkit-transition-property: left;
		-webkit-transition-duration: 2s;
		-webkit-transition-timing-function: linear;
		-webkit-transition-delay: 0s;
	}*/
	//HTML 5 롤러
	start : function(ele, txt, style, width) {
		Roller.roller["ele"] = ele;
		Roller.roller["txt"] = this.getText(ele);
		var txtW = FontMetrics.getSize(style, txt)["w"];
		if (txtW > width) {
			var div = document.createElement("div");
			ele.style.overflow = "hidden";
			var nobr = document.createElement("nobr");
			nobr.setAttribute("class", "textLeftTransition");
			if (style)
				nobr.setAttribute("style", style);
			nobr.style["position"] = "relative";
			nobr.style["left"] = "0px";
			nobr.innerHTML = txt + "&nbsp;&nbsp;" + txt;
			ele.innerHTML = "";
			ele.appendChild(nobr);

			var totalW = getBox(nobr)["w"];
			var distance = totalW - txtW;
			setTimeout(function() {
				nobr.style.left = -distance + "px";
			}, 1000);
		}
	},
	stop : function() {
		if (Roller.roller["ele"]) {
			Roller.roller["ele"].innerHTML = Roller.roller["txt"];
		}
	},
	getText : function(element) {
		if ('textContent' in element) {
			return element.textContent;
		} else {
			return element.innerText;
		}
	},
	getBox : function(element) {
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
	},
};