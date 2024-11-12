const colorSchemeStatus = localStorage.getItem('color_scheme_locationtracker');
if (colorSchemeStatus) {
	document.documentElement.dataset.colorScheme = colorSchemeStatus;
}
