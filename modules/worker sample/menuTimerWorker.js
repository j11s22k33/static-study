function run() {
	var date = new Date();
	var prefix = "am";
	var hour = date.getHours();
	var min = date.getMinutes();
	if (hour >= 12) {
		prefix = "pm";
	}
	if (hour >= 13) {
		hour = hour - 12;
	}
	hour = (hour + "").length < 2 ? "0" + hour : hour;
	min = (min + "").length < 2 ? "0" + min : min;
	var sendMsg = hour + "|" + prefix + "|" + min;
	postMessage(sendMsg);

	setTimeout(run, 60 * 1000);
}

run();