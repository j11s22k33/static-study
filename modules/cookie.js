function Cookie() {
	//  키 값 배열로 반환
	this.keys = function() {
		var ca = document.cookie.split(";");
		var re = /^\s+|\s+$/g;
		var a = new Array;

		for ( var i = 0; i < ca.length; i++) {
			a[a.length] = ca[i].substr(0, ca[i].indexOf("=")).replace(re, "");
		}
		return a;
	};

	this.get = function(sName) {
		var ca = document.cookie.split(/\s*;\s*/);
		var re = new RegExp("^(\\s*" + sName + "\\s*=)");

		for ( var i = 0; i < ca.length; i++) {
			if (re.test(ca[i]))
				return unescape(ca[i].substr(RegExp.$1.length));
		}

		return undefined;
	};

	// 보통 sName, sValue 까지만 쓴다. nDays 값 없으면 브라우져 종료시 쿠키 제거된다
	this.set = function(sName, sValue, nDays, sDomain, sPath) {
		var sExpire = "";

		if (typeof nDays == "number") {
			sExpire = ";expires=" + (new Date((new Date()).getTime() + nDays * 1000 * 60 * 60 * 24)).toGMTString();
		}
		if (typeof sDomain == "undefined")
			sDomain = "";
		if (typeof sPath == "undefined")
			sPath = "/";

		document.cookie = sName + "=" + escape(sValue) + sExpire + "; path=" + sPath + (sDomain ? "; domain=" + sDomain : "");
	};

	this.remove = function(sName) {
		if (this.get(sName) != null) {
			this.set(sName, "", -1);
		}
	};
};
