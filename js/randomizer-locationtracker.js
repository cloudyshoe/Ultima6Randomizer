const KEY_PREFIX = 'locationtracker_';
const STREAMVIEW_PREFIX = 'streamview_';

pageInit();
window.addEventListener('beforeunload', clearStreamView);

function pageInit() {

	clearStreamView();
	initMoonstoneCounter();
	initCheckboxLocalStorage();
	initShowHideCheckboxes();
	initLocationTypeCheckboxes();
	initEnableAdvancedLocationCheckbox();
	initProgressionItemCheckboxes();
	initNotesArea();
	initResetButton();
	initSaveRestoreClearButtons();
	initColorSchemeButtons();

	const dialogLinks = document.querySelectorAll('[data-dialog-target]');
	for (link of dialogLinks) {
		if (link.dataset.dialogTarget) {
			const dialog = document.getElementById(link.dataset.dialogTarget);
			link.addEventListener('click', (e) => dialog.showModal()); 
		}
		const closestDialog = link.closest("dialog");
		if (closestDialog) {
			link.addEventListener('click', (e) => closestDialog.close());
		}
	}
}

/*
 * Init Functions
 *
 * These run when page is loaded to add event listeners and set values from localStorage if they exist.
*/

function initCheckboxLocalStorage() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]')
	for (checkbox of checkboxes) {
		checkbox.addEventListener('click', setLocalCheckboxStatusOnClick);
		const checkboxStatus = localCheckboxStatus(checkbox);
		if (checkboxStatus) { checkbox.checked = checkboxStatus === 'true'; }
	}
}

function clearStreamView() {
	// Clean up STREAMVIEW_PREFIX keys in localStorage on page load & unload so we don't end up with stale data.
	const localKeys = Object.keys(localStorage)
	for (key of localKeys) {
		if (key.startsWith(STREAMVIEW_PREFIX)) {
			localStorage.removeItem(key);
		}
	}
}

function initMoonstoneCounter() {
	document.getElementById('moonstonecount_inc').addEventListener('click', moonstoneCountInc);
	document.getElementById('moonstonecount_dec').addEventListener('click', moonstoneCountDec);

	const moonstoneCount = document.getElementById('tracker_item_moonstonecount');
	const localMoonstoneCount = localStorage.getItem(KEY_PREFIX+'tracker_item_moonstonecount');

	if (localMoonstoneCount) {
		moonstoneCount.dataset.moonstoneCount = localMoonstoneCount;
		moonstoneCount.textContent = localMoonstoneCount;
		localStorage.setItem(STREAMVIEW_PREFIX+'tracker_item_moonstonecount', localMoonstoneCount);
	}
}

function initShowHideCheckboxes() {
	const toggleCheckboxes = document.querySelectorAll('[data-toggles]');
	for (checkbox of toggleCheckboxes) {
		checkbox.addEventListener('click', toggleSectionOnClick);
		checkbox.dispatchEvent(new Event('click'));
	}
}

function initLocationTypeCheckboxes() {
	const locationCheckboxes = document.querySelectorAll('[data-checkbox-location-type], [data-checkbox-advanced-location-type]');
	for (checkbox of locationCheckboxes) {
		checkbox.addEventListener('click', toggleLocationsOnClick);
		checkbox.dispatchEvent(new Event('click'));
	};
}

function initEnableAdvancedLocationCheckbox() {
	const advancedCheckbox = document.getElementById('locationtype_enable_advanced_locations');
	advancedCheckbox.addEventListener('click', toggleAdvancedLocationSelectionOnClick);
	advancedCheckbox.dispatchEvent(new Event('click'));
}

function initProgressionItemCheckboxes() {
	const dataProvides = document.querySelectorAll('[data-provides]')
	for (checkbox of dataProvides) {
		checkbox.addEventListener('click', toggleItemsOnClick);
		checkbox.addEventListener('click', setStreamViewCheckboxStatusOnClick);
		checkbox.dispatchEvent(new Event('click'));
	};
}

function initNotesArea() {
	const notesArea = document.getElementById('notes_area');
	notesArea.addEventListener('input', setLocalNotesOnChange);
	const notesContent = localNotes(notesArea);
	if (notesContent) { notesArea.value = notesContent; }
}

function initResetButton() {
	document.getElementById('reset').addEventListener('click', resetTracker);
}

function initSaveRestoreClearButtons() {
	document.getElementById('save_okay').addEventListener('click', saveToFile);
	document.getElementById('restore_okay').addEventListener('click', restoreFromFile);
}

