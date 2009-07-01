/**
	MenuItem
	@author Joker
	@required popupMenu.js [base]
*/

function MenuItem(argCaption,argIcon){
	var mni = this;
	
	if (STRING_EMPTY == argIcon){
		argIcon = null;
	}
	this.lazyloadable = true;
	this.command = null;
	this.topmenu = null;
	this.rcCall = new Map();
	/**
		@deprecated please use rcCall
	*/	
	this.tagdata = new Array();	
	this.pmenu = null;
	this.tooltip = null;
	this.icon = argIcon;
	this.caption = argCaption;
	this.onclick = this.onmouseover = this.onmouseout = this.onshowsubmenu = new Function();
	this.onshowsubmenu = null;
	this.subMenu = null;
	this.enable = true;	
	this.hasSubitemflag = false;	
	this.isSeparate = false;
	this.pitem = null;			
	var iniSubmenu = function (){
		if (!mni.subMenu){
			mni.subMenu = new PopupMenu(); 
			mni.subMenu.isTop = false;
		}
		
		return mni.subMenu;
	};
	this.addsubitem = function(argmenuitem){	
		argmenuitem.topmenu = mni.topmenu;
		iniSubmenu().additem(argmenuitem);
		argmenuitem.pitem = mni;
		//set the text add a flag
		if (mni.hasSubitemflag) {return;}		
		mni.pmenu.addSubflag(mni);
	};	
	this.showSubMenu = function(){		
		if (!mni.subMenu) {			
			return;
		}			
		mni.subMenu.setEnable(mni.enable);			
		if (mni.onshowsubmenu){
			mni.onshowsubmenu(mni);
		}	
		mni.pmenu.showSubmenu(mni);			
	} ;
	this.hideSubMenu = function (argIsForce){
		if (!mni.subMenu) {
			return;
		}
		mni.subMenu.hide(argIsForce);
	};
	this.setEnable = function (argEnable){
		if (argEnable == mni.enable){return;}
		mni.enable = argEnable;
		if (mni.subMenu) {mni.subMenu.setEnable(mni.enable);}		
		var pmenu = mni.pmenu;
		if (pmenu){
			var index = pmenu.getindex(mni);		
			pmenu.setitemStyle(pmenu.items[index].value,mni,false);
		}	
	};
	this.removesitem = function (){
		mni.pmenu.removesitem(mni);
	};
	this.remove = function (){
		mni.topmenu.remove(mni.getKeydex());
	};
	this.removeitemAll = function (){
		mni.topmenu.removeitemAll(mni.getKeydex());
	};
	this.seperate = function (){
		mni.subMenu.seperate();
	};
	this.getKeydex = function (){
		return mni.topmenu.getKeydex(mni);
	};
	/**
		@deprecated please use rcCall
	*/
	this.putTagdata = function (key,value){
		mni.tagdata[mni.tagdata.length] = new KeyValue(key,value);
	};
}