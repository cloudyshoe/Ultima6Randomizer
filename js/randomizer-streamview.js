STREAMVIEW_PREFIX = 'streamview_';

updateItemsOnLoad();
updateMoonstonesOnLoad();
document.querySelector("#background-color").addEventListener('change', changeBgColorOnClick);
window.addEventListener('storage', updateItemsOnStorage);

function updateItemsOnStorage(e) {
	// Called when another page from the randomizer writes to localStorage
	if (e.key == STREAMVIEW_PREFIX+'tracker_item_moonstonecount') {
		const moonstoneElements = document.querySelectorAll('[data-moonstone-count]');
		for (item of moonstoneElements) {
			item.dataset.moonstoneCount = e.newValue;
		}
		const moonstoneImg = document.querySelector('#moonstonecount_img');
		moonstoneImg.src = `img/moonstonecount_${e.newValue}.png`;
	} else if (e.key.startsWith(STREAMVIEW_PREFIX)) {
		const item = document.querySelector(`#${e.key}`);
		item.dataset.acquired = e.newValue;
	}
}

function updateItemsOnLoad() {
	const items = document.querySelectorAll('[data-acquired]');
	for (item of items) {
		item.dataset.acquired = 'false';
		const localValue = localStorage.getItem(item.id);
		if (localValue) item.dataset.acquired = localValue;
	}
}

function updateMoonstonesOnLoad() {
	const moonstoneElements = document.querySelectorAll('[data-moonstone-count]');
	const moonstoneCount = localStorage.getItem(STREAMVIEW_PREFIX+'tracker_item_moonstonecount');
	if (moonstoneCount != null) {
		for (item of moonstoneElements) {
			item.dataset.moonstoneCount = moonstoneCount;
		}
		const moonstoneImg = document.querySelector('#moonstonecount_img');
		moonstoneImg.src = `img/moonstonecount_${moonstoneCount}.png`;
	}
}

function changeBgColorOnClick(e) {
	changeBgColor(e.target);	
}

function changeBgColor(e) {
	document.body.style.background = e.value;
}