function initColorSchemeButtons() {
	document.getElementById('colorscheme_dark').addEventListener('click', setColorSchemeDark);
	document.getElementById('colorscheme_light').addEventListener('click', setColorSchemeLight);
	document.getElementById('colorscheme_system').addEventListener('click', setColorSchemeSystem);
}

/*
 * Event Handlers for Tracker State/Logic
*/

function toggleLocationsOnClick(e) {
	toggleLocations(e.target);
}

function toggleAdvancedLocationSelectionOnClick(e) {
	toggleAdvancedLocationSelection(e.target);
}

function toggleItemsOnClick(e) {
	toggleItems(e.target);
}

function toggleSectionOnClick(e) {
	toggleSection(e.target);
}

function setLocalNotesOnChange(e) {
	setLocalNotes(e.target);
}

function setLocalCheckboxStatusOnClick(e) {
	setLocalCheckboxStatus(e.target);
}

function setStreamViewCheckboxStatusOnClick(e) {
	setStreamViewCheckboxStatus(e.target);
}


/*
 * Tracker State/Logic
 *
 * Use locationtype & progression item checkboxes to determine which locations are available
*/

function checkAreas() {
	// Check if a location area should be displayed

	// show if at least one child .item_location without 'hidden = true'
    toShow = document.querySelectorAll(`.location_group:has(.item_location:not([hidden]))`);
	for (e of toShow) {
    	e.hidden = false;
	}

	// hide if no child .item_location without 'hidden = true' (all are hidden)
    toHide = document.querySelectorAll(`.location_group:not(:has(.item_location:not([hidden])))`);
	for (e of toHide) {
    	e.hidden = true;
	}
}

function checkRequirements(loc) {
	// Check if all [data-requires] items for a location have been met.
	// This is called when a checkbox with [data-provides] is checked.
	const reqList = loc.dataset.requires.split(" ");
	const reqCount = reqList.length
	if (reqCount == 1) { return true; }

	for (req of reqList) {
		if (!document.querySelector(`[data-provides="${req}"]:checked`)) {
			return false;
		}
	}

	return true;
}

function toggleLocations(e) {
	const advancedEnabled = document.getElementById('locationtype_enable_advanced_locations').checked;
	const hasAdvancedLocations = Boolean(e.dataset.hasAdvancedLocations);
	const isAdvancedLocation = Boolean(e.dataset.checkboxAdvancedLocationType);
	const checked = e.checked

	if (!advancedEnabled || (!isAdvancedLocation && !hasAdvancedLocations)) {
		toggleBasicLocation(e);
	} else if (advancedEnabled && isAdvancedLocation) {
		toggleAdvancedLocation(e);
	} else if (advancedEnabled && hasAdvancedLocations) {
		toggleAdvancedArea(e);
	}

	checkAreas();
}

function toggleBasicLocation(e) {
	const locationType = e.dataset.checkboxLocationType;
	const locationList = document.querySelectorAll(`.item_location[data-item-location-type="${locationType}"]`);

	for (loc of locationList) {
		loc.hidden = !e.checked;
	}
}

function toggleAdvancedLocation(e) {
	const locationType = e.dataset.checkboxAdvancedLocationType;
	const locationList = document.querySelectorAll(`.item_location[data-item-advanced-location="${locationType}"]`);

	const basicType = e.dataset.checkboxBasicLocationType;
	const basicChecked = document.querySelector(`[data-checkbox-location-type="${basicType}"]`).checked;

	const hiddenVal = !(basicChecked && e.checked)

	for (loc of locationList) {
		loc.hidden = hiddenVal;
	}
}

function toggleAdvancedArea(e) {
	const locationType = e.dataset.checkboxLocationType;

	const basicType = e.dataset.checkboxLocationType;
	const basicLabelSelector = `[data-checkbox-basic-location-type="${basicType}"] ~ label`;
	const basicLabelList = document.querySelectorAll(basicLabelSelector);

	if (e.checked) {
		const advancedSelector = `[data-checkbox-location-type="${locationType}"] ~ .locationtype_advanced [data-checkbox-advanced-location-type]`
		const advancedLocations = document.querySelectorAll(advancedSelector);

		for (label of basicLabelList) {
			label.dataset.available = "true";
		}

		for (loc of advancedLocations) {
			toggleAdvancedLocation(loc);
		}
	} else {
		const locationListSelector = `.item_location[data-item-location-type="${locationType}"]`;
		const locationList = document.querySelectorAll(locationListSelector);

		for (label of basicLabelList) {
			label.dataset.available = "false";
		}

		for (loc of locationList) {
			loc.hidden = true;
		}
	}
}

