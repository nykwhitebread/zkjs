/**
	ComboBox
	@require [base],SelectItem.js
	@author Joker 
*/
function ComboBox(argCont,argWidth,argHeight,argImageable){
	Array.prototype.remove=function(index){	
		if(index<0 || index>=this.length)return;
		for(var i=index;i<this.length;i++)this[i]=this[i+1];
		this.length--;
	}
	
	//remove the element in the array
	Array.prototype.removeObj=function(obj){
		var			bl;
		
		bl=false;
		for(var i=0;i<this.length;i++)
		{
			if (obj===this[i] || bl) 
			{
				this[i]=this[i+1];
				bl=true;
			}	
		}
		if (bl) {this.length--;}		
	}
	
	//return the object's index in the array,return -1 if not found
	Array.prototype.indexOf=function(elm){for(var i=0;i<this.length;i++)if(elm==this[i])return i;return -1;}

	var combo = this;
	var shell=window.SHELL;
	var	com=window.JS_COMMON;
	var isIE = shell.isIE;
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
	var COLOR_DROP_BG_HOV = "#87A8A8";
	var COLOR_DROP_BG = "white";
	var COLOR_DROP_HOV = "white"; 
	var COLOR_DROP = "black";
	var TAGSPACE = "&nbsp;";
	var SIZE_DROP = 10;
	var SIZE_COLUMN = 2;
	var WIDTH_BTN = 20;
	var WIDTH_EDT = 0;
	var	WIDTH_CELL_IMG = 17;
	var WIDTH_DROP_MAX = 500;	
	var HEIGHT = 18;
	var HEIGHT_IMG = 14;
	var HEIGHT_MAX_DROP = SIZE_DROP * HEIGHT;
	var HTML_FLAG = "<font face='webdings'>6</font>";
	var HTML_FLAG_UC = "&#9660;";	
	var STYLE_TEXT_SEARCH = "border-bottom-width:1;border-bottom-color:black;border-bottom-style:solid;border-left-style:none;border-top-style:none;border-right-style:none;width:0;";
	var STYLE_CELL_IMG = "text-align:center;";
	var STYLE_INPUT_TEXT = "border:none;";
	var STYLE_TOP_IMG = "";
	var STYLE_CELL_BTN = "width:" + (WIDTH_BTN + 2) + ";";
	var STYLE_CELL_EDT = "width:100%;";
	var STYLE_DROP_DIV = "background-color:white;position:absolute;display:none;border-width:1px;border-style:solid;border-color:#87A8A8;cursor:pointer;z-index: 100;";
	var	STYLE_BTN = "width:" + WIDTH_BTN + ";background-color:buttonface;cursor:pointer;border-style:solid;border-width:1;border-color:#87A8A8;";
	var STYLE_TABLE_TOP = "font-size:9pt;border-collapse:collapse;border-width:1px;border-style:solid;border-color:#87A8A8;table-layout:fixed;";
	var STYLE_TABLE_DROP = "background-color:white;font-size:9pt;border-collapse:collapse;border-style:none;table-layout:auto;";
	var STYLE_CELL_DROP_IMG = "width:" + WIDTH_CELL_IMG + ";";
	//var STYLE_CELL_DROP_TXT = "background-color:white;color:black;";
	//var STYLE_CELL_DROP_TXT_HOV = "background-color:blue;color:white;";

	var _adjust = function(){
		combo.setWidth(argWidth);
		combo.setHeight(argHeight);				
	};
	
	var _getItemHeight = function(){
		return combo.height;
	};

	var _reajuitems = function(){
		var item;
		var row;
		var j;
		var count;
		
		j = 0;
		count = allitems.length;
		for (var i = 0 ; i < count; i++){
			item = allitems[i].key;
			row = allitems[i].value;
			if ("none" != row.style.display){
				j++;
				//row.style.height = 	_getItemHeight();			
				//row.cells[1].style.height = _getItemHeight();	
				_renderItem(allitems[i]);									
				row.cells[1].style.width = combo.width - (combo.imageable?WIDTH_CELL_IMG:0);					
			}
		}
		//dropdown.style.height = j * _getItemHeight();		
	};	
	
	var _refreshdropitem = function(){
		var count;
		var row;
		
		count = allitems.length;
		for(var i = 0 ; i < count ; i++){
			row = allitems[i].value;
			row.style.display = "block";						
		}
		dropdown.style.display = "block";
		_reajuitems();	
	};
	
	/**
		will return the width of the edit textbox
	*/
	var _adjustedit = function(){
		var ew;
		
		if (combo.imageable && topimg && topimg.style.display != "none"){
			ew = combo.width - (topimg.offsetWidth + WIDTH_BTN);
		}else{
			ew = combo.width - WIDTH_BTN;
		}		
		edit.style.width = Math.max(ew - 5,0);
	};
	var _adjustdrop = function(){
		var ow,oh;
		
//		ow = dropdown.offsetWidth;
//		oh = dropdown.offsetHeight;
//		dropwidth = ow;
//		dropheight = oh;

		ow = divdrop.offsetWidth;
		oh = divdrop.offsetHeight;
		dropwidth = ow;
		dropheight = oh;
		/*
		if (ow < combo.width){						
			dropdown.style.width = dropwidth = combo.width;
			//for the bug of MF,the width of the last cell can't adjust itself
			//and can't fire the event when click or other			
			//if (dropdown.rows[0] && dropdown.rows[0].cells[1]){
			//	dropdown.rows[0].cells[1].style.width = combo.width - (combo.imageable?WIDTH_CELL_IMG:0);
			//}						
		}else{
			dropdown.style.width = combo.width = dropwidth;
		}
		*/
		dropdown.style.width = dropwidth = combo.width;
		
		_refreshdropitem();					
		
		/*
		there is no need to adjust the width if too width			
		}else if (dropdown.offsetWidth > WIDTH_DROP_MAX){
			divdrop.style.width = WIDTH_DROP_MAX;
			divdrop.style.overflowX = "scroll";
		}
		*/		
		
		if (oh > HEIGHT_MAX_DROP){			
			if (isIE){
				dropheight = HEIGHT_MAX_DROP;
				divdrop.style.height = HEIGHT_MAX_DROP;
				divdrop.style.overflowY = "scroll";	
			}else{
				dropheight = HEIGHT_MAX_DROP;
				divdrop.style.height = HEIGHT_MAX_DROP;
				divdrop.style.overflowX = "hidden";				
				divdrop.style.overflowY = "scroll";
			}	
		}
		searchTb.style.width = dropwidth;
		searchTxt.style.width = dropwidth - 7;	
	};

	var _setdropstyle = function(argRow){
		var cells = argRow.cells;
		
		if (combo.imageable) {
			shell.setStyle(cells[0],STYLE_CELL_DROP_IMG);
		}	
	};

	var _setStyle = function (){
		shell.setStyle(dropdown,STYLE_TABLE_DROP);
		shell.setStyle(divdrop,STYLE_DROP_DIV);
		shell.setStyle(toptable,STYLE_TABLE_TOP);
		shell.setStyle(searchTxt,STYLE_TEXT_SEARCH);				
	};
	
	var _renderItem = function(argkvItem){
		var row,argItem;
		var icon;
		var txt;
		
		row = argkvItem.value;		
		argItem = argkvItem.key;
		row.title = argItem.text; 
		if (combo.imageable && !row.cells[0].childNodes[0]) {
			if (argItem.icon){
				icon = document.createElement("IMG");				
				icon.src = argItem.icon;
				icon.height = Math.min(combo.height,HEIGHT_IMG);
				row.cells[0].appendChild(icon);
			}else{
				row.cells[0].innerHTML = TAGSPACE;
			}
		}
		row.style.height = row.cells[1].style.height = row.cells[0].style.height = combo.height;		
		txt = argItem.text.toString();
		if (txt && txt.split(STRING_EMPTY).length>MAXTEXTLENGTH) {
			txt = txt.substring(0,MAXTEXTLENGTH-1)+"..."
		}		
		row.cells[1].innerHTML = txt;
		row.cells[1].style.width = combo.width - (combo.imageable?WIDTH_CELL_IMG:0);
	};
	
	var _refreshItem = function(){
		var kitem = combo.selectItem;
		var kvitem;
		var row;

		if (!kitem){return;}
		kitem.text = edit.value;
		kvitem = com.getKVItemByKey(allitems,kitem);		
		_renderItem(kvitem);
	};
	
	var _iniTr = function (){
		
		if(!edit){
			edit = document.createElement("input");
			edit.type = "text";
		}
		
		if (!btn){
			btn = document.createElement("button");
			if (isIE){
				btn.innerHTML = HTML_FLAG;
			}else{
				btn.innerHTML = HTML_FLAG_UC;
			}
			
		}	
		
		toptr.insertCell(-1);
		toptr.insertCell(-1);
		toptr.insertCell(-1);
		if (combo.imageable){
//			toptr.cells[0].innerHTML = TAGSPACE;
			topimg = new Image();			
			toptr.cells[0].appendChild(topimg);
		}
		toptr.cells[1].appendChild(edit);
		toptr.cells[2].appendChild(btn);
		toptr.cells[2].align = "right";
	 	toptr.cells[0].valign = toptr.cells[1].valign = toptr.cells[2].valign = "center";
	 	
		shell.setStyle(edit,STYLE_INPUT_TEXT);
		shell.setStyle(btn,STYLE_BTN);
		shell.setStyle(toptr.cells[0],STYLE_CELL_IMG);
		shell.setStyle(toptr.cells[1],STYLE_CELL_EDT);
		shell.setStyle(toptr.cells[2],STYLE_CELL_BTN);
		if (topimg) {			
			shell.setStyle(topimg,STYLE_TOP_IMG);
			topimg.style.display = "none";
		}			
	}
	
	var _create = function (){
		var cellhr;
	
		dropdown = document.createElement("table");
		searchTb = document.createElement("table");
		//search
		searchTr = searchTb.insertRow(-1);
		searchTr.insertCell(-1);
		searchTxt = document.createElement("input");
		searchTxt.type = "text";		
		//searchTr.cells[0].width = "100%";
		//searchTr.cells[0].colSpan = SIZE_COLUMN;
		searchTr.cells[0].appendChild(searchTxt);
		
		divdrop = document.createElement("div");
		
		divdrop.appendChild(searchTb);
		divdrop.appendChild(dropdown);
		
		
		
		toptable = document.createElement("table");
		toptr = toptable.insertRow(-1);
		
		_iniTr();
		
		shell.appendChildToDocBody(divdrop);		
	};
	
	var ev_btnmousedown = function(){
		if (!combo.enable){return;}
		
		searchTxt.value = STRING_EMPTY;
		if(divdrop.style.display == "block"){
			blIsbtnclick = true;
			divdrop.style.display = "none";
			return false;
		}
		
		//_refreshdropitem();
		blIsbtnclick = true;
		divdrop.style.display = "block";
		divdrop.style.left = com.getPixLeft(toptable);
		divdrop.style.top = com.getPixTop(toptable) + combo.height + 7;
		if (combo.onDropdown){
			combo.onDropdown(combo);
		}		
		_adjustdrop();
		
		return false;
	};
	
	//only for shield submit
	var ev_btnclick = function(){
		return false;
	};
	
	var ev_edtclick = function(){
		if (!combo.editable){
			edit.blur();
			
			return false;
		}
	};
	
	var ev_edtblur = function(){
		if (!combo.selectItem){return;}
		
		var blIsrefresh = true;
		if (combo.onEditfinished){
			blIsrefresh = combo.onEditfinished(combo);
			if (!blIsrefresh && blIsrefresh != false){
				blIsrefresh = true;
			}
		}
		//comment reason:should not change the corresponding item value
		//if (blIsrefresh) {_refreshItem();}
	};
	
	var ev_edtkeyup = function(e){
		if (13 == e.keyCode){
			ev_edtblur(e);
		}
	};	
	
	var ev_drmovr = function(argItems){
		var cells = argItems.value.cells;
		
		argItems.value.style.backgroundColor = COLOR_DROP_BG_HOV;
		//cells[1].style.backgroundColor = COLOR_DROP_BG_HOV;
		cells[1].style.color = COLOR_DROP_HOV;
	};
	
	var ev_drmout = function(argItems){
		var cells = argItems.value.cells;
		
		argItems.value.style.backgroundColor = COLOR_DROP_BG;
		//cells[1].style.backgroundColor = COLOR_DROP_BG;
		cells[1].style.color = COLOR_DROP;
	};
	
	var ev_drclick = function(argItems){
		var kitem = argItems.key;
		var vitem = argItems.value;
		
		combo.setSelectItem(kitem);
		divdrop.style.display = "none";
		edit.blur();		
	};
	
	var ev_searchclick = function(){
		blIsSearchClick = true;
	};
	
	var ev_searchkeyup = function(){
		var txtsearch;
		var count;
		var item;
		var row;
		var flag;
			
		flag = false;		
		count = allitems.length;		
		txtsearch = searchTxt.value;		
		if (txtsearch == STRING_EMPTY){
			_refreshdropitem();	
			//_reajuitems();
			dropdown.style.display = "block";				
			
			return;
		}
		
		for (var i = 0 ; i < count; i++){
			item = allitems[i].key;
			row = allitems[i].value;
			if (0 != item.text.indexOf(txtsearch)){
				row.style.display = "none";
			}else{
				flag = true;
				row.style.display = "block";
				//row.cells[1].style.width = combo.width - (combo.imageable?WIDTH_CELL_IMG:0);
			}
		}
		
		_reajuitems();
		if (!flag){
			dropdown.style.display = "none";
		}else{
			dropdown.style.display = "block";
		}
		//_adjustdrop();
		//searchTb.style.width = dropwidth;		
		//searchTb.style.height = combo.height;		
		//alert(searchTb.offsetHeight + "|" + dropdown.offsetHeight);
	}; 
	
	var _inievent = function (){
		btn.onmousedown = ev_btnmousedown;		
		btn.onclick = ev_btnclick;		
		edit.onclick = ev_edtclick;
		edit.onblur = ev_edtblur;
		if (isIE){
			edit.onkeyup = function (){ev_edtkeyup(window.event);};
		}else{
			edit.onkeyup = function (e){ev_edtkeyup(e);};
		}		
		searchTr.onclick = ev_searchclick;
		searchTxt.onkeyup = ev_searchkeyup;
		
		SHELL.addElementEvent(document,"onclick",
			function (){
				if (blIsSearchClick){					
					blIsSearchClick = false;
				}else{
					if (!blIsbtnclick){
						divdrop.style.display = "none";					
					}else{
						blIsbtnclick = false;
					}
				}				
			}		
		);		
	};
	
	this.imageable = argImageable;
	this.enable = true;
	this.editable = false;
	this.selectable = true;
	this.height;
	this.width;
	this.rcCall = new Map();
	this.onSelectChanged = this.onDropdown = this.onEditfinished = null;
	this.oldselectItem = null;
	this.selectItem = null;	
	/**
		@deprecated please use rcCall
	*/
	this.tagdata;
	this.edit;
	this.searchable = true;
	this.lazyloadable = false;
			
	this.addItem = function(argItem){
		if (!argItem){
			throw new Error("null pointer of argitem");
		}
		var row = dropdown.insertRow(-1);
		var icon;
		var oneitem;
		
		row.insertCell(-1);
		row.insertCell(-1);
		row.insertCell(-1);
		
		com.putArrParam(allitems,argItem,row);
		oneitem = allitems[allitems.length - 1];
		argItem.parent = combo;
		_renderItem(oneitem);
		_setdropstyle(row);	
		
		row.onmouseover = function(){			
			ev_drmovr(oneitem);
		};
			
		row.onmouseout = function(){
			ev_drmout(oneitem);
		};
		
		row.onclick = function(){			
			ev_drclick(oneitem);
		};
		
		if (!combo.searchable || 2 > allitems.length){
			searchTb.style.display = "none";
		}else{
			searchTb.style.display = "block";
		}			
	};
	
	this.clearSelect = function (){
		combo.selectItem = null;
		edit.value = STRING_EMPTY;
		if (topimg){
			topimg.style.display = "none";
		}		
		toptr.cells[0].style.width = "0";
		//toptr.cells[1].style.width = "100%";
	}
	
	this.removeItem = function (argItem){
		if (argItem == combo.selectItem){
			combo.clearSelect();
		}
		var index = com.getKVIndexByKey(allitems,argItem);
		var kvitem;
		
		if (-1 == index){
			throw "not an subitem of this object.";
		}
		kvitem = allitems[index];
		allitems.removeObj(kvitem);	
		shell.remove(kvitem.value);
	};
	
	this.removeAll = function (){
		//combo.clearSelect();
		divdrop.removeChild(dropdown);		
		dropdown = document.createElement("table");
		shell.setStyle(dropdown,STYLE_TABLE_DROP);
		divdrop.appendChild(dropdown);		
		allitems = null;
		allitems = new Array();
	};
	
	this.setSelectValue = function(argValue,argIsNotFireEve){
		var item;
		
		item = combo.getItemByValue(argValue);
		if (!item){throw new Error("not contain this value:" + argValue);}
		combo.setSelectItem(item,argIsNotFireEve);
	};
	this.setSelectItem = function(argItem,argIsNotFireEve){
		if (argItem && argItem.equal(combo.selectItem)){
			edit.value = argItem.text;
			
			return;
		}
		if (!argItem){
			combo.selectItem = null;
			combo.clearSelect();
			
			return;
		}
		if (-1 == combo.indexOfItem(argItem)){
			throw "item can not founded.";
		}
		edit.value = argItem.text;
		combo.oldselectItem = combo.selectItem;
		combo.selectItem = argItem;
		if (topimg && argItem.icon){
			topimg.style.display = "block";
			topimg.src = argItem.icon;
			toptr.cells[0].style.width = topimg.offsetWidth?topimg.offsetWidth:WIDTH_CELL_IMG;
		}
		if (!argIsNotFireEve && combo.onSelectChanged){				
			combo.onSelectChanged(combo);
		}
		_adjustedit();				
	};
	
	this.setWidth = function (argWidth){
		if(!argWidth){
			argWidth = 0;
		}
		//var ewidth;
		
		if ("100%" == argWidth){			
			argWidth = argCont.offsetWidth - WIDTH_BTN;		
		}
	
		argWidth = Math.max(WIDTH_BTN + WIDTH_CELL_IMG + WIDTH_EDT,argWidth);		

	 	toptable.style.width = argWidth;
		combo.width = argWidth;		
		_adjustedit();
	};
	
	this.setHeight = function(argHeight){
		if (!argHeight) {argHeight = HEIGHT;}
		edit.style.height = argHeight;
		btn.style.height = argHeight;
		if (topimg) {topimg.style.height = argHeight;}
		combo.height = argHeight;
	};
	this.setSearchable = function(argSearchable){	
		if (argSearchable){
			searchTb.style.display = "block";
		}else{
			searchTb.style.display = "none";
		}
		combo.searchable = argSearchable;
	};
	this.setSelectable = function (argSelectable){
		combo.selectable = argSelectable;
		btn.disabled = !argSelectable;
		edit.readOnly = true;
	};
	this.setEditable = function (argEditable){
		combo.editable = argEditable;
		edit.readOnly = !argEditable;
	};	
	this.setEnable = function(argEnable){
		combo.enable = argEnable;
		edit.disabled = !argEnable;
		btn.disabled = !argEnable;
	};
	this.getItemByIndex = function(argIndex){
		return allitems[argIndex].key;
	};
	this.getItemByValue = function(argValue){
		var index;
		
		index = combo.indexOfValue(argValue);
		if (-1 == index){return null;}
		return combo.getItemByIndex(index);
	};	
	this.indexOfItem = function(argItem){
		var count = combo.getCount();
		
		for (var i = 0 ; i < count ; i++){
			if (argItem == combo.getItemByIndex(i)){
				return i;
			}
		}
		
		return -1;
	};
	this.indexOfValue = function(argValue){
		var count = combo.getCount();
		for (var i = 0 ; i < count ; i++){
			if (argValue == combo.getItemByIndex(i).value){
				return i;
			}
		}
		
		return -1;		
	};
	this.indexOfText = function(argText){
		var count = combo.getCount();
		for (var i = 0 ; i < count ; i++){
			if (argText == combo.getItemByIndex(i).text){
				return i;
			}
		}
		
		return -1;	
	};	
	this.getCount = function(){
		return allitems.length;
	};
	this.getEditValue = function(){
		return edit.value;
	};
					
	_create();
	_setStyle();
	_inievent();			
	argCont.appendChild(toptable);	
	combo.setEditable(false);
	_adjust();
	combo.edit = edit;	
}

