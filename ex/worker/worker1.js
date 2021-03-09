/**
 * 
 */

//self.close(); // Terminates the worker.
var _ws = null;

//importScripts('io.js');

self.onmessage = function(e) {
	var cmd = e.data.cmd;
	var msg = e.data.msg;
	switch (cmd) {
	case 'start':
		if (typeof (WebSocket)) {
			_ws = new WebSocket(msg);
		} else if (typeof (MozWebSocket)) {
			_ws = new MozWebSocket(msg);
		} else {
			self.postMessage({
			"cmd" : "log",
			"msg" : 'unsupported browser'
			});
		}

		if (_ws != null) {
			_ws.onopen = function() {
				self.postMessage({
				"cmd" : "onopen",
				"msg" : null
				});
			};
			_ws.onmessage = function(event) {
				self.postMessage({
				"cmd" : "onmessage",
				"msg" : event.data
				});
			};
			_ws.onclose = function() {
				self.postMessage({
				"cmd" : "onclose",
				"msg" : null
				});
			};
		}
		break;
	case 'stop':
		if (_ws != null) {
			_ws.close();
			_ws = null;
		} else {
			self.postMessage({
			"cmd" : "log",
			"msg" : 'web socket null'
			});
		}
		break;
	case 'sendmsg':
		if (_ws != null) {
			_ws.send(msg);
		} else {
			self.postMessage({
			"cmd" : "log",
			"msg" : 'web socket null'
			});
		}
		break;
	default:
		self.postMessage({
		"cmd" : "log",
		"msg" : 'unknown command' + cmd
		});
		break;
	}
};
