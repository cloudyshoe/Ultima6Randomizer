function saveToFile() {
	const toFile = {};
	const localEntries = Object.entries(localStorage);
	
	for ([key, value] of localEntries) {
		if (key.startsWith(KEY_PREFIX)) {
			toFile[key] = value;
		}
	}

	const jsonBlob = new Blob([JSON.stringify(toFile)], { type:"application/json;charset=utf-8" });
	const url = window.URL.createObjectURL(jsonBlob);
	const a = document.createElement('a');
	a.href = url;
	const date = new Date;
	const timestamp = `${date.getFullYear()}` + "-" +
		`${date.getMonth()+1}`.padStart(2,'0') + "-" +
		`${date.getDay()}`.padStart(2,'0') + "-" +
		`${date.getHours()}`.padStart(2,'0') + "-" +
		`${date.getMinutes()}`.padStart(2,'0') + "-" +
		`${date.getSeconds()}`.padStart(2,'0');
	a.download = `u6r_${KEY_PREFIX}_state_${timestamp}.json`;
	a.click();
}

async function restoreFromFile() {
	//const importFile = document.getElementById('importFile');
	const importFile = document.createElement('input');
	importFile.id = 'importFile';
	importFile.type = "file";
	importFile.accept = ".json";
	importFile.hidden = true;
	importFile.addEventListener('change', parseDataFromFile);
	document.body.append(importFile);
	importFile.click();
}

async function parseDataFromFile() {

	const importFiles = document.getElementById('importFile');
	if (importFiles.files.length != 1) {
		return;
	}

	console.log('We have ' + importFiles.files.length + ' files');
	const fileText = await importFiles.files[0].text();
	let jsonData;

	try {
		jsonData = JSON.parse(fileText);
	} catch {
		alert('Cannot parse file');
		return;
	}


	if (!Object.keys(jsonData).some(e => e.startsWith(KEY_PREFIX))) {
		alert('No tracker data in file');
		return;
	}

	const localKeys = Object.keys(localStorage);
	for (key of localKeys) {
		if (key.startsWith(KEY_PREFIX)) {
			localStorage.removeItem(key);
		
		}
	}

	const jsonEntries = Object.entries(jsonData);
	for ([key, value] of jsonEntries) {
		if (key.startsWith(KEY_PREFIX)) {
			localStorage.setItem(key, value);
		}
	}

	location.reload();
}
