/**
"나이 {{0}}세 입니다. 사는곳은 {{1}} 입니다".format( [21, "경기도"] )
"나이 {{age}}세 입니다. 사는곳은 {{addr}} 입니다".format( { age : 21, addr : "경기도" } )
 * */
String.prototype.format = function (p) {
  return this.replace(/({{[\w]+}})/g, function ($1) {
    var m = $1.match(/[\w]+/)[0];
    return p[m] != undefined ? p[m] : "";
  });
};
String.prototype.string = function (len) {
  var s = "",
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};
Date.prototype.format = function (f) {
  if (!this.valueOf()) return " ";

  var weekName = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일"
  ];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|EEE|E|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
      case "yyyy":
        return d.getFullYear();
      case "yy":
        return (d.getFullYear() % 1000).zf(2);
      case "MM":
        return (d.getMonth() + 1).zf(2);
      case "dd":
        return d.getDate().zf(2);
      case "EEE":
        return weekName[d.getDay()];
      case "E":
        return weekName[d.getDay()].substring(0, 1);
      case "HH":
        return d.getHours().zf(2);
      case "hh":
        let hh = (d.getHours() % 12).zf(2);
        return hh == "00" ? "12" : hh;
      case "mm":
        return d.getMinutes().zf(2);
      case "ss":
        return d.getSeconds().zf(2);
      case "a/p":
        return d.getHours() < 12 ? "오전" : "오후";
      default:
        return $1;
    }
  });
};
Math.randomRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
window.width = function () {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
};
window.height = function () {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  );
};
String.prototype.toHTML = function () {
  if (!this.valueOf()) return " ";
  return this.replace(/(\s|\&|\>|\<|\"|\'|\\n)/g, function ($1) {
    switch ($1) {
      case " ":
        return "&nbsp;";
      case "&":
        return "&amp;";
      case ">":
        return "&gt;";
      case "<":
        return "&lt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      case "\\n":
        return "<br>";
      default:
        return $1;
    }
  });
};
HTMLIFrameElement.prototype.getWindow = function () {
  return this.contentWindow || this.contentDocument.defaultView;
};
HTMLIFrameElement.prototype.getDocument = function () {
  return this.contentWindow.document || this.contentDocument;
};
Element.prototype.bounds = function (parentNode) {
  var myR = this.getBoundingClientRect();
  var rect = {
    left: myR.left,
    right: myR.right,
    top: myR.top,
    bottom: myR.bottom,
    width: myR.width ? myR.width : myR.right - myR.left,
    height: myR.height ? myR.height : myR.bottom - myR.top
  };
  switch (arguments.length) {
    case 1:
      var parentR = parentNode.getBoundingClientRect();
      rect.left = rect.left - parentR.left;
      rect.right = rect.right - parentR.right;
      rect.top = rect.top - parentR.top;
      rect.bottom = rect.bottom - parentR.bottom;
      break;
  }
  return rect;
};

