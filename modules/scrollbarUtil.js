/**
 * <pre>
 * <예 1>
 * 일반적인 사용법
 *  <element id="컨텐츠컨테이너+레일컨테이너" style="position:relative; overflow:hidden; width:100; height:100;">
 *  	<element id="컨텐츠" style="position:relative;"></element>
 *  </element>
 * 
 * 
 * <예 2>
 * 레일이 다른 위치에 있음
 *  <element id="컨텐츠컨테이너" style="position:relative; overflow:hidden; width:100; height:100;">
 *  	<element id="컨텐츠" style="position:relative;"></element>
 *  </element>
 *  <element id="레일컨테이너" style="position:relative; width:400; height:30;"></element>

 * <예 3>
 * 컨텐츠가 여러개 존재 - 컨텐츠가 컨텐츠컨테이너 내부 또는 외부에 있는경우
 *  <element style="overflow:hidden; width:100; height:100;">
 *      <element id="컨텐츠2" style="position:relative"></element> <-------외부
 *  </element> 
 *  <element id="컨텐츠컨테이너+레일컨테이너" style="position:relative; overflow:hidden; width:100; height:100;">
 *  	<element id="컨텐츠1"style="position:relative"></element>  <-------내부
 *  </element>

 * <예 4>
 * 컨텐츠가 여러개 존재 - 컨텐츠가 컨텐츠컨테이너 내부에 여러개 있는경우
 *  <element id="컨텐츠컨테이너+레일컨테이너"  style="position:relative; overflow:hidden; width:100; height:100;">
 *  	<element id="컨텐츠1" style="position:relative"></element> <-------내부
 *  	<element id="컨텐츠2" style="position:relative"></element> <-------내부
 *  </element>
 * 
 * </pre>
 * @param {String} contentsContainer selector 단일
 * @param {String} contents selector 복수가능
 * @param {String} railContainer selector 단일
 * @param {JSON} _option
 * */
