self.onmessage = function(e) {
	var sData = e.data["serverData"];
	var dData = e.data["dbData"];

	var updateData = serverDataUpdate(sData, dData);
	self.postMessage(updateData);
};

function serverDataUpdate(sData, dData) {
	var sArray = sData.split("\f"); //♀
	var dArray = dData.split("\f"); //♀
	var vodMenuVersion = 0;

	for ( var i = 0; i < sArray.length; i++) {
		if (trim(sArray[i]).length > 0) {
			var token = sArray[i].split("\16"); //♬
			var version = token[1];
			var status = token[2];

			vodMenuVersion = Math.max(Number(vodMenuVersion), Number(version));

			switch (status) {
			case "11": //update
				//dArray에서 id에 해당되는 객체를 찾아 sArray[i]로 교체한다
				var id = sArray[i].split("|")[1];
				if (id && id.length > 0) {
					_update(dArray, id, sArray[i]);
				}
				break;
			case "444": //delete
				//dArray에서 id에 해당되는 객체를 찾아 삭제한다
				var id = sArray[i].split("|")[1];
				if (id && id.length > 0) {
					_delete(dArray, id);
				}
				break;
			case "12": //insert
				var prevId = token[3];
				//dArray에서 prevId에 해당되는 객체를 찾고, 찾은 객채 뒤에  sArray[i]를 삽입한다
				if (prevId && prevId.length > 0) {
					_insert(dArray, prevId, sArray[i]);
				}
				break;
			}
		}
	}

	dData = dArrayMerge(dArray);
	return {
		"updateData" : dData,
		"vodMenuVersion" : vodMenuVersion
	};
}
function dArrayMerge(dArray) {
	return dArray.join("\f");//♀
}
function _update(dArray, id, s) {
	var idx = indexOf(dArray, id);
	dArray.splice(idx, 1, s);
}
function _delete(dArray, id) {
	var idx = indexOf(dArray, id);
	dArray.splice(idx, 1);
}
function _insert(dArray, prevId, s) {
	var idx = indexOf(dArray, prevId);
	if (prevId) {
		if (idx + 1 != dArray.length) {
			dArray.splice(idx + 1, 0, s); // idx바로 뒤에 (idx+1)뒤가 아니다
		} else {
			dArray.push(s); //맨 뒤에
		}
	} else {
		dArray.splice(0, 0, s); // 맨 앞에
	}
}
//ID가 val idx 찾아 반환
function indexOf(array, val) {
	for ( var i = 0; i < array.length; i++) {
		var id = array[i].split("|")[1]; //ID
		if (id == val) {
			return i;
		}
	}
}
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/gi, "");
}