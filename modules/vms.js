var $U = {};
/**
 * 실행순서 #vms.js#$(document).ready -> #xxx.jsp#$(document).ready ->
 * #vms.js#$(window).on('load');
 */

$(document).ready(function() {
	// $U.setInputMask();
	$U.setDatepicker();
	$U.setTimepicker();
	$U.setEventInputFocus("on");
	$U.setEventInputChange("on");
	// $U.setEventInputFocus("live");
	// $U.setEventInputChange("live");
	$U.ignoreTabindex("input[readonly]");
	$U.setValidatorErrMsgPopup();
});
$(window).on('load', function() {
	$U.gridResize("#jqgrid,#jqgrid1,#jqgrid2", window);
	// $U.appendWonInputAfter();
	$U.formatInputValue();
	$U.setFocus();
});
$U.setValidatorErrMsgPopup = function() {
	jQuery.validator.setDefaults({
		onkeyup : false,
		onclick : false,
		onfocusout : false,
		showErrors : function(errorMap, errorList) {
			if (errorList.length > 0) {
				var nm = $(errorList[0].element).attr("nm");
				if (nm && nm.length > 0) {
					alert("[ " + nm + " ]\n\n - " + errorList[0].message);
				} else {
					alert(errorList[0].message);
				}
			}
		},
	});
};
$U.jqueryFnOverride = function() {
	var append = jQuery.fn.append;
	jQuery.fn.append = function() {
		return append.apply(this, arguments);
	};
	var appendTo = jQuery.fn.appendTo;
	jQuery.fn.appendTo = function() {
		return appendTo.apply(this, arguments);
	};
};
$U.ignoreTabindex = function(selector) {
	$(selector).attr("tabindex", "-1");
};
$U.isFirstFocusDate = false;
$U.setFocus = function() {
	var o = $(document).find("select[name]:not([readonly]):not([disabled]), input:text[name]:not([readonly]):not([disabled]), textarea[name]:not([readonly]):not([disabled])").eq(0);
	$U.isFirstFocusDate = o.hasClass("date");
	o.focus();
};
$U.appendWonInputAfter = function() {
	$('table.input input.currency').after('&nbsp;<span>원</span>');
};
$U.unsetDatepicker = function() {
	$("table.input input.date").datepicker('destroy');
};
$U.setDatepicker = function() { // showOn : focus
	$("table.input input.date:not([readonly]):not([disabled])").datepicker({
		beforeShow : function(input, inst) {
			$(this).datepicker("setDate", $F.date(input.value));
			setTimeout(function() {
				input.value = input.value.replace(/-/g, '');
				input.select();
			});
			if ($U.isFirstFocusDate) {
				$U.isFirstFocusDate = false;
				return false;
			}
		}
	});
};
$U.setTimepicker = function() { // showOn : focus
	$("table.input input.time:not([readonly]):not([disabled])").timepicker({
		beforeShow : function(input, inst) {
			if (input.value.length > 0) {
				$(this).timepicker("setTime", $F.time(input.value));
				setTimeout(function() {
					input.value = input.value.replace(/:/g, '');
					input.select();
				});
			}
		}
	});
};
$U.setInputMask = function() {
	$("table.input input.currency:not([readonly]):not([disabled])").mask("999,999,999,999,999,999", {
		reverse : true
	});
	$("table.input input.zip-code:not([readonly]):not([disabled])").mask("999-999");
};
$U.setEventInputFocus = function(eventFunc) {
	$("table.input input:text[name]:not([readonly]):not([disabled]), table.input textarea[name]:not([readonly]):not([disabled])")[eventFunc]('focus', function(event) {
		var self = $(this);
		if (self.is(".currency, .zip-code, .foreigner-num, .corp-num, .opr-num, .all-phone, .fax, .phone, .mobile, .license-num, .pin, .bdy-num, .currency-mix, .card-num, .tire-num")) {
			self.val(self.val().replace(/-|,|:/g, ''));
		}
		setTimeout(function() {
			self.select();
		});
	});
};
$U.setEventInputChange = function(eventFunc) {
	$("table.input input.currency")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['currency'](text);
		});
	});
	$("table.input input.zip-code")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['zipCode'](text);
		});
	});
	$("table.input input.datetime")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['datetime'](text);
		});
	});
	$("table.input input.time")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['time'](text);
		});
	});
	$("table.input input.date")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['date'](text);
		});
	});
	$("table.input input.foreigner-num")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['foreignerNum'](text);
		});
	});
	$("table.input input.corp-num")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['corpNum'](text);
		});
	});
	$("table.input input.opr-num")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['oprNum'](text);
		});
	});
	$("table.input input.all-phone")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['allPhone'](text);
		});
	});
	$("table.input input.fax")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['fax'](text);
		});
	});
	$("table.input input.phone")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['phone'](text);
		});
	});
	$("table.input input.mobile")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['mobile'](text);
		});
	});
	$("table.input input.license-num")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['licenseNum'](text);
		});
	});
	$("table.input input.pin")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['pin'](text);
		});
	});
	$("table.input input.bdy-num")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['bdyNum'](text);
		});
	});
	$("table.input input.currency-mix")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['currency'](text);
		});
	});
	$("table.input input.card-num")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['cardNum'](text);
		});
	});
	$("table.input input.tire-num")[eventFunc]('change blur', function(event) {
		$(this).val(function(i, text) {
			return $F['tireNum'](text);
		});
	});
};
$U.formatInputValue = function() {
	$("table.input input.currency,input.currency-mix").val(function(i, text) {
		if (text) {
			return $F['currency'](text);
		} else {
			return 0;
		}
	});
	$("table.input input.zip-code").val(function(i, text) {
		return $F['zipCode'](text);
	});
	$("table.input input.datetime").val(function(i, text) {
		return $F['datetime'](text);
	});
	$("table.input input.time").val(function(i, text) {
		return $F['time'](text);
	});
	$("table.input input.date").val(function(i, text) {
		return $F['date'](text);
	});
	$("table.input input.foreigner-num").val(function(i, text) {
		return $F['foreignerNum'](text);
	});
	$("table.input input.corp-num").val(function(i, text) {
		return $F['corpNum'](text);
	});
	$("table.input input.opr-num").val(function(i, text) {
		return $F['oprNum'](text);
	});
	$("table.input input.all-phone").val(function(i, text) {
		return $F['allPhone'](text);
	});
	$("table.input input.fax").val(function(i, text) {
		return $F['fax'](text);
	});
	$("table.input input.phone").val(function(i, text) {
		return $F['phone'](text);
	});
	$("table.input input.mobile").val(function(i, text) {
		return $F['mobile'](text);
	});
	$("table.input input.license-num").val(function(i, text) {
		return $F['licenseNum'](text);
	});
	$("table.input input.pin").val(function(i, text) {
		return $F['pin'](text);
	});
	$("table.input input.bdy-num").val(function(i, text) {
		return $F['bdyNum'](text);
	});
	$("table.input input.currency-mix").val(function(i, text) {
		return $F['currency'](text);
	});
	$("table.input input.card-num").val(function(i, text) {
		return $F['cardNum'](text);
	});
	$("table.input input.tire-num").val(function(i, text) {
		return $F['tireNum'](text);
	});
};

