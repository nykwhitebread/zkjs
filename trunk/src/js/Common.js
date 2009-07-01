
/**
	the common function 
	@require none
	@author Joker	
	@remark this function should not use any other function object
*/

window.STRING_EMPTY = "";
window.STRING_SPACE = " ";
window.STRING_NEWLINE = "\n";
window.SPLITOR_UNIT = "_;_";
window.SPLITOR_KEYVALUE = "_=_";

/**
	var for debug
*/
window.JS_COMMON = new CommonFunction();
String.prototype.trim = function () {
	var str = this;
	return str.toString().replace(/(^\s*)|(\s*$)/g, "");
};
String.prototype.endWith = function (argString) {
	var str = this;
	return (str.length - 1) == str.lastIndexOf(argString);
};
String.prototype.hasValue = function(){
	return null != this && STRING_EMPTY != this;
};
Array.prototype.indexOf = function(argObj){
	var arr = this;
	var tcount;
	
	tcount = arr.length;
	for (var i = 0 ; i < tcount; i++){
		if (argObj == arr[i]){
			return i;
		}
	}
	
	return -1;
};

/**
	equal to document.getElementById("")
*/
function $(argId) {
  return document.getElementById(argId);	
}

/**
	equal to document.createElement(argTag)
*/
function _$(argTag){
	return document.createElement(argTag);
}

/**
	is a number type
*/
function isNum(argNum){
   if (0 !=argNum && !argNum){
   	return false;
   }
   
   if (STRING_EMPTY == argNum) {return false;}
   
   return !isNaN(new Number(argNum));	
}

/**
	common function object
*/
function CommonFunction() {
	var _this = this;	
	
	/**
		get the object's string
		@return ust return STRING_EMPTY if it is null
	*/
	this.getString = function (argObj) {
		if (0 === argObj){
			argObj = "0";
		}
		
		return argObj ? argObj.toString() : STRING_EMPTY;
	};//end md
	/**
		put value to the array,if the value is null,will not do anything
		@param argArray the array
		@param argValue the value 
	*/
	this.putToArray = function (argArray, argValue) {
		if (!argValue && argValue != 0) {
			return;
		}
		argArray[argArray.length] = argValue;
	};
	/**
		@param argdata the key-value data
		@return the map of the key-values 
	*/
	this.reverseCookie = function (argdata) {
		var	SPLITOR_KVS = ";";
		var	SPLITOR_KV = "=";
		return _this.convKVsStringToMap(SPLITOR_KVS,SPLITOR_KV);
	};
	this.convKVsStringToMap = function(argdata,argKVs_Splitor,argKV_Splitor){
		var keyvalues;
		var strs;
		var map;
		var	SPLITOR_KVS = argKVs_Splitor;
		var	SPLITOR_KV = argKV_Splitor;
		
		if (!argKVs_Splitor){
			SPLITOR_KVS = window.SPLITOR_UNIT;
			SPLITOR_KV = window.SPLITOR_KEYVALUE;
		}
		map = new Map();
		
		if (null == argdata){
			return map;
		}
		keyvalues = argdata.split(SPLITOR_KVS);
		for (var i = 0; i < keyvalues.length; i++) {
			if (!keyvalues[i]) {
				continue;
			}
			strs = keyvalues[i].split(SPLITOR_KV);
			if (strs.length != 2) {
				throw "convKVsStringToMap:wrong data:" + argdata;
			}
			
			map.put(strs[0],strs[1]);
		}
		
		return map;	
	};	
	/**
		get the current local milliseconds of the day
	*/
	this.getCurrentMillisecond = function () {
		var datenow;
		var ms;
		datenow = new Date();
		ms = datenow.getHours() * 60 * 60 * 1000 + datenow.getMinutes() * 60 * 1000 + datenow.getSeconds() * 1000 + datenow.getMilliseconds();
		datenow = null;
		return ms;
	};//end md
	this.newGUID = function (){
		return _this.getCurrentMillisecond();
	};
	/**
		get the all htmltext of an element,the element must be created by the same document
		which the caller of function in
		@deprecated if the element has been a child of some element,should not use this method 
		@param argElement 
 	*/
	this.getElementAllHTML = function (argElement) {
		var html;
		var tmp = document.createElement("div");
		var div = document.createElement("div");
		var oparent = argElement.parentNode;
		if (oparent) {
			oparent.replaceChild(tmp, argElement);
		}
		div.appendChild(argElement);
		html = div.innerHTML;
		//backup the place
		if (oparent) {
			oparent.replaceChild(argElement, tmp);
		}
		return html;
	};
	/**
		set the object 's value if the value is a not null value
	*/
	this.setValue = function (argObj, argValue) {
		if ((argObj && argValue != null) || argValue === 0) {
			argObj = argValue;
		}
	};
	/**
		put in the array with a key-value item
		the array is contains of KeyValues objects
	*/
	this.putArrParam = function (argArr,argKey,argValue){
		if ((!argValue || argValue == 'null') && argValue != 0){
			return;
		}
		argArr[argArr.length] = new KeyValue(argKey,argValue);
	};
	/**
		append the params in the map to the url
		will not check if there is a same key in the url
	*/
	this.addMapToUrl = function(url,argMap){
		if (!argMap || !url){
			return url;
		}
	
		var keys;
		var prefix;
		
		prefix = (-1 != url.indexOf("?"))?"&":"?";
		keys = argMap.keyset;
		for (var i = 0; i < keys.length;i++){
			var value;
			
			value = argMap.get(keys[i]);
			if (!value && value != 0){continue;}
			url += prefix + keys[i] + "=" + value;
			prefix = "&";
		}
		
		return url; 
	};		
	this.convPxToNumber = function (argPx){
		return new Number(argPx.replace("px",STRING_EMPTY));
	};
	/**
		get the left of the element
	*/
	this.getPixLeft = function (argObj){
		var pixleft;
		
		pixleft = 0;
		while(argObj){
			pixleft += argObj.offsetLeft;
			argObj = argObj.offsetParent;
		};
		
		return pixleft;
	};
	/**
		get the top of the element
	*/
	this.getPixTop = function(argObj){
		var pixtop;
		
		pixtop = 0;
		while(argObj){
			pixtop += argObj.offsetTop;
			argObj = argObj.offsetParent;
		};
		
		return pixtop;
	};
	/**
		return the k-v item's index in the k-v array by the given key
		return -1 if not founded
	*/	
	this.getKVIndexByKey = function (argArray,argKey){
		for (var i = 0 ; i < argArray.length; i++){
			if (argArray[i] && argArray[i].key == argKey){
				return i;
			}
		}
		
		return -1;
	};
	/**
		return the k-v item of the k-v array by the given key
	*/	
	this.getKVItemByKey = function (argArray,argKey){
		var index = _this.getKVIndexByKey(argArray,argKey);
		
		if (-1 == index) {throw "can't find this item.";}
		
		return argArray[index];
	};	
}//end cs


//Key-value
function KeyValue(key, value) {
	this.key = key;
	this.value = value;
}//end cs
