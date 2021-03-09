///////////////////////////////////////////////
///
//////////////////////////////////////////////

var $F = {};

$F["currency"] = function(text) {
	return String(text).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};
$F["zipCode"] = function(text) {
	return String(text).replace($R["zipCode"], "$1-$2");
};
$F["datetime"] = function(text) {
	return String(text).replace($R["datetime"], "$1-$2-$3 $4:$5");
};
$F["time"] = function(text) {
	return String(text).replace($R["time"], "$1:$2");
};
$F["date"] = function(text) {
	return String(text).replace($R["date"], "$1-$2-$3");
};
$F["foreignerNum"] = function(text) {
	return String(text).replace($R["foreignerNum"], "$1-$2-$3");
};
$F["corpNum"] = function(text) {
	return String(text).replace($R["corpNum"], "$1-$2");
};
$F["oprNum"] = function(text) {
	return String(text).replace($R["oprNum"], "$1-$2-$3");
};
$F["allPhone"] = function(text) {
	return String(text).replace($R["allPhone"], "$1-$2-$3");
};
$F["fax"] = function(text) {
	return String(text).replace($R["fax"], "$1-$2-$3");
};
$F["phone"] = function(text) {
	return String(text).replace($R["phone"], "$1-$2-$3");
};
$F["mobile"] = function(text) {
	return String(text).replace($R["mobile"], "$1-$2-$3");
};
$F["licenseNum"] = function(text) {
	return String(text).replace($R["licenseNum"], "$1-$2-$3");
};
$F["pin"] = function(text) {
	return String(text).replace($R["pin"], "$1-$2");
};
$F["bdyNum"] = function(text) {
	return String(text).replace($R["bdyNum"], "$1$2$3$4$5");
};
$F["cardNum"] = function(text) {
	if ($R["cardNum37xx"].test(String(text))) {
		return String(text).replace($R["cardNum37xx"], "$1-$2-$3");
	} else if ($R["cardNum36xx"].test(String(text))) {
		return String(text).replace($R["cardNum36xx"], "$1-$2-$3");
	} else {
		return String(text).replace($R["cardNum"], "$1-$2-$3-$4");
	}
};
$F["tireNum"] = function(text) {
	if ($R["tireNum"].test(String(text))) {
		return String(text).replace($R["tireNum"], "$1-$2-$3");
	} else {
		return String(text).replace($R["tireNum1"], "$1-$2");
	}
};
