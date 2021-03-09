/**
 * <pre>
 * 폼유틸 개체를 생성한다
 * var fu = new Form();
 * 
 * <form></form> 폼 엘리먼트가 포함되지 않은 부모노드를 준비한다 
 * var parentNode = document.body;
 * 
 * 폼을 전송한다
 * fu.submit(Form.ENCTYPE_MULTIPART, parentNode, "./imgviewUpload.jsp", cb);
 * </pre>
 * 
 * @returns {Form}
 */
//formEle 생성하여 전송 후 formEle 제거
//sumit 호출하고, callback 받은 이후에 다시 submit 호출해야함
//즉 callback 함수 불리기 전에 submit 여러번 호출하면 안된다!!!!
function Form() {
	/**
	 * @param enctype [ Form.ENCTYPE_APPLICATION | Form.ENCTYPE_MULTIPART ]
	 * @param parentNode input 엘리먼트를 담고 있는 부모노드 (폼 엘리먼트가 포함되면 안된다)
	 * @param action 전송할 URL
	 * @param callback 리턴함수 등록, 문자열을 받을수 있다
	 */

	var formKey = "form" + new Date().getTime();
	var ifrmKey = "ifrm" + new Date().getTime();
	var parentNode = null;
	var enctype = null;
	var action = null;
	var callback = null;
	var form = null;
	var ifrm = null;

	var submitLock = false;
	var ifrmOnloadLock = false;

	this.submit = function(_parentNode, _enctype, _action, _callback) {
		if (!submitLock) {
			submitLock = true;
			ifrmOnloadLock = true;

			parentNode = _parentNode;
			enctype = _enctype;
			action = _action;
			callback = _callback;

			setForm();
			setIFrm();

			ifrmOnloadLock = false;
			form.submit();
		}
	};

	function setIFrm() {
		ifrm = document.createElement("IFRAME");
		ifrm.id = ifrmKey; // IE
		ifrm.name = ifrmKey;
		ifrm.style.display = "none";

		ifrm['onload'] = function() {
			if (!ifrmOnloadLock) {
				var ret = null;
				if (callback) {
					ret = ifrm.contentWindow.document.body.innerHTML || ifrm.contentDocument.body.innerHTML;
				}

				window.setTimeout(function() {
					ifrm.parentNode.removeChild(ifrm);
					form.parentNode.removeChild(form);
					while (form.hasChildNodes()) {
						parentNode.appendChild(form.firstChild);
					}

					submitLock = false;
					if (callback) {
						callback(ret);
					}
				}, 0);
			}
		};

		document.body.appendChild(ifrm);

		if (window.frames[ifrmKey].name != ifrmKey) { //IE
			window.frames[ifrmKey].name = ifrmKey;
		}
	}

	function setForm() {
		form = document.createElement("FORM");
		form.name = formKey;
		form.target = ifrmKey;
		form.method = "POST";
		form.action = action;
		form.style.margin = "0px"; //IE

		switch (enctype) {
		case Form.ENCTYPE_APPLICATION:
			form.encoding = "application/x-www-form-urlencoded"; //IE
			form.enctype = "application/x-www-form-urlencoded";
			break;
		case Form.ENCTYPE_MULTIPART:
			form.encoding = "multipart/form-data"; //IE
			form.enctype = "multipart/form-data";
			break;
		}

		while (parentNode.hasChildNodes()) {
			form.appendChild(parentNode.firstChild);
		}
		parentNode.appendChild(form);
	}
}
Form.ENCTYPE_APPLICATION = 0;
Form.ENCTYPE_MULTIPART = 1;

function Form1() {
	/**
	 * @param enctype [ Form.ENCTYPE_APPLICATION | Form.ENCTYPE_MULTIPART ]
	 * @param parentNode input 엘리먼트를 담고 있는 부모노드 (폼 엘리먼트가 포함되면 안된다)
	 * @param action 전송할 URL
	 * @param callback 리턴함수 등록, 문자열을 받을수 있다
	 */

	var formKey = "form" + new Date().getTime();
	var ifrmKey = "ifrm" + new Date().getTime();
	var enctype = null;
	var action = null;
	var callback = null;
	var form = null;
	var ifrm = null;

	var submitLock = false;
	var ifrmOnloadLock = false;

	this.submit = function(_form, _enctype, _action, _callback) {
		if (!submitLock) {
			submitLock = true;
			ifrmOnloadLock = true;

			form = _form;
			enctype = _enctype;
			action = _action;
			callback = _callback;

			setForm();
			setIFrm();

			ifrmOnloadLock = false;
			form.submit();
		}
	};

	function setIFrm() {
		ifrm = document.createElement("IFRAME");
		ifrm.id = ifrmKey; // IE
		ifrm.name = ifrmKey;
		ifrm.style.display = "none";

		ifrm['onload'] = function() {
			if (!ifrmOnloadLock) {
				var ret = null;
				if (callback) {
					ret = ifrm.contentWindow.document.body.innerHTML || ifrm.contentDocument.body.innerHTML;
				}

				window.setTimeout(function() {
					ifrm.parentNode.removeChild(ifrm);

					submitLock = false;
					if (callback) {
						callback(ret);
					}
				}, 0);
			}
		};

		document.body.appendChild(ifrm);

		if (window.frames[ifrmKey].name != ifrmKey) { //IE
			window.frames[ifrmKey].name = ifrmKey;
		}
	}

	function setForm() {
		form.name = formKey;
		form.target = ifrmKey;
		form.method = "POST";
		form.action = action;
		form.style.margin = "0px"; //IE

		switch (enctype) {
		case Form.ENCTYPE_APPLICATION:
			form.encoding = "application/x-www-form-urlencoded"; //IE
			form.enctype = "application/x-www-form-urlencoded";
			break;
		case Form.ENCTYPE_MULTIPART:
			form.encoding = "multipart/form-data"; //IE
			form.enctype = "multipart/form-data";
			break;
		}
	}
}
Form1.ENCTYPE_APPLICATION = 0;
Form1.ENCTYPE_MULTIPART = 1;