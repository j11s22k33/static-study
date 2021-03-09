// 김선용 2006.3 - 전화번호(휴대폰) 형식 검사 : 123-123(4)-5678
function wrestTelnumber(fld) {

	if (!wrestTrim(fld))
		return;

	var pattern = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
	if (!pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + " : 전화번호 형식이 올바르지 않습니다.\n\n하이픈(-)을 포함하여 입력해 주십시오.\n";
			wrestFld = fld;
			fld.select();
		}
	}
}

// 이메일주소 형식 검사
function wrestEmail(fld) {
	if (!wrestTrim(fld))
		return;

	//var pattern = /(\S+)@(\S+)\.(\S+)/; 이메일주소에 한글 사용시
	var pattern = /([0-9a-zA-Z_-]+)@([0-9a-zA-Z_-]+)\.([0-9a-zA-Z_-]+)/;
	if (!pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + " : 이메일주소 형식이 아닙니다.\n";
			wrestFld = fld;
		}
	}
}

// 회원아이디 검사
function wrestMemberId(fld) {
	if (!wrestTrim(fld))
		return;

	var pattern = /(^([a-z0-9]+)([a-z0-9_]+$))/;
	if (!pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + " : 회원아이디 형식이 아닙니다.\n\n영소문자, 숫자, _ 만 가능.\n\n첫글자는 영소문자, 숫자만 가능\n";
			wrestFld = fld;
		}
	}
}

// 한글인지 검사 (자음, 모음만 있는 한글은 불가)
function wrestHangul(fld) {
	if (!wrestTrim(fld))
		return;

	var pattern = /([^가-힣\x20])/i;

	if (pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + ' : 한글이 아닙니다. (자음, 모음만 있는 한글은 처리하지 않습니다.)\n';
			wrestFld = fld;
		}
	}
}

// 한글인지 검사2 (자음, 모음만 있는 한글도 가능)
function wrestHangul2(fld) {
	if (!wrestTrim(fld))
		return;

	var pattern = /([^가-힣ㄱ-ㅎㅏ-ㅣ\x20])/i;

	if (pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + ' : 한글이 아닙니다.\n';
			wrestFld = fld;
		}
	}
}

// 한글,영문,숫자인지 검사3
function wrestHangulAlphaNumeric(fld) {
	if (!wrestTrim(fld))
		return;

	var pattern = /([^가-힣\x20^a-z^A-Z^0-9])/i;

	if (pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + ' : 한글, 영문, 숫자가 아닙니다.\n';
			wrestFld = fld;
		}
	}
}

// 숫자인지검사 
// 배부른꿀꿀이님 추가 (http://dasir.com) 2003-06-24
function wrestNumeric(fld) {
	if (fld.value.length > 0) {
		for (var i = 0; i < fld.value.length; i++) {
			if (fld.value.charAt(i) < '0' || fld.value.charAt(i) > '9') {
				wrestMsg = wrestItemname(fld) + " : 숫자가 아닙니다.\n";
				wrestFld = fld;
			}
		}
	}
}

// 영문자 검사 
// 배부른꿀꿀이님 추가 (http://dasir.com) 2003-06-24
function wrestAlpha(fld) {
	if (!wrestTrim(fld))
		return;

	var pattern = /(^[a-zA-Z]+$)/;
	if (!pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + " : 영문이 아닙니다.\n";
			wrestFld = fld;
		}
	}
}

// 영문자와 숫자 검사 
// 배부른꿀꿀이님 추가 (http://dasir.com) 2003-07-07
function wrestAlphaNumeric(fld) {
	if (!wrestTrim(fld))
		return;
	var pattern = /(^[a-zA-Z0-9]+$)/;
	if (!pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + " : 영문 또는 숫자가 아닙니다.\n";
			wrestFld = fld;
		}
	}
}

// 영문자와 숫자 그리고 _ 검사 
function wrestAlphaNumericUnderLine(fld) {
	if (!wrestTrim(fld))
		return;

	var pattern = /(^[a-zA-Z0-9\_]+$)/;
	if (!pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + " : 영문, 숫자, _ 가 아닙니다.\n";
			wrestFld = fld;
		}
	}
}

// 주민등록번호 검사
function wrestJumin(fld) {
	if (!wrestTrim(fld))
		return;
	var pattern = /(^[0-9]{13}$)/;
	if (!pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + " : 주민등록번호를 13자리 숫자로 입력하십시오.\n";
			wrestFld = fld;
		}
	} else {
		var sum_1 = 0;
		var sum_2 = 0;
		var at = 0;
		var juminno = fld.value;
		sum_1 = (juminno.charAt(0) * 2) + (juminno.charAt(1) * 3) + (juminno.charAt(2) * 4) + (juminno.charAt(3) * 5) + (juminno.charAt(4) * 6) + (juminno.charAt(5) * 7) + (juminno.charAt(6) * 8) + (juminno.charAt(7) * 9) + (juminno.charAt(8) * 2) + (juminno.charAt(9) * 3) + (juminno.charAt(10) * 4) + (juminno.charAt(11) * 5);
		sum_2 = sum_1 % 11;

		if (sum_2 == 0)
			at = 10;
		else {
			if (sum_2 == 1)
				at = 11;
			else
				at = sum_2;
		}
		att = 11 - at;
		// 1800 년대에 태어나신 분들은 남자, 여자의 구분이 9, 0 이라는 
		// 얘기를 들은적이 있는데 그렇다면 아래의 구문은 오류이다.
		// 하지만... 100살넘은 분들이 주민등록번호를 과연 입력해볼까?
		if (juminno.charAt(12) != att || juminno.substr(2, 2) < '01' || juminno.substr(2, 2) > '12' || juminno.substr(4, 2) < '01' || juminno.substr(4, 2) > '31' || juminno.charAt(6) > 4) {
			wrestMsg = wrestItemname(fld) + " : 올바른 주민등록번호가 아닙니다.\n";
			wrestFld = fld;
		}

	}
}

