/**
 *
 * stringFullDay : '2011-11-11'
 */
function Calendar(stringFullDay) {
  var self = this;
  var separator = "-";
  var cal = undefined;
  var viewObj = undefined;
  var callBack = undefined;
  var timeOut = undefined;
  var weekdayName = ["일", "월", "화", "수", "목", "금", "토"];
  var date = new Date();

  var init = function () {
    cal = document.getElementById("minical");
    if (cal == null) {
      cal = document.createElement("div");
      cal.id = "minical";
      cal.oncontextmenu = function () {
        return false;
      };
      cal.onragstart = function () {
        return false;
      };
      cal.onselectBoxObjstart = function () {
        return false;
      };
      cal.style.border = "1px solid #888888";
      cal.style.background = "buttonface";
      cal.style.width = "210px";
      cal.style.display = "none";
      cal.style.position = "absolute";
      cal.style.zIndex = 99;
      document.body.appendChild(cal);
      if (typeof document.onselectBoxObjstart != "undefined") {
        cal.onselectBoxObjstart = new Function("return false");
      } else {
        cal.onmousedown = disableSelect;
        cal.onmouseup = reEnable;
      }
    }
  };

  // _viewObj 달력을 보여줄 부모객체 (document.body)
  // _valueObj 값을 출력할 객체 (input type=text)
  /**
   * opener : 달력을 호출한 객체
   * viewObj : 달력을 보여줄 객체
   * nLeft, nTop : 달력 좌표
   * startDay : 달력 시작일 (2011-11-22)
   * callBack : 결과를 받을 콜백 함수
   */

  this.show = function (_viewObj, nLeft, nTop, _callBack) {
    viewObj = _viewObj;
    callBack = _callBack;

    if (!nLeft) {
      nLeft = 0;
    }
    if (!nTop) {
      nTop = 0;
    }
    cal.style.left = getAbsolutePos(viewObj).x + nLeft + "px";
    cal.style.top = getAbsolutePos(viewObj).y + nTop + "px";
    cal.style.display = "block";

    drawCal(date.getFullYear(), date.getMonth() + 1, date.getDate());
  };

  var drawCal = function (nYear, nMonth, nDay) {
    cal.innerHTML = "";
    nYear = Number(nYear);
    nMonth = Number(nMonth);
    nDay = Number(nDay);

    var table = getTable();
    table.appendChild(getHeader(nYear, nMonth, nDay));
    table.appendChild(getWeekField());
    var days = getDays(nYear, nMonth, nDay);
    for (var i = 0; i < days.length; i++) {
      table.appendChild(days[i]);
    }
    table.appendChild(getFooter());
    cal.appendChild(table);

    if (timeOut == null) {
      timeOut = setTimeout(self.close, 2000);
    } else {
      clearTimeout(timeOut);
      timeOut = setTimeout(self.close, 2000);
    }
    cal.onmouseout = function (event) {
      if (timeOut == null) timeOut = setTimeout(self.close, 500);
    };
    cal.onmouseover = function (event) {
      if (timeOut != null) clearTimeout(timeOut);
      timeOut = null;
    };
  };
  var getTable = function () {
    var table = document.createElement("table");
    table.width = 210;
    table.border = 0;
    table.cellPadding = 0;
    table.cellSpacing = 1;
    table.style.fontSize = "8pt";
    table.style.fontFamily = "Tahoma";
    table.onmouseover = function (event) {
      doOver(event);
    };
    table.onmouseout = function (event) {
      doOut(event);
    };
    return table;
  };
  var getHeader = function (nYear, nMonth, nDay) {
    var headerTr = document.createElement("tr");

    var headLeftArrowTd = document.createElement("td");
    headLeftArrowTd.width = 30;
    headLeftArrowTd.height = 22;
    headLeftArrowTd.align = "center";
    headLeftArrowTd.vAlign = "middle";
    headLeftArrowTd.style.padding = "0";
    headerTr.appendChild(headLeftArrowTd);

    var headYearTd = document.createElement("td");
    headYearTd.colSpan = 3;
    headYearTd.width = 90;
    headYearTd.align = "center";
    headYearTd.vAlign = "top";
    headYearTd.style.padding = "0";
    headerTr.appendChild(headYearTd);

    var headMonthTd = document.createElement("td");
    headMonthTd.colSpan = 2;
    headMonthTd.width = 60;
    headMonthTd.align = "right";
    headMonthTd.vAlign = "top";
    headMonthTd.style.padding = "0";
    headerTr.appendChild(headMonthTd);

    var headRightArrowTd = document.createElement("td");
    headRightArrowTd.width = 30;
    headRightArrowTd.align = "center";
    headRightArrowTd.vAlign = "middle";
    headRightArrowTd.style.padding = "0";
    headerTr.appendChild(headRightArrowTd);

    var tmpDate = new Date();
    tmpDate.setFullYear(nYear, nMonth - 2, 1);
    var prevYear = tmpDate.getFullYear();
    var prevMonth = tmpDate.getMonth() + 1;
    tmpDate = new Date();
    tmpDate.setFullYear(nYear, nMonth, 1);
    var nextYear = tmpDate.getFullYear();
    var nextMonth = tmpDate.getMonth() + 1;

    var headPrevSpan = document.createElement("span");
    headPrevSpan.innerHTML = "◀";
    headPrevSpan.title = "이전달";
    headPrevSpan.style.color = "#007bbd";
    headPrevSpan.style.fontSize = "10pt";
    headPrevSpan.style.fontWeight = "bold";
    headPrevSpan.style.cursor = "pointer";
    headPrevSpan.onclick = function () {
      drawCal(prevYear, prevMonth, 1);
    };
    headLeftArrowTd.appendChild(headPrevSpan);

    var headNextSpan = document.createElement("span");
    headNextSpan.innerHTML = "▶";
    headNextSpan.title = "다음달";
    headNextSpan.style.color = "#007bbd";
    headNextSpan.style.fontSize = "10pt";
    headNextSpan.style.fontWeight = "bold";
    headNextSpan.style.cursor = "pointer";
    headNextSpan.onclick = function () {
      drawCal(nextYear, nextMonth, 1);
    };
    headRightArrowTd.appendChild(headNextSpan);

    var yearSelect = new SelectBox(76);
    yearSelect.append(headYearTd);
    yearSelect.add("▲");
    for (var i = nYear - 3; i <= nYear + 3; i++) {
      yearSelect.add(i);
    }
    yearSelect.add("▼");
    yearSelect.setInputValue(nYear);
    yearSelect.setClickEvent(function () {
      drawCal(yearSelect.getInputValue(), nMonth, 1);
    });

    var monthSelect = new SelectBox(56);
    monthSelect.append(headMonthTd);
    for (var i = 1; i <= 12; i++) {
      monthSelect.add(i);
    }
    monthSelect.setInputValue(nMonth);
    monthSelect.setClickEvent(function () {
      drawCal(nYear, monthSelect.getInputValue(), 1);
    });

    return headerTr;
  };
  var getWeekField = function () {
    var weekTr = document.createElement("tr");
    weekTr.bgColor = "#00edce";
    weekTr.style.color = "white";
    weekTr.style.fontWeight = "bold";

    for (var i = 0; i < weekdayName.length; i++) {
      var weekTd = document.createElement("td");
      weekTd.innerHTML = weekdayName[i];
      weekTd.align = "center";
      weekTd.style.padding = "0";
      weekTr.appendChild(weekTd);
    }
    return weekTr;
  };
  var getDays = function (nYear, nMonth, nDay) {
    var trs = [];

    var tmpDate = new Date();
    tmpDate.setFullYear(nYear, nMonth - 1, 1);
    var firstDate = tmpDate.getDay();
    tmpDate.setDate(tmpDate.getDate() - firstDate);
    firstDate = tmpDate.getDate();

    var temp = 31;
    var color = ["#a5a5a5", "#000000"];
    var display = 0;
    for (var i = 0; i < 6; i++) {
      var tr = document.createElement("tr");
      tr.bgColor = "#ffffff";
      for (var j = 0; j < 7; j++) {
        var td = document.createElement("td");
        td.height = 20;
        td.align = "right";
        td.vAlign = "middle";
        td.innerHTML = firstDate + "&nbsp;";
        if (Math.abs(temp - firstDate) > 15) {
          display = (display + 1) % 2;
        }
        temp = firstDate;
        td.style.color = color[parseInt(display)];
        td.style.padding = "0";

        if (display) {
          if (tmpDate.getDay() == 0) {
            td.style.color = "#ff0000";
          }
          if (tmpDate.getDay() == 6) {
            td.style.color = "#0000ff";
          }

          if (
            date.getFullYear() == nYear &&
            date.getMonth() + 1 == nMonth &&
            date.getDate() == firstDate
          ) {
            td.style.border = "1px solid #ff0000";
          }

          td.style.cursor = "pointer";
          td.title =
            nYear +
            separator +
            dateFormatConversion(nMonth) +
            separator +
            dateFormatConversion(firstDate);
          td.onclick = function (event) {
            doClick(event);
          };
        }
        tr.appendChild(td);
        tmpDate.setDate(tmpDate.getDate() + 1);
        firstDate = tmpDate.getDate();
      }
      trs[trs.length] = tr;
    }
    return trs;
  };
  var getFooter = function () {
    var footerTr = document.createElement("tr");

    var footerTd = document.createElement("td");
    footerTd.colSpan = 7;
    footerTd.height = 20;
    footerTd.align = "center";
    footerTd.vAlign = "middle";
    footerTd.style.padding = "0";
    footerTr.appendChild(footerTd);

    var footerClean = document.createElement("a");
    footerClean.innerHTML = "<b>[초기화]</b>";
    footerClean.style.cursor = "pointer";
    footerClean.onclick = function () {
      self.clean();
    };
    footerTd.appendChild(footerClean);

    var footerDummy = document.createElement("font");
    footerDummy.innerHTML = "&nbsp;&nbsp;&nbsp;";
    footerTd.appendChild(footerDummy);

    var footerClose = document.createElement("a");
    footerClose.innerHTML = "<b>[닫&nbsp;&nbsp;&nbsp;기]</b>";
    footerClose.style.cursor = "pointer";
    footerClose.onclick = function () {
      self.close();
    };
    footerTd.appendChild(footerClose);

    return footerTr;
  };
  this.close = function () {
    cal.style.display = "none";
  };
  this.clean = function () {
    self.close();
  };
  var getAbsolutePos = function (obj) {
    var pos = {
      x: 0,
      y: 0
    };
    if (obj) {
      pos["x"] = obj.offsetLeft;
      pos["y"] = obj.offsetTop;
      if (obj.offsetParent) {
        var parentpos = getAbsolutePos(obj.offsetParent);
        pos["x"] += parentpos.x;
        pos["y"] += parentpos.y;
      }
    }
    return pos;
  };
  var dateFormatConversion = function (date) {
    var str = "";
    if (parseInt(date) < 10) {
      str = "0" + parseInt(date);
    } else {
      str = "" + parseInt(date);
    }
    return str;
  };
  var doOver = function (e) {
    var evt = e || window.event;
    var el = evt.target || evt.srcElement;
    if (el.title.length > 7) {
      el.style.backgroundColor = "#00ff00";
    }
  };
  var doOut = function (e) {
    var evt = e || window.event;
    var el = evt.target || evt.srcElement;
    if (el.title.length > 7) {
      el.style.backgroundColor = "#ffffff";
    }
  };
  var doClick = function (e) {
    var evt = e || window.event;
    var el = evt.target || evt.srcElement;
    if (el.title.length > 7) {
      self.setFullYear(el["title"]);
      if (callBack) {
        callBack(self.toDate());
      }
    }
    self.close();
  };

  var disableSelect = function (e) {
    var omitformtags = ["input", "textarea", "selectBoxObj"];
    omitformtags = omitformtags.join("|");
    if (omitformtags.indexOf(e.target.tagName.toLowerCase()) == -1) {
      return false;
    }
  };
  var reEnable = function () {
    return true;
  };

  // 클래스 생성시 초기화 부분
  if (stringFullDay) {
    this.setFullYear(stringFullDay);
  }
  init();

  /////////////////////////////////////////2012-01-11 달력 함수 추가 ////////////////////////////////
  this.increaseDate = function (number_increase) {
    date.setDate(date.getDate() + number_increase);
  };

  this.setFullYear = function (string_YYYY_MM_DD) {
    var s = string_YYYY_MM_DD.split("-");
    date.setFullYear(Number(s[0]), Number(s[1]) - 1, Number(s[2]));
  };

  this.toDate = function () {
    var time =
      date.getFullYear() +
      "-" +
      numberToString(date.getMonth() + 1) +
      "-" +
      numberToString(date.getDate());
    return time;
  };

  this.toDayNameOfWeek = function () {
    return weekdayName[date.getDay()];
  };

  this.toDayIndexOfWeek = function () {
    return date.getDay();
  };

  function numberToString(nTime, len) {
    if (!len) {
      len = 2;
    }

    nTime = "" + nTime;

    for (var i = nTime.length; i < len; i++) {
      nTime = "0" + nTime;
    }
    return nTime;
  }
}

