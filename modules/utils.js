//함수에서 컬러 이름 찍고 싶을때
/*function(){
	alert(arguments.callee.caller.name);
}*/

//////////////////로그 출력
//console.log
//console.error
//console.error
/*
function(){
	alert(arguments.callee.caller.name);
}*/

var $U = {};
/**
 * function 
 * @returns {String}
*/
$U.replaceUrlParam = function(url, json) {
	var eIdx = url.indexOf("?");

	if (eIdx != -1) {
		var tmp = this.getUrlParams(url);
		url = url.substring(0, url.indexOf("?"));
		for ( var tmpAttr in tmp) {
			for ( var jsonAttr in json) {
				if (tmpAttr == jsonAttr) {
					tmp[tmpAttr] = json[jsonAttr];
				}
			}
		}
		return this.addUrlParam(url, tmp);
	} else {
		return url;
	}
};

$U.getUrlParams = function(url) {
	var tmp = url;

	var ret = {};
	var sIdx = url.indexOf("?");

	if (sIdx != -1) {
		tmp = tmp.substring(sIdx + 1, tmp.length);

		tmp = tmp.split("&");
		for ( var i = 0; i < tmp.length; i++) {
			var arr = tmp[i].split("=");
			ret[arr[0]] = arr[1];
		}
	}
	return ret;
};

$U.addUrlParam = function(url, json) {
	if (url.indexOf("?") < 0) {
		url += "?";
	}

	for ( var name in json) {
		if (name) {
			url += "&" + name + "=" + json[name];
		}
	}
	return url;
};