function ScrollbarUtil(contentsContainer, contents, railContainer, _option) {
	var self = this;
	var option = {
		axis : "y",
		railLeft : "auto",
		railRight : "auto",
		railTop : "auto",
		railBottom : "auto",
		railWeight : 10,
		railBgColor : "#222222",
		barBgColor : "#ffa500",
		opacityMin : 0.3,
		opacityMax : 0.8,
		wheelMoveLen : 10,
		opacityEnable : true, //투명도 활성화
		wheelEnable : true, //휠 활성화
		alwaysVisible : false, //스크롤 항상 보일것인가
	};

	for ( var key in _option) {
		option[key] = _option[key];
	}

	var rc = $(railContainer);
	var cc = $(contentsContainer);
	var c = $(contents);
	var rail = makeRail();
	var bar = makeBar();

	rc.append(rail.append(bar));
	setEvents();
	resize();

	self.resize = function() {
		resize();
	};
	/**
	 * @param {Number} left
	 * */
	self.scrollLeft = function(left) {
		moveBarX(left);
		moveContentsX();
	};
	/**
	 * @param {Number} top
	 * */
	self.scrollTop = function(top) {
		moveBarY(top);
		moveContentsY();
	};

	function setEvents() {
		on_resize(); //윈도우 리사이즈
		on_draggable(); //바 드레그
		on_click(); //레일 클릭
		if (option.wheelEnable) {
			on_wheel(); //콘텐츠들&레일 휠
		}
		if (option.opacityEnable) {
			on_opacity(); //레일&바 투명도
		}
	}

	function calculate_dim_ratio() {
		rc.dim = getBounds(rc[0]);
		c.dim = greatestBounds(c);
		c.ratio = {
			x : c.dim.width / rc.dim.width,
			y : c.dim.height / rc.dim.height,
		};
		cc.dim = getBounds(cc[0]);
		cc.ratio = {
			x : cc.dim.width / c.dim.width,
			y : cc.dim.height / c.dim.height
		};
		rail.dim = {};
		bar.dim = {};
		switch (option.axis) {
			case "x":
				if (cc.ratio.x < 1) {
					bar.dim.len = rc.dim.width * cc.ratio.x;
					rail.dim.len = rc.dim.width;
				} else if (option.alwaysVisible) {
					bar.dim.len = rc.dim.width;
				}
				break;
			case "y":
				if (cc.ratio.y < 1) {
					bar.dim.len = rc.dim.height * cc.ratio.y;
					rail.dim.len = rc.dim.height;
				} else if (option.alwaysVisible) {
					bar.dim.len = rc.dim.height;
				}
				break;
		}
	}

	function on_resize() {
		$(window).on('resize', resize);
	}
	function on_click() {
		bar.on('click', function(event) {
			return false;
		});
		rail.on('click', function(event) {
			switch (option.axis) {
				case 'x':
					self.scrollLeft(event.offsetX - bar[0].offsetWidth / 2);
					break;
				case 'y':
					self.scrollTop(event.offsetY - bar[0].offsetHeight / 2);
					break;
			}
		});
	}
	function on_opacity() {
		c.on('mouseenter', opacityMax);
		c.on('mouseleave', opacityMin);
		rail.on('mouseenter', opacityMax);
		rail.on('mouseleave', opacityMin);
	}
	function on_wheel() {//JQUERY.MOUSEWHEEL
		c.on('mousewheel', moveWheel);
		rail.on('mousewheel', moveWheel);
	}
	function on_draggable() {//JQUERY.UI
		bar.draggable({
			axis : option.axis,
			containment : rail,
			start : function(event) {
				if (option.opacityEnable) {
					opacityMax();
				}
			},
			drag : function() {
				switch (option.axis) {
					case "x":
						moveContentsX();
						break;
					case "y":
						moveContentsY();
						break;
				}
			},
			stop : function(event) {
				if (option.opacityEnable) {
					opacityMin();
				}
				/*switch (option.axis) {
					case "x":
						moveContentsX();
						break;
					case "y":
						moveContentsY();
						break;
				}*/
			},
		});
	}

	function resize() {
		switch (option.axis) {
			case "x":
				var prevRatioX = bar[0].offsetLeft / rail[0].offsetWidth;
				calculate_dim_ratio();
				if (cc.ratio.x < 1 || option.alwaysVisible) {
					rail.show();
					switch (option.axis) {
						case "x":
							rail.css('width', rail.dim.len);
							bar.css('width', bar.dim.len);
							break;
						case "y":
							rail.css('height', rail.dim.len);
							bar.css('height', bar.dim.len);
							break;
					}
					moveBarX(rail[0].offsetWidth * prevRatioX);
					moveContentsX();
				} else {
					rail.hide();
				}
				break;
			case "y":
				var prevRatioY = bar[0].offsetTop / rail[0].offsetHeight;
				calculate_dim_ratio();
				if (cc.ratio.y < 1 || option.alwaysVisible) {
					rail.show();
					switch (option.axis) {
						case "x":
							rail.css('width', rail.dim.len);
							bar.css('width', bar.dim.len);
							break;
						case "y":
							rail.css('height', rail.dim.len);
							bar.css('height', bar.dim.len);
							break;
					}
					moveBarY(rail[0].offsetHeight * prevRatioY);
					moveContentsY();
				} else {
					rail.hide();
				}
				break;
		}
	}

	var cnt = 0;
	function opacityMin() {
		cnt -= 1;
		if (cnt == 0) {
			bar.css('opacity', option.opacityMin);
			rail.css('opacity', option.opacityMin);
		}
	}
	function opacityMax() {
		cnt += 1;
		if (cnt == 1) {
			bar.css('opacity', option.opacityMax);
			rail.css('opacity', option.opacityMax);
		}
	}
	function moveWheel(event, delta, deltaX, deltaY) {
		switch (option.axis) {
			case "x":
				increaseBarX(delta * -1 * option.wheelMoveLen);
				moveContentsX();
				break;
			case "y":
				increaseBarY(delta * -1 * option.wheelMoveLen);
				moveContentsY();
				break;
		}
	};
	/**
	 * @param {Number} left
	 */
	function moveBarX(left) {
		var limit = rc.dim.width - bar[0].offsetWidth;

		if (left < 0) {
			left = 0;
		} else if (left > limit) {
			left = limit;
		}
		bar.css('left', left);
	}
	/**
	 * @param {Number} top
	 */
	function moveBarY(top) {
		var limit = rc.dim.height - bar[0].offsetHeight;

		if (top < 0) {
			top = 0;
		} else if (top > limit) {
			top = limit;
		}
		bar.css('top', top);
	}
	function increaseBarX(increaseX) {
		var left = 0;
		if (increaseX < 0) {
			left = bar[0].offsetLeft + increaseX;
			if (0 > left) {
				left = 0;
			}
		} else {
			var limit = rc.dim.width - bar[0].offsetWidth;
			left = bar[0].offsetLeft + increaseX;
			if (left > limit) {
				left = limit;
			}
		}
		bar.css('left', left);
	};
	function increaseBarY(increaseY) {
		var top = 0;
		if (increaseY < 0) {
			top = bar[0].offsetTop + increaseY;
			if (0 > top) {
				top = 0;
			}
		} else {
			var limit = rc.dim.height - bar[0].offsetHeight;
			top = bar[0].offsetTop + increaseY;
			if (limit < top) {
				top = limit;
			}
		}
		bar.css('top', top);
	};
	function moveContentsX() {
		var left = -1 * bar[0].offsetLeft * c.ratio.x;
		c.css('left', left);
	}
	function moveContentsY() {
		var top = -1 * bar[0].offsetTop * c.ratio.y;
		c.css('top', top);
	}
	function makeRail() {
		var rail = $("<div/>").css('position', 'absolute').css('left', option.railLeft).css('right', option.railRight).css('top', option.railTop).css('bottom', option.railBottom).css('width', option.railWeight).css('height', option.railWeight).css('backgroundColor', option.railBgColor).hide();
		if (option.opacityEnable) {
			rail.css('opacity', option.opacityMin);
		}
		return rail;
	}
	function makeBar() {
		var bar = $("<div/>").css('position', 'absolute').css('width', '100%').css('height', '100%').css('backgroundColor', option.barBgColor);
		if (option.opacityEnable) {
			bar.css('opacity', option.opacityMin);
		}
		return bar;
	}
	function getBounds(o) {
		var bcr = o.getBoundingClientRect();
		return {
			left : bcr.left,
			right : bcr.right,
			top : bcr.top,
			bottom : bcr.bottom,
			width : bcr.width ? bcr.width : bcr.right - bcr.left,
			height : bcr.height ? bcr.height : bcr.bottom - bcr.top,
		};
	};
	function greatestBounds(os) {
		var tmp = {
			width : 0,
			height : 0
		};
		for ( var i = 0; i < os.length; i += 1) {
			var b = getBounds(os[i]);
			tmp.width = Math.max(tmp.width, b.width);
			tmp.height = Math.max(tmp.height, b.height);
		}
		return tmp;
	}
}