function SelectBox(nWidth) {
  var self = this;
  var selectBoxObj = null;
  var options = [];
  var isShowOptions = false;
  var timeOut = null;
  var clickEvent = function () {};

  var inputBox = null;
  {
    selectBoxObj = document.createElement("div");
    selectBoxObj.style.width = nWidth + "px";
    selectBoxObj.style.height = "20px";
    selectBoxObj.style.position = "absolute";
    selectBoxObj.style.backgroundColor = "#ffffff";
    selectBoxObj.style.border = "1px solid #000000";

    selectBoxObj.onmouseout = function (event) {
      if (timeOut == null) timeOut = setTimeout(hideOptions, 10);
    };
    selectBoxObj.onmouseover = function (event) {
      if (timeOut != null) clearTimeout(timeOut);
      timeOut = null;
    };

    inputBox = document.createElement("font");
    inputBox.innerHTML = "";
    inputBox.style.left = "0px";
    inputBox.style.top = "0px";
    inputBox.style.width = nWidth - 21 + "px";
    inputBox.style.height = "20px";
    inputBox.color = "#000000";
    inputBox.style.borderBottom = "1px solid #000000";
    inputBox.style.fontSize = "10pt";
    inputBox.style.textAlign = "center";
    inputBox.style.position = "absolute";
    inputBox.onclick = function () {
      if (!isShowOptions) {
        showOptions();
      } else {
        hideOptions();
      }
    };
    selectBoxObj.appendChild(inputBox);

    var dropBtn = document.createElement("font");
    dropBtn.innerHTML = "▼";
    dropBtn.style.left = nWidth - 21 + "px";
    dropBtn.style.top = "0px";
    dropBtn.style.width = "20px";
    dropBtn.style.height = "20px";
    dropBtn.color = "#000000";
    dropBtn.style.backgroundColor = "#b3d9ff";
    dropBtn.style.borderLeft = "1px solid #000000";
    dropBtn.style.fontSize = "10pt";
    dropBtn.style.fontWeight = "bold";
    dropBtn.style.textAlign = "center";
    dropBtn.style.position = "absolute";
    dropBtn.onclick = function () {
      if (!isShowOptions) {
        showOptions();
      } else {
        hideOptions();
      }
    };
    dropBtn.onmouseover = function () {
      dropBtn.style.backgroundColor = "#53a9ff";
    };
    dropBtn.onmouseout = function () {
      dropBtn.style.backgroundColor = "#b3d9ff";
    };
    selectBoxObj.appendChild(dropBtn);
  }
  this.add = function (sValue) {
    option = document.createElement("font");
    option.innerHTML = sValue;
    option.style.left = "0px";
    option.style.top = (options.length + 1) * 20 + "px";
    option.style.width = nWidth + "px";
    option.style.height = "20px";
    option.color = "#000000";
    option.style.fontSize = "10pt";
    option.style.textAlign = "center";
    option.style.fontWeight = "normal";
    option.style.position = "absolute";
    option.style.display = "none";
    inputBox.innerHTML = sValue;
    setEvent(option);
    selectBoxObj.appendChild(option);
    options.push(option);
  };
  this.getInputValue = function () {
    return inputBox.innerHTML;
  };
  this.setInputValue = function (sValue) {
    inputBox.innerHTML = sValue;
  };
  this.append = function (target) {
    target.appendChild(selectBoxObj);
  };
  var showOptions = function () {
    isShowOptions = true;
    for (var i = 0; i < options.length; i++) {
      options[i].style.display = "block";
      if (options[i].innerHTML == inputBox.innerHTML) {
        options[i].style.color = "#ffffff";
        options[i].style.backgroundColor = "#53a9ff";
      }
    }
    selectBoxObj.style.height = (options.length + 1) * 20 + "px";
  };
  var hideOptions = function () {
    isShowOptions = false;
    for (var i = 0; i < options.length; i++) {
      options[i].style.display = "none";
    }
    selectBoxObj.style.height = "20px";
    rollbackOptions();
  };
  this.setClickEvent = function (eEvt) {
    clickEvent = eEvt;
  };
  var actionClickEvent = function () {
    clickEvent();
  };
  var rollbackOptions = function () {
    for (
      var i = Number(inputBox.innerHTML) - 3, j = 1;
      i <= Number(inputBox.innerHTML) + 3;
      i++, j++
    ) {
      options[j].innerHTML = i;
      if (Number(options[j].innerHTML) == Number(inputBox.innerHTML)) {
        options[j].style.color = "#ffffff";
        options[j].style.backgroundColor = "#53a9ff";
      }
    }
  };
  var changeOptions = function (nValue) {
    for (var i = 1; i < options.length - 1; i++) {
      options[i].innerHTML = Number(options[i].innerHTML) + nValue;
      if (Number(options[i].innerHTML) == Number(inputBox.innerHTML)) {
        options[i].style.color = "#ffffff";
        options[i].style.backgroundColor = "#53a9ff";
      }
    }
  };

  var setEvent = function (option) {
    option.onmouseout = function (event) {
      var evt = event || window.event;
      var el = evt.target || evt.srcElement;
      el.style.color = "#000000";
      el.style.backgroundColor = "#ffffff";
    };
    option.onmouseover = function (event) {
      for (var i = 0; i < options.length; i++) {
        options[i].style.color = "#000000";
        options[i].style.backgroundColor = "#ffffff";
      }
      var evt = event || window.event;
      var el = evt.target || evt.srcElement;
      el.style.color = "#ffffff";
      el.style.backgroundColor = "#53a9ff";
      options[0].style.borderTop = "1px solid #000000";
    };
    option.onclick = function (event) {
      var evt = event || window.event;
      var el = evt.target || evt.srcElement;
      if (el.innerHTML == "▲") {
        changeOptions(-7);
      } else if (el.innerHTML == "▼") {
        changeOptions(7);
      } else {
        inputBox.innerHTML = el.innerHTML;
        isShowOptions = false;
        hideOptions();
        actionClickEvent();
      }
    };
  };
}
