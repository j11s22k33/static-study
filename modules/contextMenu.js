function ContextMenu() {
	$(document).on('click', hide).on('contextmenu', hide);

	var contextEvent = null;
	var mouseoverBgcolor = '#efefef', mouseoutBgcolor = '#ffffff', enableFontcolor = '#000000', disableFontcolor = 'gray';

	//배경
	var $bg = $('<div/>').css({
		'display' : 'none',
		'position' : 'absolute',
		'padding' : '5px 0',
		'margin' : '0px',
		'border' : '1px solid #c5c5c5',
		'backgroundColor' : mouseoutBgcolor,
	}).on('contextmenu click', function(event) {
		return false;
	}).appendTo($(document.body));

	//메뉴 박스
	var $munu = $('<div/>').css({
		'cursor' : 'default',
		'minWidth' : '150px',
		'padding' : '5px 0',
		'fontSize' : '12px',
		'fontFamily' : 'inherit',
		'fontWeight' : '400',
		'color' : enableFontcolor,
		'textAlign' : 'left',
	}).on('mouseenter', setMouseoverBgcolor).on('mouseleave', setMouseoutBgcolor).on('click', callMenuCB);

	//구분자
	var $divider = $('<hr/>').css({
		'margin:' : '5px',
		'border' : '0',
		'height' : '1px',
		'backgroundColor' : '#f0f0f0',
	}).on('click', function(event) {
		return false;
	});

	function callMenuCB(event) {
		hide();
		$(this).data('cb')(contextEvent);
	}
	function setMouseoverBgcolor(event) {
		$(this).css('backgroundColor', mouseoverBgcolor);
	}
	function setMouseoutBgcolor(event) {
		$(this).css('backgroundColor', mouseoutBgcolor);
	}
	/**
	 * 등록된 메뉴 할성화
	 * @param {String} menuId
	 * */
	this.enableMenu = function(menuId) {
		$bg.find('[id=' + menuId + ']').on('mouseenter', setMouseoverBgcolor).on('mouseleave', setMouseoutBgcolor).on('click', callMenuCB).css('color', enableFontcolor);
	};
	/**
	 * 등록된 메뉴 비할성화
	 * @param {String} menuId
	 * */
	this.disableMenu = function(menuId) {
		$bg.find('[id=' + menuId + ']').off('mouseenter').off('mouseleave').off('click').css('color', disableFontcolor);
	};
	/**
	 * 등록된 메뉴제거
	 * @param {String} menuId
	 * */
	this.removeMenu = function(menuId) {
		$bg.find('[id=' + menuId + ']').remove();
	};

	/**
	 * 메뉴 생성
	 * 
	 * menuTxt가 null 이면 구분자생성
	 * menuTxt가 null 이 아니면 메뉴생성
	 * 
	 * @param {String} menuTxt
	 * @param {String} imgSrc
	 * @param {Functoin} cb 콜백함수, 콜백함수는 contextEvent를 받는다
	 * */
	this.addMenu = function(menuId, menuTxt, imgSrc, cb) {
		if (menuTxt) {
			var $mb = $munu.clone(true).attr('id', menuId).data('cb', cb).appendTo($bg);

			//(<DIV><DIV>이미지박스</DIV><DIV>메뉴이름</DIV><DIV clear:both></DIV></DIV>)
			var html = '';
			if (imgSrc) {
				html = '<div style=\'float:left; margin:0 10px; width:14px; height:14px; background-image:url(' + imgSrc + ')\'></div>';
			} else {
				html = '<div style=\'float:left; margin:0 10px; width:14px; height:14px;\'></div>';
			}
			html += '<div style=\'float:left;\'>' + menuTxt + '</div>';
			html += '<div style=\'clear:both;\'></div>';
			$mb.html(html);
		} else {
			$divider.clone(true).appendTo($bg);
		}
	};

	function hide() {
		$bg.hide();
	}

	function show(event) {
		var bgLeft = event.pageX;
		if ($(window).innerWidth() < event.pageX + $bg.width()) {
			bgLeft = event.pageX - $bg.width();
		}
		var bgTop = event.pageY;
		if ($(window).innerHeight() < event.pageY + $bg.height()) {
			bgTop = event.pageY - $bg.height();
		}
		$bg.css('left', bgLeft).css('top', bgTop).show();
	}

	/**
	 * contextMenu를 등록
	 * @param {String} contextMenuAppendtoSelector
	 * @param {Function} contextMenuShowbeforeFunction contextMenu가 보이기전에 불릴 함수
	 * */
	this.appendTo = function(contextMenuAppendtoSelector, contextMenuShowbeforeFunction) {
		$(contextMenuAppendtoSelector).live('contextmenu', function(event) {
			contextEvent = event;
			if (contextMenuShowbeforeFunction) {
				contextMenuShowbeforeFunction(contextEvent);
			}
			show(contextEvent);
			return false;
		});
	};

	/**
	 * contextMenu를 제거
	 * @param {String} contextMenuAppendtoSelector
	 * */
	this.removeTo = function(contextMenuAppendtoSelector) {
		$(contextMenuAppendtoSelector).die('contextmenu');
	};
}