$U.opacity = function(elm, value) {
	elm.style.opacity = (value / 100); //chrome
	elm.style.MozOpacity = (value / 100); //netscape
	elm.style.KhtmlOpacity = (value / 100); //safari 1.x
	elm.style.filter = "alpha(opacity=" + value + ")"; //ie 5-7
	elm.style.MsFilter = " 'progid:DXImageTransform.Microsoft.Alpha(opacity=" + value + ")' "; // ie8
};
$U.objectToJSONString = function(obj) {
	return JSON.stringify(obj);
};
$U.stringToJSON = function(string) {
	return JSON.parse(string);
};
var _userAgent = window.navigator.userAgent.toLowerCase();
$U.browser = {
	webkit : /webkit/.test(_userAgent),
	ipod : /webkit/.test(_userAgent) && /\(ipod/.test(_userAgent),
	ipad : /webkit/.test(_userAgent) && /\(ipad/.test(_userAgent),
	iphone : /webkit/.test(_userAgent) && /\(iphone/.test(_userAgent),
	android : /webkit/.test(_userAgent) && /android/.test(_userAgent),
	msie : /msie/.test(_userAgent),
	firefox : /firefox/.test(_userAgent),
	opera : /opera/.test(_userAgent),
	apple : /apple/.test(_userAgent),
	chrome : /chrome/.test(_userAgent),
};
$U.toString = function(obj) {
	var s = "";
	for ( var name in obj) {
		s += "[ " + name + " : " + obj[name] + " ]\n";
	}
	return s;
};
$U.console = function(msg) {
	console.log(msg);
};
$U.pageZoom = function(width) {
	var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	document.body.style.zoom = windowWidth / width;
};
$U.isElement = function(e) {
	return e.tagName ? true : false;
};

$U.getType = function(obj) {
	return typeof obj;
};
$U.compareType = function(obj, stringType) {
	return typeof (obj) == stringType;
};
$U.compareElementTagName = function(element, stringElementTagName) {
	return element.tagName == stringElementTagName.toUpperCase();
};
$U.setEventCancle = function(event) {
	event = event || window.event;
	if (event.preventDefault) {
		event.preventDefault();
	} else {
		event.cancelBubble = true;
		event.returnValue = false;
	}
};

/**
 * pos 메서드는 마우스 커서의 위치 정보를 리턴한다.
 * @param {Boolean} bGetOffset 현재 엘리먼트에 대한 마우스 커서의 상대위치인 offsetX, offsetY를 구할 것인지의 여부. true면 값을 구한다(offsetX, offsetY는 1.2.0버전부터 추가). $Dlement 가 포함되어 있어야 한다.
 * @description [Lite]
 * @example
function eventHandler(evt) {
   var pos = evt.pos();

   pos.clientX;  // Number. 현재 화면에 대한 X 좌표
   pos.clientY;  // Number. 현재 화면에 대한 Y 좌표
   pos.pageX;  // Number. 문서 전체에 대한 X 좌표
   pos.pageY;  // Number. 문서 전체에 대한 Y 좌표
   pos.layerX;  // Number. <b>deprecated.</b> 이벤트가 발생한 엘리먼트로부터의 상대적인 X 좌표
   pos.layerY;  // Number. <b>deprecated.</b> 이벤트가 발생한 엘리먼트로부터의 상대적인 Y 좌표
   pos.offsetX; // Number. 이벤트가 발생한 엘리먼트에 대한 마우스 커서의 상대적인 X좌표 (1.2.0 이상)
   pos.offsetY; // Number. 이벤트가 발생한 엘리먼트에 대한 마우스 커서의 상대적인 Y좌표 (1.2.0 이상)

}
 * @return {Object} 마우스 커서의 위치 정보. 객체의 속성은 예제를 참조한다.
 * @remark layerX, layerY는 차후 지원하지 않을(deprecated) 예정입니다.
 */
$U.getMouseRect = function(event) {
	var e = event || window.event;
	var target = e.target || e.srcElement;
	var body = (target.ownerDocument || document).body;
	var docEle = (target.ownerDocument || document).documentElement;
	var pos = [ body.scrollLeft || docEle.scrollLeft, body.scrollTop || docEle.scrollTop ];
	return {
		clientX : e.clientX,
		clientY : e.clientY,
		pageX : 'pageX' in e ? e.pageX : e.clientX + pos[0] - body.clientLeft,
		pageY : 'pageY' in e ? e.pageY : e.clientY + pos[1] - body.clientTop,
		layerX : 'offsetX' in e ? e.offsetX : e.layerX - 1,
		layerY : 'offsetY' in e ? e.offsetY : e.layerY - 1
	};
};

$U.createIFrame = function(id, src, width, height, scrolling, frameborder, onload) {

	//이거 잘되는거임 onload시 height 자동으로 맞춰줌
	//<iframe src="jsp/sales/claimInquiry_content.jsp" width="100%" height="auto" scrolling="no" frameborder="0" onload="this.style.height = this.contentWindow.document.body.scrollHeight + 'px';"></iframe>	
};

/*
_blank - URL is loaded into a new window. This is default
_parent - URL is loaded into the parent frame
_self - URL replaces the current page
_top - URL replaces any framesets that may be loaded
name - The name of the window
*/
/*
 * 		//자식 window의 메서드 부르기
 * 		var cWin = openWindowPopup('./sample/windowChild_open.html', 'popupname');
		$(cWin).load(function(event) {
			cWin.callByParent('parent!');  //자식 window가 로드된 후 자식메서드를 호출하면 된다
		});
		
		//부모 window 메서드 부르기
		window.opener.callByChild('close!!');
 * 
 * */

/**
 * @return {Window}
 * */
$U.openWindowPopup = function(url, name, left, top, width, height, onLoadFn) {
	var win = window.open(url, name, 'left=' + left + ', top=' + top + ', width=' + width + ', height=' + height + ', resizable=1, scrollbars=1');
	$(win).load(onLoadFn);
	return win;
};

/*
 * 모달팝업에서 요렇게 obj를 획득하여 사용한다. var obj = window.dialogArguments;
 * 모달팝업 닫을때 window.returnValue = obj; window.close(); 요렇게 해준다 
 * 
 * */

/**
 * @return {Object}
 * */
$U.openWindowModalPopup = function(url, obj, width, height) {
	var features = "dialogWidth: " + width + "px; dialogHeight: " + height + "px; center: yes;";
	var returnVal = window.showModalDialog(url, obj, features);
	return returnVal;
};

$U.flashMovie = function(src, ids, width, height, wmode) {
	var wh = "";
	if (parseInt(width) && parseInt(height))
		wh = " width='" + width + "' height='" + height + "' ";
	return "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' " + wh + " id=" + ids + "><param name=wmode value=" + wmode + "><param name=movie value=" + src + "><param name=quality value=high><embed src=" + src + " quality=high wmode=" + wmode + " type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?p1_prod_version=shockwaveflash' " + wh + "></embed></object>";
};

$U.objMovie = function(src, ids, width, height, autostart) {
	var wh = "";
	if (parseInt(width) && parseInt(height))
		wh = " width='" + width + "' height='" + height + "' ";
	if (!autostart)
		autostart = false;
	return "<embed src='" + src + "' " + wh + " autostart='" + autostart + "'></embed>";
};
$U.isAJAXError = function(responseText) {
	return responseText.substring(0, 8) == "RETURN_N";
};
$U.getAJAXErrorMsgToHTML = function(responseText) {
	var errors = responseText.split("^");
	return "<p style='text-align:center'><b style='color:red'>" + errors[1] + "</b></p><p style='text-align:center'>" + errors[2] + "</p>";
};

$U.makeAJAXErrorMessage = function(jqXHR) {
	var status = jqXHR.status;
	var statusText = decodeURIComponent(jqXHR.statusText).replace(/\+/g, ' ');
	//return "<p style='text-align:center'><b style='color:red'>" + status + "</b></p><p style='text-align:center'>" + statusText + "</p>";
	return status + "\n" + statusText;
};

$U.showLoading = function() {
	$.blockUI({
		baseZ : 999999,
		css : {
			backgroundColor : "transparent",
			border : "0px solid black",
			height : "0px"
		},
		message : "<img src='images/loading.gif'/>"
	});
};
$U.hideLoading = function() {
	$.unblockUI();
};

/*$U.makePopupName = function(popupURL) {
var idx = popupURL.indexOf("?");
popupURL = popupURL.substring(0, idx);
return popupURL.match(/[\w]/g).join("");
};
$U.popup = function(popupURL, popupName, width, height, data) {
	/*var returnVal = window.showModalDialog(popupURL, data, "dialogWidth:" + width + "px; dialogHeight:" + height + "px; center:1; resizable:1; scroll:1");
	return returnVal;*/
	var cWin = window.open(popupURL, '_blank', 'left=100px, top=100px, width=' + width + ', height=' + height + ', resizable=1, scrollbars=1');
	cWin.name = popupName;
	cWin.dialogArguments = data;
	return cWin;
};
*/
$U.popup = function(popupURL, width, height, data, closeFunc) { // div안에 div안에 div 이런식으로 뜨기때문에 화면크기에 문제가 있다.
	var ifrm = $("<iframe/>").attr({
		width : '100%',
		height : 'auto',
		scrolling : 'no',
		frameborder : '0',
		width : '100%',
	}).on('load', function(event) {
		this.style.height = this.contentWindow.document.body.scrollHeight + 'px';
		if (this.contentWindow.start) {
			this.contentWindow.start(data);
		}
	}).attr('src', popupURL);

	var div = $("<div/>").append(ifrm);
	div.dialog({
		'modal' : true,
		'height' : height,
		'width' : width,
		'close' : function(event, ui) {
			var returnData = undefined;
			if (ifrm[0].contentWindow.stop) {
				returnData = ifrm[0].contentWindow.stop();
			}
			if (closeFunc) {
				closeFunc(returnData);
			}
			$(this).dialog("close").remove();
		},
	});
};
/** RELOAD */
$U.winReload = function(flag) {
	window.onunload = null;
	window.location.reload(flag);
};