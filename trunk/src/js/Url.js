/**
	
	@require base
*/
function Url(argOrginUrl){
	var _this = this;
	var params = new Map();
	var baseurl = null;
	
	this.putParam = function(argKey,argValue){
		if (argKey && argValue){
			params.put(argKey,argValue);
		}
	};
	this.getParam = function(argKey){
		return params.get(argKey);
	};

	this.toString = function(){
		var keys = params.keyset;	
		var url = baseurl;
		var qs = "?";
		for (var i = 0 ; i < keys.length ; i++){
			var value = params.get(keys[i]);
			if (value === 0 || value){
				url=url+qs+keys[i]+"="+value;				
			}
			qs="&";
		}	
	};
	
	if (!argOrginUrl || ""==argOrginUrl){
		throw new Error("orgin url null.");
	}
	var index = argOrginUrl.indexOf("?");
	if (-1 != index){
		baseurl = argOrginUrl.substring(0,index);
		if (index + 1 < argOrginUrl.length - 1){
			var querystring = argOrginUrl.substring(index + 1);
			var kvss = querystring.split("&");
			for (var i = 0 ; i < kvss.length ; i++){
				var kvs = kvss[i].split("=");
				if (1 >= kvs.length) {continue;}
				_this.putParam(kvs[0],kvs[1]);		
			}					
		}			
	}else{
		baseurl = argOrginUrl;
	} 	
}