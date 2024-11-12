function saveToLocalStorage() {
	if (confirm('Do you want to save the current tracker state?\nThis will overwrite any previously saved tracker states.') == true) {

		if (localStorage.getItem(KEY_PREFIX)) {
			localStorage.removeItem(KEY_PREFIX);
		}

		const localEntries = Object.entries(localStorage);
		const toLocal = {};
		toLocal[KEY_PREFIX] = {};

		for ([key,value] of localEntries) {
			if (key.startsWith(KEY_PREFIX)) toLocal[KEY_PREFIX][key] = value;
		}

		localStorage.setItem(KEY_PREFIX, JSON.stringify(toLocal));
	}
}


function restoreFromLocalStorage() {
	if (localStorage.getItem(KEY_PREFIX)) {
		if (confirm('Do you want to restore the saved tracker state?\nThis will overwrite the existing state.') == true) {
			var localEntries = Object.entries(localStorage);
			for ([key,value] of localEntries) {
				if (key.startsWith(KEY_PREFIX)) {
					localStorage.removeItem(key);
				}
			}

			var localJSON = JSON.parse(localStorage.getItem(KEY_PREFIX));
			var localEntries = Object.entries(localJSON[KEY_PREFIX]);
			for ([key,value] of localEntries) {
				localStorage.setItem(key, value);
			}
			location.reload();
		}
	} else {
		alert('No saved data to restore.');
	}
}


function clearLocalStorage() {
	if (localStorage.getItem(KEY_PREFIX) &&
		confirm('Do you want to clear the saved tracker state?\nThis will not affect the current tracker state.') == true) {
		localStorage.removeItem(KEY_PREFIX);
	}
}

function toggleStorageOptions() {
	if (document.querySelector('.local_storage').style.display == 'none') {
		document.getElementById('toggle_local_storage').textContent = '[Hide Save Options]';
		document.getElementById('toggle_local_storage').title = 'Hide options to Save/Load/Restore tracker state';
		var buttons = document.getElementsByClassName('local_storage');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].style.display = '';
		}
	} else {
		document.getElementById('toggle_local_storage').textContent = '[Show Save Options]';
		document.getElementById('toggle_local_storage').title = 'Show options to Save/Load/Restore tracker state';
		var buttons = document.getElementsByClassName('local_storage');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].style.display = 'none';
		}
	}
}

function saveToFile() {
	if (confirm('Do you want to save the current tracker state to a file?') == true) {
		const toFile = {};
		const localEntries = Object.entries(localStorage);
		
		for ([key, value] of localEntries) {
			if (key.startsWith(KEY_PREFIX)) {
				toFile[key] = value;
			}
		}

		console.log(toFile);

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
}

async function restoreFromFile() {
	if (confirm('Do you want to restore a saved tracker state from a file?\nThis will overwrite the existing state.') == true) {
		const options = {
			types: [
				{
					description: "json",
					accept: {
						"application/json": [".json"],
					},
				},
			],
			multiple: false,
		};

		let fileHandle;

		try {
			[fileHandle] =  await showOpenFilePicker(options);
		} catch {
			return;
		}

		const file = await fileHandle.getFile();
		if (!file) return;
		const fileText = await file.text();

		let jsonFromFile;

		try {
			jsonFromFile = JSON.parse(fileText);
		} catch {
			alert('Could not parse file');
			return;
		}

		if (!Object.keys(jsonFromFile).some(e => e.startsWith(KEY_PREFIX))) {
			alert('No tracker data in file');
			return;
		}

		const localKeys = Object.keys(localStorage);
		for (key of localKeys) {
			if (key.startsWith(KEY_PREFIX)) {
				localStorage.removeItem(key);
			
			}
		}

		const jsonEntries = Object.entries(jsonFromFile);
		for ([key, value] of jsonEntries) {
			if (key.startsWith(KEY_PREFIX)) {
				localStorage.setItem(key, value);
			}
		}

		location.reload();
	}
}
