/**
	change ctor for
	can init a map with an specific array
	this array is with [keyvalue...]
	@require Common.js
*/
function Map(argValues){
	var _this = this;
		
	this.params = new Array();
	this.keyset = new Array();
	this.put = function (argKey,argValue){
		_this.params[argKey] = argValue;
		if (!_this.isContain(argKey)){
			_this.keyset[_this.keyset.length] = argKey;
		}		
	};
	this.get = function (argKey){
		return _this.params[argKey];
	};
	this.toKeyValueArray = function(){
		var keys = _this.keyset;
		var	arr = [];
		
		strValues = STRING_EMPTY;	
		for (var i = 0 ; i < keys.length ; i++){
			arr[arr.length] = new KeyValue(keys[i],_this.get(keys[i]));
		}
		
		return arr;
	};
	this.toString = function (argUnitSplitor,argKVSplitor){
		if (!argUnitSplitor){
			argUnitSplitor = window.SPLITOR_UNIT;
			argKVSplitor = window.SPLITOR_KEYVALUE;		
		}
	
		var keys = _this.keyset;
		var	strValues;
		
		strValues = STRING_EMPTY;	
		for (var i = 0 ; i < keys.length ; i++){
			strValues += keys[i] + argKVSplitor + _this.get(keys[i]) + argUnitSplitor;
		}
		
		return strValues;
	};
	this.isContain = function(argKey){
		return _this.keyset.indexOf(argKey) != -1;
	};
	this.remove = function(argKey){
		var index;
		
		index = _this.keyset.indexOf(argKey);
		if (-1 == index){return;}
		if (1 == _this.keyset.length){
			_this.keyset[0] = null;
			_this.keyset.length = 0;
			_this.params[0] = null;
			_this.params.length = 0;			
		}else{
			//change the last one's position to the remove one 
			_this.keyset[index] = _this.keyset[_this.keyset.length - 1];
			_this.keyset[_this.keyset.length - 1] = null;
			_this.keyset.length = _this.keyset.length - 1;
			_this.params[argKey] = null;
		}		
	};
	this.isEmpty = function(){
		return _this.keyset.length == 0;
	};	
	
	if (!argValues){
		return;
	}
	
	for (var i = 0 ; i < argValues.length; i++){
		var kv = argValues[i];
		
		if (!kv.value && 0 === kv.value){
			continue;		
		}
		_this.put(kv.key,kv.value);		
	}
}

/**
	@param argValue a key-value string
	@see common.convKVsStringToMap 
*/
Map.valueOf = function(argValue,argUnitSplitor,argKVSplitor){
	return window.JS_COMMON.convKVsStringToMap(argValue,argUnitSplitor,argKVSplitor);
};