var UTILS = {
  preLoadImage: function ($input, success, error) {
    var input = $input[0];
    var file = input.files[0];

    //파일을 읽기 위한 FileReader객체 생성
    var reader = new FileReader();
    reader.onload = function (e) {
      success(e.target.result);
    };
    reader.onerror = function (e) {
      error(e);
    };
    reader.onabort = function (e) {
      error(e);
    };
    reader.readAsDataURL(file);
  },
  addCommaNumber: function (str) {
    return String(str).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  removeCommaNumber: function (str) {
    return Number(("" + str).replace(new RegExp(",", "g"), ""));
  },
  sumNumber: function (num1, num2) {
    return UTILS.addCommaNumber(
      UTILS.removeCommaNumber(num1) + UTILS.removeCommaNumber(num2)
    );
  }
};

/**
 * 액션
 * */
var Action = new (function () {
  /**
   * 함수가 호출된 이후 딜레이 시간동안은 false를 반환한다. 함수를 여러번 호출해도 소용이 없다
   * @param delay {Number}
   * @param _key {String}
   * */
  var sleepTimer = {};
  this.sleep = function (delay, _key) {
    var key = arguments.length == 1 ? arguments.callee.caller.toString() : _key;
    if (!sleepTimer[key]) {
      sleepTimer[key] = setTimeout(function () {
        clearTimeout(sleepTimer[key]);
        delete sleepTimer[key];
      }, delay);
      return false;
    } else {
      return true;
    }
  };
  /**
   * 함수를 호출할때마다 딜레이가 초기화 되고, 딜레이가 끝나면 콜백함수를 호출한다
   * @param key {String}
   * @param delay {Number}
   * @param cb {Function}
   * */
  var keepTimer = {};
  this.keep = function (key, delay, cb) {
    clearTimeout(keepTimer[key]);
    keepTimer[key] = setTimeout(function () {
      delete keepTimer[key];
      cb();
    }, delay);
  };
})();

/**
 * 작업목록이 있을때만 delay마다 작업들을 처리
 * */
function KWorker(delay_ms) {
  let _this = this;
  let delay = delay_ms ? delay_ms : 1 * 1000;
  let work = {};
  let timer = null;

  let stop = function () {
    console.log(`[KWorker] stop`);
    clearTimeout(timer);
    timer = null;
  };

  let run = function () {
    console.log(`[KWorker] delay_ms: ${delay}`);
    timer = setTimeout(function () {
      if (_this.hasWork()) {
        run();
      } else {
        stop();
      }
    }, delay);

    for (let key in work) {
      setTimeout(work[key]);
    }
  };

  this.add = function (key, cb) {
    console.log(`[KWorker] add ${key}`);
    work[key] = cb;
    if (!timer) {
      run();
    }
    return this;
  };

  this.remove = function (key) {
    console.log(`[KWorker] remove ${key}`);
    delete work[key];
    return this;
  };

  this.removeAll = function () {
    for (let key in work) {
      console.log(`[KWorker] remove ${key}`);
      delete work[key];
    }
    return this;
  };

  this.hasWork = function () {
    for (let key in work) {
      return true;
    }
    return false;
  };

  this.length = function () {
    let len = 0;
    for (let key in work) {
      len += 1;
    }
    return len;
  };
}

var URL = {};
URL.replaceParam = function (url, json) {
  var eIdx = url.indexOf("?");
  if (eIdx != -1) {
    var tmp = URL.getParams(url);
    url = url.substring(0, url.indexOf("?"));
    for (var tmpAttr in tmp) {
      for (var jsonAttr in json) {
        if (tmpAttr == jsonAttr) {
          tmp[tmpAttr] = json[jsonAttr];
        }
      }
    }
    return URL.addParam(url, tmp);
  } else {
    return url;
  }
};

URL.getParams = function (url) {
  var tmp = url;
  var ret = {};
  var sIdx = url.indexOf("?");

  if (sIdx != -1) {
    tmp = tmp.substring(sIdx + 1, tmp.length);

    tmp = tmp.split("&");
    for (var i = 0; i < tmp.length; i++) {
      var arr = tmp[i].split("=");
      ret[arr[0]] = arr[1];
    }
  }
  return ret;
};
URL.addParam = function (url, json) {
  if (url.indexOf("?") < 0) {
    url += "?";
  }

  for (var name in json) {
    if (name) {
      url += "&" + name + "=" + json[name];
    }
  }
  return url;
};

const DelayJob = function () {
  var timer;

  this.set = function (cb, delay) {
    clearTimeout(timer);

    if (cb) {
      timer = setTimeout(cb, delay);
    }
  };
};

JSON.get = function (url, header = {}) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  for (let [key, value] of Object.entries(header)) {
    xhr.setRequestHeader(key, value);
  }
  xhr.send();
  return JSON.parse(xhr.response);
};

window.performance = window.performance || {};
performance.now = (function () {
  return (
    performance.now ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    performance.webkitNow ||
    function () {
      return new Date().getTime();
    }
  );
})();