/**
 * 달력 날짜를 date1 <= date2 형식이 되도록 ui에서 막음
 */
$U.setDateRange = function(date1_selector, date2_selector) {
	var d1 = $(date1_selector), d2 = $(date2_selector);
	d1.datepicker("option", "maxDate", $F.date(d2.val()));
	d2.datepicker("option", "minDate", $F.date(d1.val()));

	d1.change(function(event) {
		if ($R.date.test($F.date(d1.val()))) {
			d2.datepicker("option", "minDate", $F.date(d1.val()));
		}
	});
	d2.change(function(event) {
		if ($R.date.test($F.date(d2.val()))) {
			d1.datepicker("option", "maxDate", $F.date(d2.val()));
		}
	});
};

/**
 //// Parent Code
 function popup(_window, name, cmd, data) {
 	switch(name){
 	case 'child_name':
 		break;
 	}
 }
 var pop = window.open('page.html', 'child_name');
 pop.dialogArguments = data;
 
 //// Child Code
 var data = window.dialogArguments; //팝업에서 opener의 데이터받기
 opener.popup(window, window.name, null, null); //parent 호출하기
 */
$U.makePopupName = function(url) {
	var idx = url.indexOf("?");
	url = url.substring(0, idx);
	return url.match(/[\w]/g).join("");
};
$U.modal = function(url, width, height, data) {
	var returnVal = window.showModalDialog(url, data, "dialogWidth:" + width + "px; dialogHeight:" + height + "px; center:1; resizable:1; scroll:1");
	return returnVal;
};
/**
function ("./bookAdd", "bookAdd", 800, 600)
*/
$U.popup = function(url, name, width, height, dialogArguments) {
	var cWin = window.open(url, "_blank", 'left=100, top=100, width=' + width + ', height=' + height + ', resizable=1, scrollbars=1, statsbar=1');
	cWin.name = name;
	cWin.dialogArguments = dialogArguments;
	return cWin;
};
/**
function ("./bookAdd", $("#form").serializeArray() )
function ("./bookAdd", [ { "name" : "age", "value" : 20 }, { "name" : "use_yn", "value" : "y" } ] )
*/
$U.downloadExcel = function(url, serializeArray) {
	if (serializeArray) {
		var form = $("<form>").attr({
			"id" : "excelform" + new Date().getTime(),
			"method" : "post",
			"action" : url,
			"target" : "_blank"
		}).css({
			"z-index" : -1000,
			"left" : -1000,
			"top" : 0,
		}).appendTo(document.body);
		for ( var i = 0; i < serializeArray.length; i += 1) {
			var json = serializeArray[i];
			$("<input type='hidden'>").attr({
				"name" : json.name,
				"value" : json.value
			}).appendTo(form);
		}
		form.submit().remove();
	} else {
		window.open(url);
	}
};
$U.popupLargeSize = function(url, name, dialogArguments) {
	return $U.popup(url, name, 1200, 700, dialogArguments);
};
$U.popupMiddleSize = function(url, name, dialogArguments) {
	return $U.popup(url, name, 800, 500, dialogArguments);
};
$U.popupSmallSize = function(url, name, dialogArguments) {
	return $U.popup(url, name, 400, 300, dialogArguments);
};
/**
 * data getting
 */
