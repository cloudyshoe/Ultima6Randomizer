const TEXT_COLOR_OFF = "rgb(224, 192, 192)";
const TEXT_COLOR_ON = "rgb(51, 51, 51)";
const KEY_PREFIX = 'npctracker_';
const NPC_SELECTS = document.getElementsByTagName('select');
const NPC_TYPE_CHECKBOXES = document.querySelectorAll('input[type=checkbox]');

function pageInit()
{
	initCheckboxes();
	initSelects();

	document.getElementById('reset').addEventListener('click', resetTracker, false);
	document.getElementById('save').addEventListener('click', saveToFile, false);
	document.getElementById('restore').addEventListener('click', restoreFromFile, false);
}

function initCheckboxes() {
    toggleNPCTypeDisplayPropOnClick("#npctracker_dialogrewards", "dialogrewards_npc");
    toggleNPCTypeDisplayPropOnClick("#npctracker_treasuremap", "treasuremap_npc");
    toggleNPCTypeDisplayPropOnClick("#npctracker_party", "joinablepartymembers_npc");
	toggleNPCTypeDisplayPropOnClick("#npctracker_otherimportant", "otherimportant_npc");
	toggleNPCTypeDisplayPropOnClick("#npctracker_mages", "mages_npc");
	toggleNPCTypeDisplayPropOnClick("#npctracker_shipwrights", "shipwrights_npc");
	toggleNPCTypeDisplayPropOnClick("#npctracker_shops", "shops_npc");
	toggleNPCTypeDisplayPropOnClick("#npctracker_smiths", "smiths_npc");
    toggleNPCTypeDisplayPropOnClick("#npctracker_healers", "healers_npc");
	toggleNPCTypeDisplayPropOnClick("#npctracker_inns", "inns_npc");
    toggleNPCTypeDisplayPropOnClick("#npctracker_other", "other_npc");

	const checkboxes = document.querySelectorAll('input[type=checkbox]');
	
	for (checkbox of checkboxes) {
		checkbox.addEventListener('click', saveValueCheckbox, false);
		if (typeof getValueCheckbox(checkbox.id) != 'undefined') {
			checkbox.checked = getValueCheckbox(checkbox.id);
		} else {
			checkbox.checked = checkbox.defaultChecked;
		}
		checkbox.dispatchEvent(new Event('click'));
	}

}

function initSelects() {
	const selects = document.getElementsByTagName('select');

	for (select of selects) {
		select.addEventListener('input', saveValueSelect, false);
		if (getValueSelect(select.id)) {
			select.value = getValueSelect(select.id);
		} else {
			select.value = '0';
		}
	}
}

function setValueCheckbox(key, value) {
	var setKey = KEY_PREFIX + key;
	localStorage.setItem(setKey, value);
}

function getValueCheckbox(key, value) {
	var getKey = KEY_PREFIX + key;
	newValue = localStorage.getItem(getKey);
	if (newValue == 'true') {
		return true;
	} else if (newValue == 'false') {
		return false;
	}
}

function saveValueCheckbox(e) {
	var checkboxId = e.target.id;
	var checkboxValue = e.target.checked;
	setValueCheckbox(checkboxId, checkboxValue);
}

function setValueSelect(key, value) {
	var setKey = KEY_PREFIX + key;
	localStorage.setItem(setKey, value);
}

function getValueSelect(key, value) {
	var getKey = KEY_PREFIX + key;
	return localStorage.getItem(getKey);
}

function saveValueSelect(e) {
	var selectId = e.target.id;
	var selectValue = e.target.value;
	setValueSelect(selectId, selectValue);
}

$( window ).on( "load", pageInit );

// $(document).ready(function()
// {
//     toggleNPCTypeDisplayPropOnClick("#npctracker_dialogrewards", "dialogrewards_npc");
//     toggleNPCTypeDisplayPropOnClick("#npctracker_treasuremap", "treasuremap_npc");
//     toggleNPCTypeDisplayPropOnClick("#npctracker_party", "joinablepartymembers_npc");
// 	toggleNPCTypeDisplayPropOnClick("#npctracker_otherimportant", "otherimportant_npc");
// 	toggleNPCTypeDisplayPropOnClick("#npctracker_mages", "mages_npc");
// 	toggleNPCTypeDisplayPropOnClick("#npctracker_shipwrights", "shipwrights_npc");
// 	toggleNPCTypeDisplayPropOnClick("#npctracker_shops", "shops_npc");
// 	toggleNPCTypeDisplayPropOnClick("#npctracker_smiths", "smiths_npc");
//     toggleNPCTypeDisplayPropOnClick("#npctracker_healers", "healers_npc");
// 	toggleNPCTypeDisplayPropOnClick("#npctracker_inns", "inns_npc");
//     toggleNPCTypeDisplayPropOnClick("#npctracker_other", "other_npc");
// });

function setClassToColor(inClass, inColor)
{
    var all = document.getElementsByClassName(inClass);
    for (var i = 0; i < all.length; i++)
    {
        all[i].style.color = inColor;
    }
}

function setClassDisplayProp(inClass, inProp)
{
    var all = document.getElementsByClassName(inClass);
    for (var i = 0; i < all.length; i++)
    {
        all[i].style.display = inProp;
    }
}

function toggleNPCTypeDisplayPropOnClick(inClickTarget, inNPCType)
{
    $(inClickTarget).click(function()
    {
        toggleNPCTypeDisplayProp(inClickTarget, inNPCType);
    });
}

function toggleNPCTypeDisplayProp(inClickTarget, inNPCType)
{
    var npcs = document.querySelectorAll('div[data-npc-type='+inNPCType+']');
    for (npc of npcs)
    {
		if (!$(inClickTarget).is(':checked')) {
			//npc.style.display = "none";
			npc.hidden = true;
		} else {
			//npc.style.display = "";
			npc.hidden = false;
		}
	}
    //checkHiddenElements(inClass, inLocationSet);
	checkAreas();
}

function checkAreas() {
	// Check if a location area should be displayed

	// show if at least one child .item_location without 'hidden = true'
    toShow = document.querySelectorAll(`.npc_group:has(.input-group:not([hidden]))`);
	for (e of toShow) {
    	e.hidden = false;
	}

	// hide if no child .item_location without 'hidden = true' (all are hidden)
    toHide = document.querySelectorAll(`.npc_group:not(:has(.input-group:not([hidden])))`);
	for (e of toHide) {
    	e.hidden = true;
	}
}


function checkHiddenElements(inItemClass, inLocationSet)
{
    var all = document.getElementsByClassName(inLocationSet);
    for (var i = 0; i < all.length; i++)
    {
        var inputElements = all[i].getElementsByTagName('div');
        var totalInputElements = inputElements.length;
        var totalHiddenElements = 0;
        
        for (var j = 0; j < inputElements.length; j++)
        {
            if(inputElements[j].style.display == "none")
            {
                totalHiddenElements += 1;
            }
        }

        if(totalInputElements == totalHiddenElements)
        {
            all[i].style.display = "none";
        }
        else
        {
            all[i].style.display = "";
        }
    }
}

function resetTracker() {
	if (confirm('Are you sure you want to reset the tracker?') == true) {
		for (var i = 0; i < NPC_SELECTS.length; i++) {
			localStorage.removeItem(KEY_PREFIX + NPC_SELECTS[i].id);
		}
		for (var i = 0; i < NPC_TYPE_CHECKBOXES.length; i++) {
			localStorage.removeItem(KEY_PREFIX + NPC_TYPE_CHECKBOXES[i].id);
		}
		pageInit();
	}
}