function toggleAdvancedLocationSelection(e) {
	const advDivs = document.querySelectorAll('.locationtype_advanced');
	let checkboxSelector = '[data-checkbox-location-type]';

	if (e.checked) { checkboxSelector  += ', [data-checkbox-advanced-location-type]'; }

	locationCheckboxes = document.querySelectorAll(checkboxSelector);

	for (div of advDivs) {
		div.hidden = !e.checked;
	}

	for (checkbox of locationCheckboxes) {
		checkbox.dispatchEvent(new Event('click'));
	}
}

function toggleItems(e) {
	const itemProvides = e.dataset.provides;
	const locationList = document.querySelectorAll(`.item_location label[data-requires~="${itemProvides}"]`);

	for (loc of locationList) {
		loc.dataset.available = e.checked && checkRequirements(loc);
	}
}

function toggleSection(e) {
	const sectionClasses = e.dataset.toggles.split(" ");
	for (sectionClass of sectionClasses) {
		const section = document.querySelectorAll(`.${sectionClass}`);
		const label = document.querySelector(`label[for="${sectionClass}_toggle"] small`);

		const displayVal = e.checked ? '' : 'none';
		const labelVal = e.checked ? '[hide]' : '[show]';

		for (sec of section) {
			sec.style.display = displayVal;
		}
		if (label) { label.textContent = labelVal; }
	}
}

function moonstoneCountInc() {
	const moonstoneCountEl = document.getElementById('tracker_item_moonstonecount');
	const moonstoneCount = parseInt(moonstoneCountEl.dataset.moonstoneCount);
	const newCount = moonstoneCount+1 > 8 ? 8 : moonstoneCount+1;
	moonstoneCountEl.dataset.moonstoneCount = newCount;
	moonstoneCountEl.textContent = newCount;
	setLocalMoonstoneCount(moonstoneCountEl.id, newCount);
	setStreamViewMoonstoneCount(moonstoneCountEl.id, newCount);
}

function moonstoneCountDec() {
	const moonstoneCountEl = document.getElementById('tracker_item_moonstonecount');
	const moonstoneCount = parseInt(moonstoneCountEl.dataset.moonstoneCount);
	const newCount = moonstoneCount-1 < 0 ? 0 : moonstoneCount-1;
	moonstoneCountEl.dataset.moonstoneCount = newCount;
	moonstoneCountEl.textContent = newCount;
	setLocalMoonstoneCount(moonstoneCountEl.id, newCount);
	setStreamViewMoonstoneCount(moonstoneCountEl.id, newCount);
}



/*
 * Settings State/Logic
*/

function setColorSchemeDark() {
	setColorScheme('dark');
}

function setColorSchemeLight() {
	setColorScheme('light');
}

function setColorSchemeSystem() {
	setColorScheme('system');
}

function setColorScheme(colorScheme) {
	document.documentElement.dataset.colorScheme = colorScheme;
	localStorage.setItem('color_scheme_locationtracker', colorScheme);
	if (colorScheme == 'system') { localStorage.removeItem('color_scheme_locationtracker'); }
}

function localColorScheme() {
	return localStorage.getItem('color_scheme_locationtracker');
}

/*
 * Local/Local Storage
 *
 * Persist tracker state in the current local with KEY_PREFIX (persists through reloads and tab close/reopen).
 *
 * Use localStorage with STREAMVIEW_PREFIX to share state with stream view. Stream view has eventListener when localStorage is updated.
 *
 * LocalStorage to persist across locals lives in randomizer-trackerstorage.
*/

function resetTracker() {
	localKeys = Object.keys(localStorage);
	for (key of localKeys) {
		if (key.startsWith(KEY_PREFIX)) {
			localStorage.removeItem(key);
		}
	}
	location.reload();
}

function setLocalNotes(e) {
	localStorage.setItem(KEY_PREFIX+e.id, e.value);
}

function localNotes(e) {
	return localStorage.getItem(KEY_PREFIX+e.id);
}


function setLocalCheckboxStatus(e) {
	localStorage.setItem(KEY_PREFIX+e.id, e.checked);	
}

function localCheckboxStatus(e) {
	return localStorage.getItem(KEY_PREFIX+e.id);
}

function setLocalMoonstoneCount(id, newCount) {
	localStorage.setItem(KEY_PREFIX+id,newCount);
}

function setStreamViewMoonstoneCount(id, newCount) {
	localStorage.setItem(STREAMVIEW_PREFIX+id,newCount);
}

function setStreamViewCheckboxStatus(e) {
	localStorage.setItem(STREAMVIEW_PREFIX+e.id, e.checked);
}