$U.getNumber = function(val) {
	switch (typeof val) {
	case "string":
		val = val.replace(/,/g, '');
		val = parseInt(val);
		if (!val) {
			val = 0;
		}
		break;
	case "number":
		break;
	default:
		val = 0;
		break;
	}
	return val;
};

/**
 * window
 */
$U.windowIsClosed = function(_window, cb) {
	setTimeout(function() {
		cb(_window.closed);
	}, 500);
};
$U.windowReload = function() {
	window.onunload = null;
	window.location.reload();
};
/**
 * jqgrid resize
 */
$U.gridResize = function(gridSelector, gridBoxSelector) {
	$(window).on('resize', function() {
		$(gridSelector).setGridWidth($(gridBoxSelector).width() + (gridBoxSelector == window ? -20 : 0));
	}).trigger('resize');
};
/**
<input type="checkbox" name="chk" value="ALL">전체
<input type="checkbox" name="chk" value="Y">Y
<input type="checkbox" name="chk" value="N">N
 
 function("chk", "ALL", 1, "최소한개는 입력해야합니다") 
 */
$U.setEventCheckboxHasValueAll = function(checkbox_name, allValue, requiredMinChkLen, requiredMinChkLenMsg) {
	var chks = $("input[name=" + checkbox_name + "]");
	if (arguments.length < 3) {
		requiredMinChkLen = 0;
	}
	if (arguments.length < 4) {
		requiredMinChkLenMsg = "최소" + requiredMinChkLen + "개 이상은 선택하셔야 합니다";
	}
	var requiredMinChk = function(allChk) {
		if (chks.filter(":checked").length < requiredMinChkLen) {
			alert(requiredMinChkLenMsg);
			if (allChk) {
				chks.attr('checked', true);
			}
			return false;
		} else {
			return true;
		}
	};
	chks.click(function(event) {
		if ($(this).is(":checked")) {
			if ($(this).val() != allValue) {
				chks.filter("[value=" + allValue + "]").attr('checked', false);
				return requiredMinChk(false);
			} else {
				chks.filter(":not([value=" + allValue + "])").attr('checked', true);
				return requiredMinChk(false);
			}
		} else {
			if ($(this).val() != allValue) {
				chks.filter("[value=" + allValue + "]").attr('checked', false);
				return requiredMinChk(false);
			} else {
				chks.filter(":not([value=" + allValue + "])").attr('checked', false);
				return requiredMinChk(true);
			}
		}
	});
};
/**
 * ajax error message
 */
