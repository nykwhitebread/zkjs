/**
	the base function for supporting IE and FireFox
	@author Joker	 
	@require common.js
*/

(function () {
	if (document.uniqueID) return;
	/*
	function _w_GET_event_ () {
		var mArg0;
		var fFunc = _w_GET_event_.caller;
		while(null != fFunc){
			mArg0 = fFunc.arguments[0];
			if(mArg0 && Event == mArg0.constructor)return mArg0;
			fFunc = fFunc.caller;
		}
		return null;
	}
	var _w = Window.prototype;
	_w.__defineGetter__("event", _w_GET_event_);
	*/
	Window.constructor.prototype.__defineGetter__("event", function(){
		var o = arguments.callee.caller;
		var e;
		while(o != null){
			e = o.arguments[0];
			if(e && (e.constructor == Event || e.constructor == MouseEvent)) return e;
			o = o.caller;
		}
		return null;
	});
})();





window.SHELL=new Shell();	
window.SHELL.init();

function Shell(){
	var	isIE;
	var	_this = this;
	var com = window.JS_COMMON;
	var STYLE_SHEDDIV = "position:absolute;top:0;left:0;display:none;";
	
	var	divShield;
	var topmainwin;
			
	this.blIsShield = false;
	
	var _adjustShield = function(){
		if (!_this || !divShield){return;}
		divShield.style.width = window.document.body.clientWidth;
		divShield.style.height = window.document.body.clientHeight;		
	};

	var _getShield	= function(){
		if (divShield){
			return divShield;
		}
		
		if (isIE){
			divShield = window.document.createElement("IFRAME");
			_this.setStyle(divShield,STYLE_SHEDDIV);
			divShield.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=40)"; 
		}else{			
			divShield = window.document.createElement("DIV");
			_this.setStyle(divShield,STYLE_SHEDDIV);
		}
		_this.appendChildToDocBody(divShield);
		_this.addElementEvent(window,"onresize",_adjustShield);
		
		return divShield;
	};
	
	this.isIE = isIE = document.uniqueID?true:false;

	/**
		is browser IE
	*/
	this.isIE = isIE;
	
	
	
	/**
		set the style attribute
		@param argObj the target object
		@param argStyleText the style text 
		@remark it will remove the class attribute of the object
	*/
	this.setStyle = function(argObj,argStyleText){
		_this.removeCss(argObj);
		if (isIE){			
			argObj.style.cssText = argStyleText;
		}else{	
			argObj.setAttribute("style",argStyleText);
		}//end if	
	};//end md
	
	/**
		get the style Test of the element
		it will keep a ";" at the end of the text
		@param the element object 
	*/
	this.getStyleText = function(argObj){
		var	strStyleText;
		
		if (isIE){
			strStyleText = argObj.style.cssText;
		}else{
			strStyleText = argObj.getAttribute("style");
		}//end if
		if (!strStyleText) {strStyleText=STRING_EMPTY};	
		strStyleText=strStyleText.trim().toLowerCase();
		if (!strStyleText.endWith(";")) {strStyleText=strStyleText+";";}
		return strStyleText;
	};//end md
	
	/**
		@deprecated for optimize should not use this method
		@param argObj the element object
		@param argStylename the name of the style 
		@param argStyleText the style text 
	*/
	this.setSingleStyle = function (argObj,argStylename,argStyleText){
		var	styleText;	
		var	ib,ie;
		var styles;
		var blIsEndwith;
			
		argStyleText = argStyleText.toString();		
		styleText = _this.getStyleText(argObj);		 
		styleText = null!=styleText?styleText:"";
		blIsEndwith = styleText.lastIndexOf(";") == styleText.length - 1;
		
		if (-1 != styleText.indexOf(argStylename)){

			styles = styleText.split(";");
			for (var i = 0 ; i < styles.length; i++){
				if ((0 == _this.trim(styles[i]).indexOf(argStylename))&&argStyleText){
					styles[i] = argStylename + ":" + argStyleText;
				}//end if
			}//end for
			styleText = "";
			for (var i = 0 ; i < styles.length; i++){
				styleText = styleText + styles[i] + ";";
			}//end for
		}else{		
			styleText = styleText + (blIsEndwith?"":";") + argStylename + ":" + argStyleText + ";";	
		}//end if		
		_this.setStyle(argObj,styleText);
	};//end md
	
	/**
		get the style value of the given style name
		@deprecated for optimize should not use this method
		@param element
		@param style name 
	*/
	this.getSingleStyle=function(argObj,argStylename){
		var	styleText;
		var	ib,ie;
		
		styleText = _this.getStyleText(argObj);
		argStylename=argStylename.toLowerCase();
		if (styleText.indexOf(argStylename) < 0){
			return null;
		}else{	
			ib = styleText.indexOf(argStylename);
			ie = styleText.indexOf(";",ib);
			styleText=styleText.substring(ib+argStylename.length+1,ie);
			return styleText;
		}//end if
	};//end md
	
	/**
		set the class attribute
		@param argObj the target object
		@param argCssName the class name
		@remark it will remove the style of the object 
	*/
	this.setCss = function(argObj,argCssName){
		argObj.removeAttribute("style");
		if (isIE){
			argObj.setAttribute("className",argCssName);
		}else{	
			argObj.setAttribute("class",argCssName);
		}//end if		
	};//end md	
	
	/**
		remove the class attribute
		@param argObj the target object
	*/
	this.removeCss = function(argObj){
		if (isIE){
			argObj.removeAttribute("className");
		}else{	
			argObj.removeAttribute("class");
		}//end if		
	};//end md
	
	/**
		add DOM event listener to the object,it is corresponding to 
			DOM2 addEventListener
		@param argObj the element object
		@param argEvent the event name, it use the IE format like onSomeEvent
		@param argFunc the function pointer 
	*/
	this.addElementEvent = function(argObj,argEvent,argFunc){

		if (isIE){
			argObj.attachEvent(argEvent,argFunc);
		}else{
			argEvent = argEvent.substring(2);	
			argObj.addEventListener(argEvent,argFunc,false);
		}//end if
	};//end md
	
	/**
		create a radiobox
		@param argName nameof the radiobox
		@param argIsChecked is checked
	*/
	this.createRadioboxElement = function(argName,argIsChecked){
		var radio;
						
		if (isIE){
			var text = "<input type=\"radio\" name=\"" + argName + "\" value=\"checked\" >";
			radio = document.createElement(text);
		}else{
			radio = document.createElement("input");
			radio.setAttribute("type","radio"); 
			radio.setAttribute("name",argName); 
			radio.setAttribute("value","checked"); 
		}//end if
		radio.checked = argIsChecked;
		
		return radio;
	};//end md
	
	
	
	/**
		a substitude method of insertAdjacentElement (IE)	
		@param argObj 
		@param argNewObj the new object
		@param argStrsomewhere the same as param 1 of insertAdjacentElement
	*/
	this.insertAdjacentElement = function (argObj,argStrsomewhere,argNewObj) {
		var	parent;
		
		if (!argObj) {com.throwException("Shell.insertAdjacentElement:argObj is null!");}		
		if (!argStrsomewhere) {com.throwException("Shell.insertAdjacentElement:where should not be null!");}
		switch (argStrsomewhere.toLowerCase()) {
			case "beforebegin":
				if (!argObj.parentNode) {com.throwException("Shell.insertAdjacentElement:can't find node's parent!");}
				argObj.parentNode.insertBefore(argNewObj,argObj);
				break;
			case "afterbegin":
				var nn = !argObj.childNodes?null:argObj.childNodes[0];
				if (!nn) {nn = null};
				argObj.insertBefore(argNewObj,nn);
				break;
			case "beforeend":
				argObj.appendChild(argNewObj);
				break;
			case "afterend":
				if (!argObj.parentNode) {com.throwException("Shell.insertAdjacentElement:can't find node's parent!");}
				var nnode = _this.nextnode(argObj);
				argObj.parentNode.insertBefore(argNewObj,nnode);				
				break;	
		}//end switch
	};//end md
	
	/**
		@deprecated should use nextSibling of w3c DOM 
		return the next node of its brother
		@param argObj the obj
	*/	 
	this.nextnode = function(argObj){
		var	parent,obj;
		
		obj = null;
		parent = argObj.parentNode;
		for (var i = 0;parent.childNodes[i];i++){
			if (parent.childNodes[i] === argObj) {
				try{
					obj = parent.childNodes[i + 1];
				}catch(e){
					obj = null;
				}//end try	
				break;
			}//end if
		}//end for
		return obj;
	};//end md	
	
	/**
		trim
		@param rgObj the string
	*/
	this.trim = function(argObj){
		return argObj.toString().replace(/(^\s*)|(\s*$)/g, "");
	};//end md
	
	/**
		remove the element itself
		@param argObj the element 
	*/
	this.remove = function(argObj){
		if (argObj.parentNode) {
			argObj.parentNode.removeChild(argObj);
		}//end if
	};//end md
		/**
		only for IE, for MF need not this 
		used mostly to hide the select element witch the div over
		@param elmID the tagname of the element(default is select)
		@param overDiv the div
		@param escapeElms the elements array you do not want to hide 
	*/	
	this.hideDivOverElement = function (elmID, overDiv,escapeElms) {
		if (!elmID){
			elmID = "select"; 
		}		
		if (isIE) {	
			var elms = document.getElementsByTagName(elmID);	
			if (!overDiv._hideelements) {
				overDiv._hideelements = [];
			}
			for (i = 0; i < elms.length; i++) {
				obj = elms[i];
				if (!obj || !obj.offsetParent) {
					continue;
				}
				objLeft = obj.offsetLeft;
				objTop = obj.offsetTop;
				objParent = obj.offsetParent;
				while (objParent.tagName.toUpperCase() != "BODY") {
					objLeft += objParent.offsetLeft;
					objTop += objParent.offsetTop;
					objParent = objParent.offsetParent;
				}
				objHeight = obj.offsetHeight;
				objWidth = obj.offsetWidth;
				if ((overDiv.offsetLeft + overDiv.offsetWidth) <= objLeft) {
				} else {
					if ((overDiv.offsetTop + overDiv.offsetHeight) <= objTop) {
						
					} else {
						if (overDiv.offsetTop >= (objTop + objHeight)) {
						} else {
							if (overDiv.offsetLeft >= (objLeft + objWidth)) {
							} else {
								obj.style.display = "none";
								overDiv._hideelements[overDiv._hideelements.length] = obj;
							}
						}
					}
				}
			}
			for (var i = 0 ;escapeElms && i < escapeElms.length ;i++){
				if (escapeElms[i]) {escapeElms[i].style.display = "";}
			}			
		}		
	};
	/**
		@see hideElement
	*/
	this.showDivOverElement = function (overDiv) {
		if (isIE && overDiv && overDiv._hideelements) {
			var count = overDiv._hideelements.length;
			for (var i = 0 ; i < count; i++){
				if (!overDiv._hideelements[i]) {continue;}
				overDiv._hideelements[i].style.display = "";
				overDiv._hideelements[i] = null;
			}
		}
	};	
	/**
		add request param to the submited form 
	*/
	this.addReqParam = function (argForm,argKey,argValue){
		var hv;
	
		if (!argValue){
			return;
		}
		
		hv = document.getElementById(argKey);		
		if(hv){
					
		}else{
			hv = document.createElement("input");
			hv.type = "hidden";
			hv.name = argKey;
			hv.id = argKey;		
			_this.appendChild(argForm,hv);								
		}
		hv.value = argValue;
		argValue = null;				
	};
	/**
		open window
	*/
	this.openNoMenuWin = function(argUrl,argWidth,argHeight){
		var win;
		var strFeature;		 
	
		strFeature = "menubar=no,toolbar=no,resizable=yes,scrollbars=yes";
		if (argWidth){
			strFeature += ",width=" + argWidth;
		}
		if (argHeight){
			strFeature += ",height=" + argHeight;
		}
		win = window.open(argUrl,"_blank",strFeature);
		
		return win;
	};
	/**
		for the bug of the MF,call function across window,it will miss
	*/
	this.transWinCall = function(argFunc){
		if (isIE){
			argFunc();
		}else{
			var flag = false;
			var inv;
			
			inv = setInterval(
				function () {
					
					argFunc();
					flag = true;
					
					if (flag) {clearInterval(inv);}	
				},1000
			);			
		}
	};	
	/**
		the method appendchild for ie has some question
	*/
	this.appendChild = function(argObj,argChild,argAfterFunc){
		if (isIE){
			var intv = setInterval(
				function(){
					if (document.readyState != "complete"){return;}
					argObj.appendChild(argChild);
					clearInterval(intv);
					intv = null;
					if (argAfterFunc){argAfterFunc();}	
				}
				,500
			);	
		}else{
			argObj.appendChild(argChild);
			if (argAfterFunc){argAfterFunc();}
		}
	};	
	/**
		this is the same as the appendChild
		appendchild to document.body,for IE has a bug
	*/		
	this.appendChildToDocBody = function(argObj,argDoc){
		if (!argDoc){
			argDoc = document;
		}
		if (isIE){
			var intv = setInterval(
				function(){
					if (argDoc.readyState != "complete"){return;}
					if(argDoc.body){
						argDoc.body.appendChild(argObj);
					}
					clearInterval(intv);
					intv = null;	
				}
				,500
			);
		}else{
			if(argDoc.body){
				argDoc.body.appendChild(argObj);
			}
		}
	};
	
	/**
		as follow register each window in the top.BASE_ENGINE's array
		
	*/
	var wins = new Array();
	var tops = new Array();
	var eves = new Map();
	
	var EVE_MOUSEDOWN = "onmousedown";
	var EVE_ONCLICK = "onclick";
	var EVE_ONUNLOAD = "onunload";
	
	var getEves = function(argEveType){
		var arr;
	
		arr = eves.get(argEveType); 
		if (!arr){
			arr = new Array();
			eves.put(argEveType,arr);
		}
		
		return arr;
	}
	
	var eve_fire = function(argType){
		var arreve;		
				
		arreve = getEves(argType);		
		for(var i = 0 ; i < arreve.length;i++){
			try{
				if (arreve[i]){arreve[i]();}			
			}catch(e){
				//the script may have been released by GC
				arreve[i] = null;
			}	
		}
	};
	/**
		register window to the array
	*/
	this.regWin = function(argWin){		
		if (-1 != wins.indexOf(argWin)){
			return;
		}
		
		wins[wins.length] = argWin;
		if (argWin.top == argWin){
			tops[tops.length] = argWin;
		}		
				
		//for events can add
		//alert(window.document.title + "|" + argWin.document.title);		
		//mousedown
		_this.addElementEvent(argWin.document,EVE_MOUSEDOWN,
				function(){						
					eve_fire(EVE_MOUSEDOWN);
				}
			);	
		
		//onclick	
		_this.addElementEvent(argWin.document,EVE_ONCLICK,
			function(){
				eve_fire(EVE_ONCLICK);
			}
		);	
	};
	
	/**
		unregister the window from the array of the window
	*/
	this.unregWin = function(argWin){
		var index;
		
		index = wins.indexOf(argWin);
		if (-1 == index){
			return;	
		}else{
			wins[index] = null;
		}		
		
		index = tops.indexOf(argWin);
		if (-1 == index){
			return;	
		}else{
			tops[index] = null;
		}
	};

	this.init = function(){				
		if (top == window){
			_this.regWin(window);	
		}else{			
			if (!top.SHELL){
				top.SHELL=new Shell();
			}
			top.SHELL.regWin(window);
			_this.addElementEvent(window,EVE_ONUNLOAD,
				function(){
					top.SHELL.unregWin(window);
				}
			);	
		}
	}	 	
	
	/**
		this register listner for each window's document's event
		@param argEveType the event type
		@param argFunc the listen function 
 	*/	
	this.addAllWinDocsListener = function(argEveType,argFunc){
		var arreve;		
	
		arreve = getEves(argEveType);
		arreve[arreve.length] = argFunc;
	};
	/**
		adjust the position if the object has out of the document
	*/
	this.adjustPosition = function (x,y,width,height){		
		var cw;
		var ch;
		
		cw = document.body.clientWidth;
		ch = document.body.clientHeight;
		//left
		if (x + width > cw) {
			x = cw - width; 
		}
		x = Math.max(0,x);
//		alert("x : height:document.body.clientWidth" + x +"|" + width + "|" + cw);
//		alert("y : height:document.body.clientHeight" + y +"|" + height + "|" + ch);
		//top		
		if (y + height > ch){
			y = ch - height ;
		}
		y = Math.max(0,y);
		
		return {"x":x,"y":y}
	};
	/**
		to adjust the iframe by its self,this window should be a iframe		
	*/
	this.adjustifrm = function (){	
		ifrm = window.frameElement;
		if (!window.parent || !ifrm){
			return;
		}
		var func = function(){		
			ifrm.style.width = "100%";
			//ifrm.style.width = window.parent.document.body.clientWidth;
			ifrm.style.height = window.parent.document.body.clientHeight;
		}
		var argEvent;
		
		argEvent = "onload";
		_this.addElementEvent(window.parent,argEvent,func);
		argEvent = "onresize";
		_this.addElementEvent(window.parent,argEvent,func);
	};
	/**
		shield the window
	*/
	this.shieldWin = function(){
		var div = _getShield();
		div.style.display = "block";
		_this.blIsShield = true;
		_adjustShield();
	};
	/**
		cancel the shield mode
	*/
	this.cancelShield = function(){	
		var div = _getShield();
		
		_this.blIsShield = false;
		div.style.display = "none";
	};
	/**
		get the main window
	*/
	this.getTopMainWin = function(){
		if (topmainwin){
			return topmainwin;
		}
		
		topmainwin = top.opener;		
		while (topmainwin && topmainwin.top.opener){
			topmainwin = topmainwin.top.opener;
		}
		if (topmainwin && !topmainwin.SHELL){
			throw new Error ("the top main window has not js engine.");
			//the follow has no use
			//topmainwin.SHELL = new Shell();
		}
		
		return topmainwin;
	};
	/**
		@deprecated this is not secure 
	*/
	this.shieldTopMain = function(){
		var topmain = _this.getTopMainWin();

		top.SHELL.shieldWin();
		if (topmain && topmain.SHELL){
			topmain.SHELL.shieldWin();
		}
	};
	/**
		@deprecated  
		@see #shieldTopMain 
	*/
	this.cancelShieldTopMain = function(){
		var topmain = _this.getTopMainWin();
	
		top.SHELL.cancelShield();
		if (topmain && topmain.SHELL){
			topmain.SHELL.cancelShield();
		}	
	};		
	this.clearTableRow = function(argTable){
		while(0 < argTable.rows.length){
			argTable.deleteRow(0);
		}		
	};
}