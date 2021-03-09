function getJSON(url, headers={}) {
	var xhr = new XMLHttpRequest()	
	xhr.open("GET", url, false);		
	for(let [key, value] of Object.entries(headers)) {
		xhr.setRequestHeader(key, value)
	}		
	xhr.send();
	return JSON.parse(xhr.response);
}
