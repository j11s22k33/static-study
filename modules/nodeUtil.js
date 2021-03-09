/**
 * Java ArrayList 구현
 * 
 * new ArrayList( 초기값 배열 )
 * 초기값 배열이 있으면 초기값 배열을 가진 상태로 ArrayList가 만들어 진다
 * 
 * 
 * @author ITVMG by skjang
 * @since 2010.05.17
 */
function ArrayList(arr) {
	var self = this;

	if (!arr) {
		arr = [];
	}

	this.add = function(obj, index) {
		if (index != null) {
			arr.splice(index, 0, obj);
		} else {
			arr.push(obj);
		}
	};

	this.get = function(index) {
		return arr[index];
	};

	this.replace = function(index, obj) {
		return arr.splice(index, 1, obj)[0];
	};

	this.clear = function() {
		arr = [];
	};

	this.remove = function(index) {
		if (index) {
			return arr.splice(index, 1)[0];
		} else {
			return arr.pop();
		}
	};
	this.size = function() {
		return arr.length;
	};

	this.toArray = function() {
		return arr;
	};

	this.contains = function(obj) {
		return self.indexOf(obj) != -1 ? true : false;
	};

	this.indexOf = function(obj) {
		for ( var i = 0; i < self.size(); i++) {
			if (arr[i] == obj) {
				return i;
			}
		}
		return -1;
	};

	function arrayCopy(arr) {
		return arr.concat([]);
	}

	this.copyArrayList = function() {
		var copyArr = arrayCopy(arr);
		return new ArrayList(copyArr);
	};

	this.subList = function(fromIndex, toIndex) {
		var copyArr = arrayCopy(arr);
		var tArr = undefined;
		if (toIndex) {
			tArr = copyArr.slice(fromIndex, toIndex);
		} else {
			tArr = copyArr.slice(fromIndex);
		}
		return new ArrayList(tArr);
	};

	this.toArrayString = function() {
		var s = '[';
		for ( var i = 0; i < arr.length; i++) {
			s += arr[i];
			if (i != arr.length - 1) {
				s += ', ';
			}
		}
		s += ']';
		return s;
	};
}

/**
 * Java HashTable 구현
 * 
 * @author ITVMG by skjang
 * @since 2010.05.17
 */
function HashTable() {
	var tableKey = new ArrayList();
	var tableValue = new ArrayList();

	this.put = function(key, value) {
		var keyIdx = tableKey.indexOf(key);
		if (keyIdx != -1) {
			tableValue.replace(keyIdx, value);
		}else{
			tableKey.add(key);
			tableValue.add(value);
		}
	};

	this.get = function(key) {
		var keyIdx = tableKey.indexOf(key);
		if (keyIdx != -1) {
			return tableValue.get(keyIdx);
		} else {
			return null;
		}
	};

	this.clear = function() {
		tableKey.clear();
		tableValue.clear();
	};

	this.values = function() {
		return tableValue.toArray();
	};

	this.keys = function() {
		return tableKey.toArray();
	};

	this.remove = function(key) {
		var i = tableKey.indexOf(key);
		tableKey.remove(i);
		tableValue.remove(i);
	};

	this.size = function() {
		return tableKey.size();
	};

	this.containsKey = function(key) {
		return tableKey.contains(key);
	};

	this.containsValue = function(value) {
		return tableValue.contains(value);
	};

	this.toJSON = function() {
		var jsonObj = {};
		for ( var i = 0; i < tableKey.size(); i++) {
			jsonObj[tableKey.get(i)] = tableValue.get(i);
		}
		return jsonObj;
	};

	this.toJSONString = function() {
		return JSON.stringify(this.toJSON());
		/*var s = '{';
		for ( var i = 0; i < tableKey.size(); i++) {
			s += '"' + tableKey.get(i) + '":"' + tableValue.get(i) + '"';
			if (i != tableKey.size() - 1) {
				s += ', ';
			}
		}
		s += '}';
		return s;*/
	};
}