$U.makeAJAXErrorMessage = function(jqXHR) {
	var status = jqXHR.status;
	var statusText = decodeURIComponent(jqXHR.statusText).replace(/\+/g, ' ');
	// return "<p style='text-align:center'><b style='color:red'>" + status +
	// "</b></p><p style='text-align:center'>" + statusText + "</p>";
	return status + " : " + statusText;
};

/**
 * matched string
 */
$U.matchedDatetime = function(string) {
	if (!string)
		return "";
	var match = string.match(/\d{4}\-\d{2}\-\d{2}\s\d{2}\:\d{2}/); // 2013-01-01
	// 10:11
	return match ? match[0] : string;
};
$U.matchedDate = function(string) {
	if (!string)
		return "";
	var match = string.match(/\d{4}\-\d{2}\-\d{2}/); // 2013-01-01
	return match ? match[0] : string;
};
$U.matchedTime = function(string) {
	if (!string)
		return "";
	var match = string.match(/\d{2}\:\d{2}/); // 10:11
	return match ? match[0] : string;
};
// 실제나이 구하기
$U.getRealAge = function(pin) {
	var realAge = 0;
	if (pin && pin.length >= 6) {
		var date = new Date();
		var dateYY = parseInt(date.format("yyyy").substring(2, 4)), dateMMDD = parseInt(date.format("MMdd"));
		var pinYY = parseInt(pin.substring(0, 2)), pinMMDD = parseInt(pin.substring(2, 6));
		if (pinYY <= dateYY) {
			realAge = dateYY - pinYY;
		} else {
			realAge = 100 + dateYY - pinYY;
		}
		if (dateMMDD < parseInt(pin.substring(2, 6))) {
			realAge -= 1;
		}
	}
	return realAge;
};
// 면허경력 구하기
$U.getLicenseCareer = function(licenseNum) {
	var licenseCareer = 0;
	if ($R["licenseNum"].test(licenseNum)) {
		var dateYY = parseInt(new Date().format("yyyy").substring(2, 4));
		var licenseNumYY = parseInt(licenseNum.substring(0, 2));

		if (licenseNumYY <= dateYY) {
			licenseCareer = dateYY - licenseNumYY;
		} else {
			licenseCareer = 100 + dateYY - licenseNumYY;
		}
	}
	return licenseCareer;
};
$U.privatePin = function(pin) {
	var p1 = pin.match(/^[0-9]{6}/);
	var p2 = pin.match(/-[0-9]{7}/);
	if (p1) {
		return p1[0] + (p2 ? p2[0].replace(/(-[0-9]{2})([0-9]{5})/, "$1*****") : "-");
	} else {
		return "";
	}
};
// ////////////////////////////// 삭제대상
/**
 * @deprecated
 */
$U.blockGridNodata = function(selector) {
	$(selector).block({
		baseZ : 0,
		message : "조회결과가 없습니다",
		css : {
			color : '#000',
			border : '0',
			backgroundColor : "transparent",
			cursor : 'default'
		},
		overlayCSS : {
			backgroundColor : "transparent",
			cursor : 'default'
		},
	});
};
/**
 * @deprecated
 */
$U.blockGridError = function(selector, message) {
	$(selector).block({
		baseZ : 0,
		message : message,
		css : {
			color : '#000000',
			border : '0',
			backgroundColor : "transparent",
			cursor : 'default'
		},
		overlayCSS : {
			backgroundColor : "transparent",
			cursor : 'default'
		},
	});
};
/**
 * @deprecated
 */
$U.blockLoading = function(selector) {
	$(selector).block({
		baseZ : 9999,
		css : {
			backgroundColor : "transparent",
			border : "0",
			height : "0"
		},
		message : "<img src='${pageContext.request.contextPath}/images/loading.gif'/>"
	});
};
/**
 * @deprecated
 */
$U.unblock = function(selector) {
	$(selector).unblock();
};

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
$U.doEnter = function(event, target_selector) {
	event = event || window.event;
	if (event.keyCode == 13) { // 엔터키이면
		$(target_selector).click(); // 타켓을 클릭한다
	}
};
$U.procAJAXError = function(jqXHR) {
	// send canceled is xhr.status : 0
	if (jqXHR.status != 0) {
		alert($U.makeAJAXErrorMessage(jqXHR));
	}
};