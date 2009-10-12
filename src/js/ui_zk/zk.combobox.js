/**
 * ComboBox
 * 
 * @param ops
 * @configbegin
 * @to:element the combobox to append to
 * @width:the width of the combobox
 * @height:the height of the combobox
 * @imageable:is this combobox is with item
 * @dropsize:the size of items that the drop will show
 * @colorHbg:highlight background color of the dropdown list item
 * @colorBg:the background of the dropdown item
 * @colorH:the hight font color of the dropdown item
 * @colorF:the font color of the dropdown item
 * @configend
 * @require [base],zk.selectitem.js
 * @author Joker
 */
zk.ComboBox = function(ops) {
	var combo = this;
	var isIE = zk.browser.msie;
	var edit;
	var btn;
	var dropdown;
	var toptable;
	var toptr;
	var topimg;
	var blIsbtnclick;
	var blIsSearchClick;
	var btntxt;
	var divdrop;
	var dropheight;
	var dropwidth;
	var searchTr;
	var searchTxt;
	var searchTb;
	var allitems = new Array();

	var MAXTEXTLENGTH = 10;
	var COLOR_DROP_BG_HOV = ops.colorHbg?ops.colorHbg:"highlight";
	var COLOR_DROP_BG = ops.colorBg?ops.colorBg:"white";
	var COLOR_DROP_HOV = ops.colorH?ops.colorH:"highlighttext";
	var COLOR_DROP = ops.colorF?ops.colorF:"black";
	var TAGSPACE = "&nbsp;";
	var SIZE_DROP = !ops.dropsize ? 10 : ops.dropsize;
	var SIZE_COLUMN = 2;
	var WIDTH_BTN = 20;
	var WIDTH_EDT = 0;
	var WIDTH_CELL_IMG = 17;
	var WIDTH_DROP_MAX = 500;
	var HEIGHT = 18;
	var HEIGHT_IMG = 14;
	var HEIGHT_MAX_DROP = SIZE_DROP * HEIGHT;

	var _adjust = function() {
		combo.setWidth(ops.width);
		combo.setHeight(ops.height);
	};

	var _getItemHeight = function() {
		return combo.height;
	};

	var _reajuitems = function() {
		var item;
		var row;
		var j;
		var count;

		j = 0;
		count = allitems.length;
		for (var i = 0; i < count; i++) {
			item = allitems[i].key;
			row = allitems[i].value;
			if ("none" != row.style.display) {
				j++;
				_renderItem(allitems[i]);
				row.cells[1].style.width = combo.width
						- (combo.imageable ? WIDTH_CELL_IMG : 0);
			}
		}
	};

	var _refreshdropitem = function() {
		var count;
		var row;

		count = allitems.length;
		for (var i = 0; i < count; i++) {
			row = allitems[i].value;
			row.style.display = "block";
		}
		dropdown.style.display = "block";
		_reajuitems();
	};

	var _adjustedit = function() {
		var ew;

		if (combo.imageable && topimg && topimg.style.display != "none") {
			ew = combo.width - (topimg.offsetWidth + WIDTH_BTN);
		} else {
			ew = combo.width - WIDTH_BTN;
		}
		edit.style.width = Math.max(ew - 5, 0);
	};
	var _adjustdrop = function() {
		var ow, oh;

		ow = divdrop.offsetWidth;
		oh = divdrop.offsetHeight;
		dropwidth = ow;
		dropheight = oh;

		dropdown.style.width = dropwidth = combo.width;

		_refreshdropitem();

		if (oh > HEIGHT_MAX_DROP) {
			if (isIE) {
				dropheight = HEIGHT_MAX_DROP;
				divdrop.style.height = HEIGHT_MAX_DROP;
				divdrop.style.overflowY = "scroll";
			} else {
				dropheight = HEIGHT_MAX_DROP;
				divdrop.style.height = HEIGHT_MAX_DROP;
				divdrop.style.overflowX = "hidden";
				divdrop.style.overflowY = "scroll";
			}
		}
		searchTb.style.width = dropwidth;
		searchTxt.style.width = dropwidth - 7;
	};

	var _setdropstyle = function(argRow) {
		var cells = argRow.cells;

		if (combo.imageable) {
			zk.addCss(cells[0], 'zk_combobox_cell_drop_img');
		}
	};

	var _setStyle = function() {
		zk.addCss(dropdown, 'zk_combobox_table_drop');
		zk.addCss(divdrop, 'zk_combobox_drop_div');
		zk.addCss(toptable, 'zk_combobox_table_top');
		zk.addCss(searchTxt, 'zk_combobox_text_search');
	};

	var _renderItem = function(argkvItem) {
		var row, argItem;
		var icon;
		var txt;

		row = argkvItem.value;
		argItem = argkvItem.key;
		row.title = argItem.text;
		if (combo.imageable && !row.cells[0].childNodes[0]) {
			if (argItem.icon || argItem.iconCls) {
				icon = zk.cr("div");
				icon.style.backgroundRepeat = 'no-repeat';
				icon.style.height = Math.min(combo.height, HEIGHT_IMG);
				row.cells[0].appendChild(icon);
				if (argItem.icon) {
					icon.style.backgroundImage = 'url(' + argItem.icon + ')';
				} else if (argItem.iconCls) {
					zk.addCss(icon, argItem.iconCls);
				}
			} else {
				row.cells[0].innerHTML = TAGSPACE;
			}
		}
		row.style.height = row.cells[1].style.height = row.cells[0].style.height = combo.height;
		txt = argItem.text.toString();
		if (txt && txt.split(STRING_EMPTY).length > MAXTEXTLENGTH) {
			txt = txt.substring(0, MAXTEXTLENGTH - 1) + "..."
		}
		row.cells[1].innerHTML = txt;
		row.cells[1].style.width = combo.width
				- (combo.imageable ? WIDTH_CELL_IMG : 0);
	};

	var _refreshItem = function() {
		var kitem = combo.selectItem;
		var kvitem;
		var row;

		if (!kitem) {
			return;
		}
		kitem.text = edit.value;
		kvitem = allitems.get(kitem);
		_renderItem(kvitem);
	};

	var _iniTr = function() {

		if (!edit) {
			edit = document.createElement("input");
			edit.type = "text";
		}

		if (!btn) {
			btn = zk.cr("button");
			zk.addCss(btn, "ui-icon ui-icon-carat-1-s");
			btn.innerHTML = "&nbsp;";
		}

		toptr.insertCell(-1);
		toptr.insertCell(-1);
		toptr.insertCell(-1);
		if (combo.imageable) {
			topimg = zk.cr('div');

			toptr.cells[0].appendChild(topimg);
		}
		toptr.cells[1].appendChild(edit);
		toptr.cells[2].appendChild(btn);
		toptr.cells[2].align = "right";
		toptr.cells[0].valign = toptr.cells[1].valign = toptr.cells[2].valign = "center";

		zk.addCss(edit, 'zk_combobox_input_text');
		zk.addCss(btn, 'zk_combobox_btn');
		zk.addCss(toptr.cells[0], 'zk_combobox_cell_img');
		zk.addCss(toptr.cells[1], 'zk_combobox_cell_edt');
		zk.addCss(toptr.cells[2], 'zk_combobox_cell_btn');
		if (topimg) {
			topimg.style.display = "none";
		}
	}

	var _create = function() {
		var cellhr;

		dropdown = zk.cr("table");
		searchTb = zk.cr("table");
		// search
		searchTr = searchTb.insertRow(-1);
		searchTr.insertCell(-1);
		searchTxt = zk.cr("input");
		searchTxt.type = "text";
		searchTr.cells[0].appendChild(searchTxt);

		divdrop = zk.cr("div");

		divdrop.style.display = "none";
		divdrop.appendChild(searchTb);
		divdrop.appendChild(dropdown);

		toptable = zk.cr("table");
		toptr = toptable.insertRow(-1);

		_iniTr();

		document.body.appendChild(divdrop);
	};

	var showDropDiv = function() {
		divdrop.style.display = "block";
		divdrop.style.left = zk.getPixLeft(toptable);
		divdrop.style.top = zk.getPixTop(toptable) + combo.height + 7;		
	};
	var ev_btnmousedown = function() {
		if (!combo.enable) {
			return;
		}

		searchTxt.value = STRING_EMPTY;
		if (divdrop.style.display == "block") {
			blIsbtnclick = true;
			divdrop.style.display = "none";
			return false;
		}

		_refreshSearchTb();
		blIsbtnclick = true;
		showDropDiv();
		zk.fire(combo,'dropdown');
		_adjustdrop();

		return false;
	};

	var ev_edtblur = function() {
		zk.fire(combo,'editfinished');
	};

	var ev_drmovr = function(argItems) {
		var cells = argItems.value.cells;

		argItems.value.style.backgroundColor = COLOR_DROP_BG_HOV;
		// cells[1].style.backgroundColor = COLOR_DROP_BG_HOV;
		cells[1].style.color = COLOR_DROP_HOV;
	};

	var ev_drmout = function(argItems) {
		var cells = argItems.value.cells;

		argItems.value.style.backgroundColor = COLOR_DROP_BG;
		// cells[1].style.backgroundColor = COLOR_DROP_BG;
		cells[1].style.color = COLOR_DROP;
	};

	var ev_drclick = function(argItems) {
		var kitem = argItems.key;
		var vitem = argItems.value;

		combo.setSelectItem(kitem);
		divdrop.style.display = "none";
		edit.blur();
	};

	var search = function(txtsearch) {
		var count;
		var item;
		var row;
		var flag;

		flag = false;
		count = allitems.length;
		if (txtsearch == STRING_EMPTY) {
			_refreshdropitem();
			// _reajuitems();
			dropdown.style.display = "block";

			return;
		}

		for (var i = 0; i < count; i++) {
			item = allitems[i].key;
			row = allitems[i].value;
			if (0 != item.text.indexOf(txtsearch)) {
				row.style.display = "none";
			} else {
				flag = true;
				row.style.display = "block";
				// row.cells[1].style.width = combo.width -
				// (combo.imageable?WIDTH_CELL_IMG:0);
			}
		}

		_reajuitems();
		if (!flag) {
			dropdown.style.display = "none";
		} else {
			dropdown.style.display = "block";
		}
	};

	var _inievent = function() {
		btn.onmousedown = ev_btnmousedown;
		btn.onclick = function() {
			return false;
		};
		edit.onclick = function() {
			if (!combo.editable) {
				edit.blur();

				return false;
			}
		};
		edit.onblur = ev_edtblur;
		zk.on(edit, "keyup", function(e) {
					if (13 == e.keyCode) {
						ev_edtblur(e);

						return;
					}
					if (!combo.searchable) {
						return;
					}
					_refreshSearchTb();
					search(edit.value);
					showDropDiv();
				});
		searchTr.onclick = function() {
			blIsSearchClick = true;
		};
		searchTxt.onkeyup = function() {
			search(searchTxt.value);
		};

		zk.on(document, "click", function() {
					if (blIsSearchClick) {
						blIsSearchClick = false;
					} else {
						if (!blIsbtnclick) {
							divdrop.style.display = "none";
						} else {
							blIsbtnclick = false;
						}
					}
				});
	};

	var _refreshSearchTb = function() {
		if (!combo.searchable || 10 > allitems.length || combo.editable) {
			searchTb.style.display = "none";
		} else {
			searchTb.style.display = "block";
		}
	}

	this.imageable = ops.imageable;
	this.enable = true;
	this.editable = false;
	this.height;
	this.width;
	this.oldselectItem = null;
	this.selectItem = null;

	this.edit;
	this.searchable = true;

	this.addItem = function(argItem) {
		if (!argItem) {
			throw new Error("null pointer of argitem");
		}
		var row = dropdown.insertRow(-1);
		var oneitem;

		row.insertCell(-1);
		row.insertCell(-1);
		row.insertCell(-1);

		allitems[allitems.length] = {	key:argItem,value:row};
		oneitem = allitems[allitems.length - 1];
		argItem.parent = combo;
		_renderItem(oneitem);
		_setdropstyle(row);

		row.onmouseover = function() {
			ev_drmovr(oneitem);
		};

		row.onmouseout = function() {
			ev_drmout(oneitem);
		};

		row.onclick = function() {
			ev_drclick(oneitem);
		};

		// if editable and searchable, the search tb is not show,the edit
		// textbox will handle the event
		_refreshSearchTb();
	};

	this.clearSelect = function() {
		combo.selectItem = null;
		edit.value = STRING_EMPTY;
		if (topimg) {
			topimg.style.display = "none";
		}
		toptr.cells[0].style.width = "0";
		// toptr.cells[1].style.width = "100%";
	}

	this.removeItem = function(argItem) {
		if (argItem == combo.selectItem) {
			combo.clearSelect();
		}
		var index = allitems.indexOfKey(argItem);
		var kvitem;

		if (-1 == index) {
			throw "not an subitem of this object.";
		}
		kvitem = allitems[index];
		allitems.removeo(kvitem);
		zk.remove(kvitem.value);
	};

	/**
	 * remove all of its items,but clear the last select item ,for ajax lazyload,may be you want it hold the item last select,
		you can  call clearSelect if you want.
	 */
	this.removeAll = function() {
		divdrop.removeChild(dropdown);
		dropdown = zk.cr("table");
		zk.addCss(dropdown, 'zk_combobox_table_drop');
		divdrop.appendChild(dropdown);
		allitems = null;
		allitems = new Array();
	};

	this.setSelectValue = function(argValue, argIsNotFireEve) {
		var item;

		item = combo.getItemByValue(argValue);
		if (!item) {
			throw new Error("not contain this value:" + argValue);
		}
		combo.setSelectItem(item, argIsNotFireEve);
	};
	this.setSelectItem = function(argItem, argIsNotFireEve) {
		if (argItem && combo.selectItem && argItem.value == combo.selectItem.value) {
			edit.value = argItem.text;

			return;
		}
		if (!argItem) {
			combo.selectItem = null;
			combo.clearSelect();

			return;
		}
		if (-1 == combo.indexOfItem(argItem)) {
			throw "item can not founded.";
		}
		edit.value = argItem.text;
		combo.oldselectItem = combo.selectItem;
		combo.selectItem = argItem;
		if (topimg) {
			topimg.style.backgroundImage = '';
			topimg.style.backgroundRepeat = 'no-repeat';
			topimg.style.display = "block";
			if (argItem.icon) {
				topimg.style.backgroundImage = 'url(' + argItem.icon + ')';
			} else if (argItem.iconCls) {
				zk.addCss(topimg, argItem.iconCls);
			}
			toptr.cells[0].style.width = WIDTH_CELL_IMG;
		}
		if (!argIsNotFireEve) {
			zk.fire(combo,'selectChanged');
		}
		_adjustedit();
	};

	this.setWidth = function(width) {
		if (!width) {
			width = 0;
		}

		if ("100%" == width) {
			width = ops.to.offsetWidth - WIDTH_BTN;
		}

		width = Math.max(WIDTH_BTN + WIDTH_CELL_IMG + WIDTH_EDT, width);

		toptable.style.width = width;
		combo.width = width;
		_adjustedit();
	};

	this.setHeight = function(height) {
		if (!height) {
			height = HEIGHT;
		}
		edit.style.height = height;
		btn.style.height = height;
		if (topimg) {
			topimg.style.height = height;
		}
		combo.height = height;
	};
	this.setSearchable = function(argSearchable) {
		combo.searchable = argSearchable;
		_refreshSearchTb();
	};
	this.setEditable = function(argEditable) {
		combo.editable = argEditable;
		edit.readOnly = !argEditable;
	};
	this.setEnable = function(argEnable) {
		combo.enable = argEnable;
		// diable is hard to see the word,so use readonly
		edit.readOnly = !argEnable;
		btn.disabled = !argEnable;
	};
	this.getItemByIndex = function(argIndex) {
		return allitems[argIndex].key;
	};
	this.getItemByValue = function(argValue) {
		var index;

		index = combo.indexOfValue(argValue);
		if (-1 == index) {
			return null;
		}
		return combo.getItemByIndex(index);
	};
	this.indexOfItem = function(argItem) {
		var count = combo.getCount();

		for (var i = 0; i < count; i++) {
			if (argItem == combo.getItemByIndex(i)) {
				return i;
			}
		}

		return -1;
	};
	this.indexOfValue = function(argValue) {
		var count = combo.getCount();
		for (var i = 0; i < count; i++) {
			if (argValue == combo.getItemByIndex(i).value) {
				return i;
			}
		}

		return -1;
	};
	this.indexOfText = function(argText) {
		var count = combo.getCount();
		for (var i = 0; i < count; i++) {
			if (argText == combo.getItemByIndex(i).text) {
				return i;
			}
		}

		return -1;
	};
	this.getCount = function() {
		return allitems.length;
	};
	this.getEditValue = function() {
		return edit.value;
	};

	_create();
	_setStyle();
	_inievent();
	ops.to.appendChild(toptable);
	combo.setEditable(false);
	combo.setSearchable(false);
	_adjust();
	combo.edit = edit;
}
