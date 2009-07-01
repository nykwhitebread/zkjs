
/**
	@require Common.js
*/
window.AJAX_ENGINE = new AjaxEngine();
function AjaxEngine() {
		var _this=this;
		var aparams=[];
		var QUERYTYPE = "POST";
		var PREFIXCHAR = "&";
		/**
			send a ajax query	
			@param url the url of the server
			@param isNotWaitResp not wait for the response 
		*/
		this.sendQuery=function (url,isNotWaitResp,callback) {
			var postdata;
			var	jkTagXmlHttp;
		
			postdata = window.STRING_EMPTY;			
			if (!url) {
				throw new Error("url can't be null");
			}//end if			
			url = encodeURI(url);
			jkTagXmlHttp=createXMLHttpRequest();
			jkTagXmlHttp.open(QUERYTYPE, url, true);

			for (var i = 0; aparams && i < aparams.length; i++) {
				if (postdata != window.STRING_EMPTY){
					postdata = postdata + PREFIXCHAR + aparams[i].key + "=" + aparams[i].value;
				}else{
					postdata = aparams[i].key + "=" + aparams[i].value;
				}				
			}//end for
			postdata = encodeURI(postdata);
			jkTagXmlHttp.setRequestHeader("cache-control","no-cache"); 
			jkTagXmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
			if (!callback){
				callback = readyAction;
			}
			if (!isNotWaitResp){
				jkTagXmlHttp.onreadystatechange=function(){callback(jkTagXmlHttp);};					
			}	
			jkTagXmlHttp.send(postdata);
			aparams=null;			
		};//end md
		
		/**
			set the ajax query's parameters
			@param argKey the param key
			@param argValue the param value
		*/
		this.putParam=function (argKey, argValue) {
			if(0 === argValue){
				argValue = "0";
			}
			if (!argValue || !argKey){
				return;
			}
			if (!aparams) {
				aparams = [];
			}//end if
			aparams[aparams.length] = new KeyValue(argKey, argValue);
		};//end md			
		
		//should keep the XMLHttpRequest be the single one for every request
		function createXMLHttpRequest() {
			var	jkTagXmlHttp;

			jkTagXmlHttp = null;
			if (window.ActiveXObject) {
				jkTagXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} else {
				if (window.XMLHttpRequest) {
					jkTagXmlHttp = new XMLHttpRequest();
				}
			}
			
			return jkTagXmlHttp;
		}
		function readyAction(jkTagXmlHttp) {
			var data;
			
			if (4 == jkTagXmlHttp.readyState && jkTagXmlHttp.responseXML) {							
				data = jkTagXmlHttp.responseXML;
				jkTagXmlHttp=null;
			} else {
				jkTagXmlHttp=null;
				return;
			}			
		}		
}

AjaxEngine.query=function(url,datamap){
	if (datamap)
	{
		var keys=datamap.keyset;
		for(var i=0;i<keys.length;i++)
		{
			var key=keys[i];
			AJAX_ENGINE.putParam(key,datamap.get(key));
		}
	}
	AJAX_ENGINE.sendQuery(url,false,ClientParser.callback);
};