// 사업자등록번호 검사
function wrestSaupja(fld) {
	if (!wrestTrim(fld))
		return;
	var pattern = /(^[0-9]{10}$)/;
	if (!pattern.test(fld.value)) {
		if (wrestFld == null) {
			wrestMsg = wrestItemname(fld) + " : 사업자등록번호를 10자리 숫자로 입력하십시오.\n";
			wrestFld = fld;
		}
	} else {
		var sum = 0;
		var at = 0;
		var att = 0;
		var saupjano = fld.value;
		sum = (saupjano.charAt(0) * 1) + (saupjano.charAt(1) * 3) + (saupjano.charAt(2) * 7) + (saupjano.charAt(3) * 1) + (saupjano.charAt(4) * 3) + (saupjano.charAt(5) * 7) + (saupjano.charAt(6) * 1) + (saupjano.charAt(7) * 3) + (saupjano.charAt(8) * 5);
		sum += parseInt((saupjano.charAt(8) * 5) / 10);
		at = sum % 10;
		if (at != 0)
			att = 10 - at;

		if (saupjano.charAt(9) != att) {
			wrestMsg = wrestItemname(fld) + " : 올바른 사업자등록번호가 아닙니다.\n";
			wrestFld = fld;
		}

	}
}

var checkFormat = {
	specialChar : function(textObj) {
		var exceptionSpecialKey = /[<>\\\'\"]/gi;
		if (exceptionSpecialKey.test(textObj.value)) {
			alert("일정 특수문자는 사용할 수 없습니다");
			textObj.value = textObj.value.replace(exceptionSpecialKey, "");
			return;
		}
	},
	onlyEngOrNum : function(textObj) {
		var exceptionSpecialKey = /[^0-9a-z]/gi;
		if (exceptionSpecialKey.test(textObj.value)) {
			alert("영문과 숫자로만 입력가능합니다.");
			textObj.value = textObj.value.replace(exceptionSpecialKey, "");
			return;
		}
	},
	number : function(textObj) {
		var exceptionSpecialKey = /[^0-9]/gi;
		if (exceptionSpecialKey.test(textObj.value)) {
			alert("숫자만 입력할 수 있습니다.");
			textObj.value = textObj.value.replace(exceptionSpecialKey, "");
			return false;
		}else{
			return true;
		}
	},
	
	time : function(textObj) {
		var exceptionSpecialKey = /[^0-9+:]/gi;
		if (exceptionSpecialKey.test(textObj.value)) {
			alert("시간만 입력할 수 있습니다.");
			textObj.value = textObj.value.replace(exceptionSpecialKey, "");
			return false;
		}else{
			return true;
		}
	},
	price : function(textObj) {
		var exceptionSpecialKey = /[^0-9,]/gi;
		if (exceptionSpecialKey.test(textObj.value)) {
			alert("숫자만 입력할 수 있습니다.");
			textObj.value = textObj.value.replace(exceptionSpecialKey, "");
			return;
		}
	},
	firstKeySpace : function(textObj) {
		var firstSpaceDelStr = textObj.value;
		if (firstSpaceDelStr.charAt(0) != " ") {
			return;
		}
		var firstKeyIndex = 0;
		for ( var i = 0; i < textObj.value.length; i++) {
			if (textObj.value.charAt(i) == " ") {
				firstKeyIndex++;
			} else {
				break;
			}
		}
		if (firstKeyIndex > 0) {
			alert("첫문자는 공백을 입력할 수 없습니다.");
			firstSpaceDelStr = firstSpaceDelStr.substring(firstKeyIndex, firstSpaceDelStr.length);
			textObj.value = firstSpaceDelStr;
		}
		return;
	},
	textAreaCheck : function(textObj, tempTextObj, maxLength, maxLine) {
		var enterCount = 0;
		var enterCountArr = textObj.value.split("\r\n");
		enterCount = enterCountArr.length - 1;
		if (textObj.value.length > maxLength) {
			alert("총 " + maxLength + "자 까지 입력할 수 있습니다.");
			textObj.value = tempTextObj.value;
			textObj.focus();
			return;
		} else if (enterCount >= maxLine) {
			alert("총 " + maxLine + "줄 까지 입력할 수 있습니다.");
			textObj.value = tempTextObj.value;
			textObj.focus();
			return;
		} else {
			tempTextObj.value = textObj.value;
		}
	}
};

function checkStrLen(textObj, maxLength) {
	var charTemp = "";
	var stringTemp = "";
	var messageLength = maxLength * 2;

	for ( var k = 0; k < textObj.value.length; k++) {
		charTemp = textObj.value.charAt(k);
		if (escape(charTemp).length > 4) {
			messageLength -= 2;
		} else {
			messageLength--;
		}
		if (messageLength < 0) {
			alert("총 영문 " + (maxLength * 2) + "자 한글 " + maxLength + "자 까지 입력할 수 있습니다.");
			textObj.value = stringTemp;
			break;
		} else {
			stringTemp += charTemp;
		}
	}
}
