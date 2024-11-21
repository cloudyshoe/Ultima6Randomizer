const KEY_PREFIX = 'moonorbtracker_';
const orbLocations = document.querySelectorAll('.dropdown-menu a');
const orbCells = document.querySelectorAll('.orb_grid td');
const choice = document.getElementById('choice');
var lastEvent;

window.addEventListener('load', pageInit);

function pageInit() {

	choice.textContent = '';

	for (var i = 0; i < orbLocations.length; i++) {
		orbLocations[i].addEventListener('click', setChoice, false);
	}

	for (var i = 0; i < orbCells.length; i++) {
		orbCells[i].addEventListener('click', setOrbCell, false);
		orbCells[i].addEventListener('contextmenu', undoOrbCell, false);
		orbCells[i].addEventListener('dblclick', clearOrbCell, false);
		orbCells[i].textContent = getValue(orbCells[i].id);
	}

	document.getElementById('reset').addEventListener('click', resetTracker, false);
	document.getElementById('save').addEventListener('click', saveToFile, false);
	document.getElementById('restore').addEventListener('click', restoreFromFile, false);

}

function setValue(key, value) {
	var setKey = KEY_PREFIX + key;
	localStorage.setItem(setKey, value);
}

function getValue(key, value) {
	var getKey = KEY_PREFIX + key;
	return localStorage.getItem(getKey);
}

function setChoice(e) {
	choice.textContent = e.target.textContent;
//	e.target.parentElement.style.display = 'none';
	lastEvent = e;
}

function setOrbCell(e) {
	if (choice.textContent != '' && choice.textContent != e.target.textContent) {
	setValue(e.target.id + '_old', e.target.textContent);
	e.target.textContent = choice.textContent;
	setValue(e.target.id, choice.textContent);
	choice.textContent = '';
	}
}

function undoOrbCell(e) {
	if (e.target.textContent == '') {
		if (getValue(e.target.id + '_old')) {
			e.target.textContent = getValue(e.target.id + '_old');
			setValue(e.target.id, e.target.textContent);
			setValue(e.target.id + '_old', '');
			e.preventDefault();
		} else {
			e.preventDefault();
		}
	} else {
		if (getValue(e.target.id + '_old')) {
			var temp = e.target.textContent;
			e.target.textContent = getValue(e.target.id + '_old');
			setValue(e.target.id + '_old', temp);
			e.preventDefault();
		} else {
			setValue(e.target.id + '_old', e.target.textContent);
			e.target.textContent = '';
			setValue(e.target.id, '');
			e.preventDefault();
		}
	}
}

function clearOrbCell(e) {
	if (choice.textContent == '') {
		if (e.target.textContent != '') {
		setValue(e.target.id + '_old', e.target.textContent);
		e.target.textContent = '';
		setValue(e.target.id, '');
		e.preventDefault();
		}
	}
}

function resetTracker(e) {
	if (confirm('This will clear the tracker and history.\nAre you sure?') == true) {
		var localKeys = Object.keys(localStorage);
		for (key in localKeys) {
			if (localKeys[key].startsWith(KEY_PREFIX)) {
				localStorage.removeItem(localKeys[key]);
			}
		}
		pageInit();
	}
}
