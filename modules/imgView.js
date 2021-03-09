/**
 * 1. 개체생성
 * var v = new ImgView();
 * 
 * 2. 뷰 노드를 원하는 엘리먼트에 Append 시킨다
 * v.appendView(document.body, 300, 300)
 * 
 * 4. 이미지를 보여준다
 * [ v.displayImg(src, true) | v.displayImg(src) ]
 * 
 * @returns {ImgView}
 */
function ImgView() {
	var div = undefined;
	var _w = 0;
	var _h = 0;

	this.cleanImg=function(){
		div.innerHTML = "";
	};
	
	this.displayImg = function(src, isResize, cb) {
		if (isResize) {
			div.innerHTML = "<IMG src='" + src + "' style='visibility:hidden;'></IMG>";
			div.firstChild.onload = function() {
				var rect = getResizeRect(this, 0, 0, _w, _h);
				this.style.width = rect.w + "px";
				this.style.height = rect.h + "px";
				this.style.margin = rect.y + "px 0 0 0";
				this.style.visibility = "visible";
				if (cb) {
					setTimeout(function() {
						cb(true);
					}, 0);
				}
			};
			div.firstChild.onerror = function() {
				if (cb) {
					setTimeout(function() {
						cb(false);
					}, 0);
				}
			};
		} else {
			div.innerHTML = "<IMG src='" + src + "' width='" + _w + "' height='" + _h + "' style='visibility:visible;margin:0px;'></IMG>";
		}
	};

	this.appendView = function(parentNode, w, h) {
		_w = w;
		_h = h;

		div = document.createElement("DIV");
		div.align = "center";
		div.style.width = w+"px";
		div.style.height = h+"px";
		parentNode.appendChild(div);
	};

	function getResizeRect(img, x, y, w, h) {
		var imgW = Number(img.width);
		var imgH = Number(img.height);

		var ratio = 0;
		var wRatio = w / imgW;
		var hRatio = h / imgH;

		if (wRatio > hRatio) {
			ratio = hRatio;
		} else {
			ratio = wRatio;
		}

		imgW = imgW * ratio;
		imgH = imgH * ratio;

		if (imgW > w) {
			imgW = w;
		}
		if (imgH > h) {
			imgH = h;
		}

		x = x + (w / 2) - (imgW / 2);
		y = y + (h / 2) - (imgH / 2);

		return {
			"x" : x.toFixed(),
			"y" : y.toFixed(),
			"w" : imgW.toFixed(),
			"h" : imgH.toFixed()
		};
	}
}