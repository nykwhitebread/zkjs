/**
	popupMenu
	@author Joker
	@required [base]
*/

function PopupMenu(argWidth,argHeight){

	Array.prototype.remove=function(index)
	{	
		if(index<0 || index>=this.length)return;
		for(var i=index;i<this.length;i++)this[i]=this[i+1];
		this.length--;
	}//end md
	//remove the element in the array
	Array.prototype.removeObj=function(obj)
	{
		var			bl;
		
		bl=false;
		for(var i=0;i<this.length;i++)
		{
			if (obj===this[i] || bl) 
			{
				this[i]=this[i+1];
				bl=true;
			}//end if	
		}//end for
		if (bl) {this.length--;}		
	}//end md
	Array.prototype.indexOf=function(elm){
		for(var i=0;i<this.length;i++) {
			if(elm==this[i]) {return i;}
		}		
		return -1;
	}	

	var MAXTEXTLENGTH = 12;
	var HEIGHT_SEPARATE = 1;
	//the style of the table
	var TBSTYLE = "font-size:9pt;border-collapse:collapse;border-width:1px;border-style:solid;border-color:black;table-layout:fixed;";
	var STYLE_TXTCELL = "height:24;padding-left:5;width:100%;";
	var STYLE_FLAGCELL = "width:12;";
	var STYLE_IMGCELL = "width:26;background-color:buttonface;height:24;text-align:center;";
	var	STYLE_SEPERATE = "height:24;background-color:white;color:gray;";
	
	var	STYLE_SEPERATE_TR = "boder-color:gray;height:" + HEIGHT_SEPARATE + "px;background-color:gray;color:gray;";
	var MARGIN = 2;
	var WIDTH = 200;
	var HEIGHT = 24;
	var HIDERATE = 3/4;
	var HTML_CHK = "<font style=\"font-size:9px\"><b>&#8730;</b></font>";

	var baseFunc = window.SHELL;
	var pom = this;
	var isIE = baseFunc.isIE;
	var layer;
	var isOut = true;
	//field
	var items = new Array();
	var allitems = new Array();		
	//the table
	var itemtable = null;
	var isTop = true;		
	
	this.owner = null;
	this.allitems = allitems;
	this.items = items;
	this.isTop = isTop;
	this.bgColor = "white";
	//the table's style
	this.tbstyle = TBSTYLE;	 
	this.itemStyle = "background-color:white;color:black;cursor:pointer;";
	this.itemHovStyle = "background-color:#87A8A8;color:white;cursor:pointer;";
	this.itemDisableStyle = "background-color:white;color:gray;cursor:pointer;";
	this.itmwidth = argWidth?argWidth:WIDTH;
	this.itmheight = argHeight?argHeight:HEIGHT;
	this.visible = false;
	this.enable = true;
	this.x = null;
	this.y = null;
	this.cancelHide = false;
	
	//event
	this.onclick = new Function();
	
	this.background = "buttonface";
	this.border = null;
	this.fontSize = "12px";
	this.padding = "5px;"
	this.cursor = "default";
	this.content = null;
	layer = document.createElement("DIV");
	
	var getContent = function(){		
		return layer;				
	};
	
	var setValue = function (argObj,argValue){		
		if (argValue!=null) {argObj = argValue;}
	};	
	
	//method
	var setTabStyle = function(){
		setValue(itemtable.style.bgColor,pom.bgColor);		 
		itemtable.cellPadding = "0";
		itemtable.cellSpaceing = "0";
		itemtable.style.cssText = pom.tbstyle;
		itemtable.style.width =	pom.itmwidth + MARGIN;
		itemtable.style.height = pom.itmheight*pom.countItems() + MARGIN;
	};
	
	var setitemStyle = function (newrow,argItem,argIshover){		
		var imgcell = newrow.cells[0];
		var txtcell = newrow.cells[1];
		var flagcell = newrow.cells[2];
		
		if (argItem.isSeparate){
			baseFunc.setStyle(newrow,STYLE_SEPERATE_TR);
			baseFunc.setStyle(txtcell,STYLE_SEPERATE_TR);
			
			return;
		}	
		imgcell.style.cssText = STYLE_IMGCELL;
		txtcell.style.cssText = STYLE_TXTCELL;
		flagcell.style.cssText = STYLE_FLAGCELL;
		
		if (!argItem.enable){
			newrow.style.cssText = pom.itemDisableStyle;
		}else if (!argIshover){
			newrow.style.cssText = pom.itemStyle;		
		}else{
			newrow.style.cssText = pom.itemHovStyle;
		}
	};
	
	var renderItem = function (argRow,argItem){
		var txt;

		argRow.insertCell(-1);
		argRow.insertCell(-1);
		argRow.insertCell(-1);
		var imgcell = argRow.cells[0];
		var txtcell = argRow.cells[1];		
		if (argItem.icon){			
			var img = getDocument().createElement("IMG");
			img.src = argItem.icon;
			imgcell.appendChild(img);				
		}else{
			//imgcell.innerHTML = HTML_CHK;
			imgcell.innerHTML = "&nbsp;";
		}		
		if (!argItem.isSeparate) {
			if (argItem.tooltip){
				argRow.title = argItem.tooltip;
			}else{
				argRow.title = argItem.caption;
			}	
			txt = argItem.caption.toString();
			if (txt && txt.split(STRING_EMPTY).length>MAXTEXTLENGTH) {
				txt = txt.substring(0,MAXTEXTLENGTH-1)+"..."
			}		
			txtcell.innerHTML = txt;
		}else{
			txtcell.colSpan = 2;
			imgcell.innerHTML = txtcell.innerHTML = window.STRING_EMPTY;
		}		
		setitemStyle(argRow,argItem,false);		
	};
		
	var getDocument = function (){
		return document;
	};
	
	var hideOtherSubmenu = function (argMenuItem){
		var count = pom.getCount();
		var index = pom.getindex(argMenuItem);
		for (var i = 0 ; i < count ; i++){
			if (!items[i]||i == index) {continue;}
			items[i].key.hideSubMenu();
		}
	};
		
	var m_click = function (argRow,argItem){
		if (argItem.onclick&&argItem.enable) {			
			argItem.onclick(argItem);
		}
		pom.onclick(argItem);
//		pom.hide(true);
		argItem.topmenu.hide(true);
	};
	
	var m_over = function (argRow,argItem){		
		setitemStyle(argRow,argItem,true);
		if (argItem.onmouseover&&argItem.enable){
			argItem.onmouseover(argItem);
			hideOtherSubmenu(argItem);
			argItem.showSubMenu();
		}
	};
	
	var m_out = function (argRow,argItem){
		setitemStyle(argRow,argItem,false);
		if (argItem.onmouseout&&argItem.enable){
			argItem.onmouseout(argItem);
			//argItem.hideSubMenu();
		}
	};
	
	var lay_onover = function (){
		isOut = false;
	};
	
	var lay_onout = function (){
		isOut = true;
	};
	
	var addhideedobj = function (){
		
	};
		
	this.getWidth = function(){
		return layer.offsetWidth;
	};
	
	this.getHeight = function(){
		return layer.offsetHeight;
	};
	
	/**
		count the not separate item in the menu
	*/
	this.countItems = function(){		
		var c=0;
		var size = items.length;
		for(var i=0;i<size;i++){
			var item=items[i].key;
			if (item.isSeparate) continue;
			c++;
		}
		return c;
	};
		
	this.adjustposition = function (x,y){
		if (!x || !y){
			x = pom.x;
			y = pom.y;
		}
		if (!pom.visible){
			return;
		}
		var xy = baseFunc.adjustPosition(x,y,pom.getWidth(),pom.getHeight());
		var l,t;
		
		l = xy.x;
		t = xy.y;
		pom.x = l;
		pom.y = t;
		layer.style.left = l;
		layer.style.top = t;
		//backup the hided select 
		baseFunc.showDivOverElement(layer);
		baseFunc.hideDivOverElement(null,layer);		
	};
	
	layer.onmouseout = lay_onout;
	layer.onmouseover = lay_onover;
	
	itemtable = getDocument().createElement("TABLE");	
	getContent().appendChild(itemtable);
	
	var test = function (){
		alert('test');
	};	 
	
	this.setitemStyle = setitemStyle;
	
	/**
		@param w-width(popupMenu) 
		@param h-height(popupMenu height) 
		@param o-parent Object
		@param l left of the layer,default is the position event
		@param t top of the layer,default is the position event 
		@param argIsneedAdjust is need adjust the position to the window
	*/	
	this.inshow = function(w,h,o,l,t,argIsneedAdjust){			
		if (!o) {
			o = document.body;		
		}

		if (l==null) {l = window.event.clientX + document.body.scrollLeft;}
		if (t==null) {t = window.event.clientY + document.body.scrollTop;}
		//adjust
		var xy = baseFunc.adjustPosition(l,t,w,h);
		l = xy.x;
		t = xy.y;
		pom.x = l;
		pom.y = t;
		l = l + "px";
		t = t + "px";		
		setValue(layer.style.background, pom.background);
		setValue(layer.style.border,pom.border);
		setValue(layer.style.fontSize, pom.fontSize);			
		layer.style.zIndex = "98";
		setValue(layer.style.width,w);
		setValue(layer.style.height,h);
		layer.style.position = "absolute";
		layer.style.display = "inline";		
		//here can't use setValue why?
		layer.style.left = l;
		layer.style.top = t;
		layer.oncontextmenu = function (){return false;}
		setValue(layer.style.padding,pom.padding);
		setValue(layer.style.cursor,pom.cursor);	
		document.body.appendChild(layer);
		//backup the hided select 
		baseFunc.showDivOverElement(layer);
		baseFunc.hideDivOverElement(null,layer);	
		
	};	
		
	this.show = function (argWidth,argHeight,argContainer,argLeft,argTop,argIsneedAdjust){
		setTabStyle();
		if (false != argIsneedAdjust && true != argIsneedAdjust){
			argIsneedAdjust = true;
		}		
		pom.inshow(argWidth,argHeight,argContainer,argLeft,argTop,argIsneedAdjust);	
		pom.visible = true;
	};	
	
	/**
		show the sub menu of the item
	*/
	this.showSubmenu = function (argMenuitem){
		var px,py;
		var index,scount=0;
		var smenu;

		smenu = argMenuitem.subMenu;
		if (!smenu){
			return;
		}
		index = pom.getindex(argMenuitem);		
		if (-1 == index) {
			throw "the item is not the subitem of the menu!";
		}
		px = window.JS_COMMON.getPixLeft(items[index].value) + WIDTH;
		py = window.JS_COMMON.getPixTop(items[index].value);
		//adjust sunmenu
		var cw;
		var ch;
		var ah;
		
		cw = document.body.clientWidth;
		ch = document.body.clientHeight;
		ah = HEIGHT*smenu.countItems();
		//left
		if (px + WIDTH*HIDERATE > cw) {
			px = px - WIDTH*2; 
		}
		//top		
		if (py + ah > ch){
			py = py - ah + HEIGHT;
		}		
		smenu.show(null,null,null,px,py,true);	
	};
	
	/**
		add a has subitem flag to the show text
		@param argMenuitem the need refreshed menuitem
	*/
	this.addSubflag = function (argMenuitem){
		if (argMenuitem.hasSubitemflag){
			return;
		}
		var index = pom.getindex(argMenuitem);
		if (-1 == index){
			throw "the item is not the subitem of the menu!";
		}
		var rtHTML;
		if (isIE){
			rtHTML = "<font face='webdings'>4</font>";
		}else{
			rtHTML = "&#9654;";
		}
		items[index].value.cells[2].innerHTML = rtHTML;
		argMenuitem.hasSubitemflag = true;
	};	
	
	/**
		contain the separate item in the menu,not contain the sub items of the submenu
		@return the count of the items in the menu 		 
	*/
	this.getCount = function (){
		return items.length;
	};
	
	/**
		get the index of the menuitem 
		@param argItem the item
		@return if not found return -1  
  	*/
	this.getindex = function (argItem){
		var index = -1;
		var count = pom.getCount();
		for (var i = 0;i < count;i++){
			if (items[i] && items[i].key == argItem) {
				index = i;
			}
		}
		
		return index;
	};
	
	/**
		return the menu item of by the index
		this is not directly the item of the items
	*/	
	this.getitem = function (argIndex){
		var item = items[argIndex];
		
		if (item) {
			return item.key;
		}		
	};
	
	this.getKeydex = function (argItem){
		if (!pom.isTop){
			throw "this menu is not the top menu.";
		}
		return allitems.indexOf(argItem);
	};
	
	this.getItemByKeydex = function(argKeydex){
		return allitems[argKeydex];
	};	
	
	/**
		add MenuItem to the menu
		@param argItem the MenuItem of the menu 
 	*/
	this.additem = function (argItem){	
		var newrow = itemtable.insertRow(-1);	
		var newitem = new KeyValue(argItem,newrow);		
		items[items.length] = newitem;
		argItem.pmenu = pom;
		renderItem(newrow,argItem);	
		//see the allitems only store the menuitem while the items store the 
		//menuitem and a tr row else
		//for separate ,it's only need to added to the parent menu
		var tm;
		if (argItem.isSeparate){
			return;
		}		
				
		if (pom.isTop) {
			argItem.topmenu = pom;
			allitems[allitems.length] = argItem;
		}else{
			tm = argItem.topmenu;						
			tm.allitems[tm.allitems.length] = argItem;
		}			
		newrow.onclick = function (){
			m_click(newrow,argItem);
		};
		newrow.onmouseover = function (){
			m_over(newrow,argItem);
		};
		newrow.onmouseout = function (){
			m_out(newrow,argItem);
		};
	
	};
	
	/**
	
	*/
	this.removesitem = function (mitem){
		var pmenu = mitem.pmenu;
		var index = pmenu.getindex(mitem); 
		var item = pmenu.items[index];

		//current		
		//dom		
		baseFunc.remove(item.value);
		//items		
		pmenu.items.remove(index);
	};
	
	/**
		top menu method
	*/
	this.removeitemAll = function (argKeydex){
		if (!isTop){
			throw "this menu is not the top menu.";
		}
		if (null != argKeydex){
			var mitem = pom.getItemByKeydex(argKeydex);
			var submenu;
			var keydex;
			if (!mitem){
				return;
			}
			submenu = mitem.subMenu;
		}else{
			submenu = pom;
		}
		
		if (!submenu){
			return;
		}	
		var count = submenu.getCount();
		for (var i = 0 ; i < count;){
			var item = submenu.items[i];
			if (item){
				var mit = item.key;
				if (mit.isSeparate){
					mit.removesitem();
				}else{
					pom.remove(pom.getKeydex(mit));
				}	
			}else{
				i++;
			}						
		}		
	};
	
	/**
		top menu method
	*/
	this.remove = function (argKeydex){
		if (!isTop){
			throw "this menu is not the top menu.";
		}
		if (-1 == argKeydex || allitems.length <= argKeydex){			
			throw "index " + argKeydex + " out of range";
		}
		var mitem = pom.getItemByKeydex(argKeydex);
		if (!mitem){
			return;
		}		

		//submenu
		pom.removeitemAll(argKeydex);
		mitem.removesitem();		
		//allitems		
		allitems.remove(argKeydex);
		mitem = null;		
		//set table style
		setTabStyle();			
	};
	
	/**
	
	*/
	this.seperate = function (){
		var item = new MenuItem(window.STRING_EMPTY);		
		item.isSeparate = true;		
		item.setEnable(false);
		pom.additem(item);
		
		return item;
	};
		
	this.getCount = function(){
		return items.length;
	};
	
	/**
		set the enable of the menu
	*/
	this.setEnable = function (argEnable){
		if (argEnable == pom.enable) {
			return;
		}
		pom.enable = argEnable;
		var count = pom.getCount();
		for (var i = 0 ; i < count ; i++){
			if (!items[i]) {continue;}
			items[i].key.setEnable(argEnable);
			setitemStyle(items[i].value,items[i].key,false);
		}
		//sub style		
	};
	
	/**
		@param argIsForce is forced to hide 
 	*/
	this.hide = function (argIsForce){		
		var count 
				
//		alert(event.srcElement.innerHTML + "|" + pom.cancelHide + "|" + event.srcElement.tagName);
		//for MF to shield to fire the event onclick when oncontextmenu
		if (pom.cancelHide || !isOut && (argIsForce != true)) {
			pom.cancelHide = false;
					
			return;
		}
		layer.style.display = "none";		
		//backup the hided select 
		baseFunc.showDivOverElement(layer);
		
		count = pom.getCount();
		for (var i = 0;i < count;i++){
			if (items[i]) {
				//need backup status
				setitemStyle(items[i].value,items[i].key,false);
				//hide submenu
				items[i].key.hideSubMenu(argIsForce);
			}
		}		
		pom.visible = false;
	};
	
	baseFunc.addElementEvent(document,"onmousedown",pom.hide);
}