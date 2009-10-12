/**
 * @configbegin
 * 
 * @configend
 */
(function() {
	function createXMLHttpRequest() {
		var xmlHttp;

		xmlHttp = null;
		if (window.ActiveXObject) {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		} else {
			if (window.XMLHttpRequest) {
				xmlHttp = new XMLHttpRequest();
			}
		}

		return xmlHttp;
	}	
	window.zk.Ajax = {
		request : function(ops) {
			var xmlHttp;
			var url=ops.url;
			var postdata = '';
			var aparams=ops.params;
			if (!url) {
				throw new Error("url can't be null");
			}
			xmlHttp = createXMLHttpRequest();
			for (var k in aparams) {
				if (postdata != '') {
					postdata = postdata + '&' + k + "=" + aparams[k];
				} else {
					postdata = k + "=" + aparams[k];
				}
			}
			postdata = encodeURI(postdata);
			url = encodeURI(url);
			xmlHttp.open('post', url, true);
			xmlHttp.setRequestHeader("cache-control", "no-cache");			
			xmlHttp.setRequestHeader("Content-Type",'application/x-www-form-urlencoded;charset=' + (ops.charset?ops.charset:'utf-8'));
			if (ops.ok) {
				xmlHttp.onreadystatechange = function() {
					if (4 == xmlHttp.readyState && (xmlHttp.responseXML || xmlHttp.responseText)) {
						ops.ok(xmlHttp);						
					} else {						
						return;
					}
				};
			}
			xmlHttp.send(postdata);
		}
	}
})();
