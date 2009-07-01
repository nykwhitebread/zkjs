
function daysInMonth(year,month) {
	return 32 - new Date(year, month, 32).getDate();
}

function daysInMonthByDate(date) {
	return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
}

String.prototype.toDate = function(pattern,monthNames,monthNamesShort) {
	var dateString = this;	
	var re = /([.*+?^<>=!:${}()[\]\/\\])/g;
	var monthNamesStr
	var monthNamesShortStr;
	if (!monthNames)
	{
		monthNames = Calendar.language.months;
		monthNamesStr = monthNames.join('|');
	}
	else
	{
		monthNamesStr = monthNames.join('|').replace(re, '\\$1');
	}
	if (!monthNamesShort)
	{
		monthNamesShort = Calendar.language.months;
		monthNamesShortStr = monthNamesShort.join('|');
	}
	else
	{
		monthNamesShortStr = monthNamesShort.join('|').replace(re, '\\$1');
	}
	
	var counter=1;
	var y,m,d;
	var a,h,min;
	var shortLabel=false;
	
	pattern = pattern.replace(/([.*+?^<>=!:${}()|[\]\/\\])/g, '\\$1');
	pattern = pattern.replace(/(y+|M+|d+|a|H{1,2}|h{1,2}|m{2})/g,
		function($1) {
			switch ($1) {
	            case 'y'  :
	            case 'yy' : y=counter; counter++; return '(\\d{2})';
	            case 'MM' : m=counter; counter++; return '(\\d{2})';
	            case 'M'  : m=counter; counter++; return '(\\d{1,2})';
	            case 'd'  : d=counter; counter++; return '(\\d{1,2})';
	            case 'MMM': m=counter; counter++; shortLabel=true; return '('+monthNamesShortStr+')';
	            case 'a'  : a=counter; counter++; return '(AM|am|PM|pm)?';
	            case 'HH' :
	            case 'hh' : h=counter; counter++; return '(\\d{2})?';
	            case 'H'  :
	            case 'h'  : h=counter; counter++; return '(\\d{1,2})?';
	            case 'mm' : min=counter; counter++; return '(\\d{2})?';
			}
	        // y+,M+,d+
			var ch = $1.charAt(0);
			if (ch=='y') {y=counter; counter++; return '(\\d{4})'};
			if (ch=='M') {m=counter; counter++; return '('+monthNamesStr+')'};
			if (ch=='d') {d=counter; counter++; return '(\\d{2})'};
		}
	);

	var re = new RegExp(pattern,'i');
	var match = dateString.match(re);
	if (match!=null)
	{
		var yy = parseInt(match[y],10); if (isNaN(yy)) return null; else if (yy<70) yy+=2000; else if (yy<100) yy+=1900;
		var mm = parseInt(match[m],10); if (isNaN(mm)) mm = COJS.Calendar.getMonthByLabel(match[m], shortLabel ? monthNamesShort : monthNames); else if (--mm<0 || mm>11) return null;
		var dd = parseInt(match[d],10); if (isNaN(dd) || dd<1 || dd>daysInMonth(yy, mm)) return null;

		// time parsing
		if (min!=undefined && h!=undefined)
		{			
			var hh,mmin,aa;
			mmin = parseInt(match[min],10); if (isNaN(mmin) || mmin<0 || mmin>59) throw new Error("not a valid minute.");
			hh = parseInt(match[h],10); if (isNaN(hh)) return null;
			if (a!=undefined)
			{
				aa = match[a].toLowerCase();
				if ((aa!='am' && aa!='pm') || hh<0 || hh>12) throw new Error("not a valid hour:" + hh);
				if (aa=='pm')
				{
					hh+=12;
				} 
			}
			else if (hh<0 || hh>23) throw new Error("not a valid hour:" + hh);

			return new Date(yy, mm, dd, hh, mmin, 0);
		}
		
		return new Date(yy, mm, dd);
	}
	return null;
}

Date.prototype.format = function(pattern, monthNames, monthNamesShort) {
	var date=this;
	if (!monthNames) monthNames = Calendar.language.months;
	if (!monthNamesShort) monthNamesShort = Calendar.language.months;
	var mm; var dd; var hh; var min;
    var result = pattern.replace(/(\\\\|\\[yMdaHhm])|(y+|M+|d+|a|H{1,2}|h{1,2}|m{2})/g,
        function($1,$2,$3) {
        	if ($2) return $2.charAt(1);
			switch ($3) {
	            case 'y':
	            case 'yy':  return date.getYear().toString().slice(-2);
	            case 'M':   return (date.getMonth()+1);
	            case 'MM':  return ((mm = date.getMonth()+1)<10 ? '0'+mm : mm);
	            case 'MMM': return monthNamesShort[date.getMonth()];
		        case 'd':   return date.getDate();
	            case 'a'  : return (date.getHours()<12 ? 'AM' : 'PM');
	            case 'HH' : return ((hh = date.getHours())<10 ? '0'+hh : hh);
	            case 'H'  : return date.getHours();
	            case 'hh' : return ((hh = date.getHours())==0 ? '00' : (hh<10 ? '0'+hh : (hh>12 ? ((hh-12)<10?('0'+(hh-12)):(hh-12)) : hh)));
	            case 'h'  : return ((hh = date.getHours())==0 ? '0' : (hh>12 ? hh-12 : hh));
	            case 'mm' : return ((min = date.getMinutes())<10 ? '0'+min : min);
			}
	        // y+,M+,d+
			var ch = $3.charAt(0);
			if (ch=='y') return date.getFullYear();
			if (ch=='M') return monthNames[date.getMonth()];
			if (ch=='d') return ((dd = date.getDate())<10 ? '0'+dd : dd);
		}
	);
	return result;
};

function Calendar() {
	var calendar = this;

	var baseFunc = window.SHELL;
	var	com = window.JS_COMMON;
	var isIE = baseFunc.isIE;
	
	var WIDTH = 200;
	var STYLE_TB_TOP = "width:100%;";
	var STYLE_TB_DATE = "width:100%;border:none";
	var STYLE_TB_OUT = "border:1px solid black;width:" + WIDTH + "px;table-layout:fixed;";
	var STYLE_TD_INPUT = "border:1px solid black;";
	
	var HTML_PRE = "<font face='webdings'>3</font>";
	var HTML_PRE_UC = "&#9664;";
	var HTML_NEXT = "<font face='webdings'>4</font>";
	var HTML_NEXT_UC = "&#9654;";
	var STYLE_BTN = "cursor:pointer;width:45px;height:20px;font-size:9pt;border: 1px solid ";
	var STYLE_HM = "border:none;width:40px";
	var STYLE_HM_A = "border:none;width:56px";
	var STYLE_PNL_CALENDAR = "position: absolute;display: none;z-index: 98;background-color: #FFFFFF;border: 1px solid #CCCCCC;width:" + WIDTH + "px;font-size:9pt;";

	var shedifrm;
	var panlCanl;
	var cobYear;
	var cobMonth;
	var btnClear;
	var btnConfirm;
	var btnClose;
	var btnToday;
	var intputHM;

	var isFocus=false; 
	var inited;
    var tdate = new Date();
    var seltd;
    var curtd;
    
    var _tds = new Array();    
	var outtable ;
	var outTd;
	var toptb,topTr,cellPre,cellYear,cellMonth,cellNext;
	var btnTb,clearTd,todayTd,okTd,closeTd;
	var btnPreMonth;
	var btnNextMonth;
	var dateTr;
	var dateTd;
	var inputTd;	
	var tbDate;
	var visible;
    
	this.beginYear = tdate.getFullYear() - 50;
	this.endYear = tdate.getFullYear() + 50;
	this.dateFormatStyle = "yyyy-MM-dd HH:mm";

	var _create = function (){		
		panlCanl = _$("div");
		panlCanl.style.display = "none";
		baseFunc.setStyle(panlCanl,STYLE_PNL_CALENDAR);	
		baseFunc.appendChildToDocBody(panlCanl);	
		
		return panlCanl;
	};
	
	var _setYearValue = function(argValue){
		  var index;
		  var item;
		  
		  if (!isNum(argValue) || argValue <= 0 || argValue > 285616){		  	
		  	return false;
		  }
		  index = cobYear.indexOfValue(argValue);
		  if (-1 == index){
			item = new SelectItem(argValue);
			cobYear.addItem(item);
			cobYear.setSelectItem(item,true);
		  }else{
		  	cobYear.setSelectValue(argValue,true);
		  } 
		  
		   return true;
	};	
	
	var _renderTds = function(){
		for(var i = 0; i < _tds.length; i++) {
			if (!_tds[i].data){
				return;
			}
			_refeshCell(_tds[i]);						    			

			if (curtd){curtd.style.backgroundColor = calendar.colors["cur_bg"];}
			 	
			if (seltd){seltd.style.backgroundColor = calendar.colors["sel_bg"];}	
			    	
			_tds[i].onclick = function () {
					if (this.data == "&nbsp;" || this.data == STRING_EMPTY){
						return;
					}
					_refeshCell(seltd);					
					if (seltd == curtd && curtd){
						curtd.style.backgroundColor = calendar.colors["cur_bg"];
					}
			    	seltd = this;
			    	seltd.style.backgroundColor = calendar.colors["sel_bg"]	        
			 }	      	
			 _tds[i].onmouseover = function () {
			 	if (this.data == "&nbsp;"){
						return;
					}
			    	if (seltd == this || curtd == this){
			    		return;
			    	}
			      this.style.backgroundColor = calendar.colors["td_bg_over"];
			    }
			 _tds[i].onmouseout = function () {
			 		if (this.data == "&nbsp;"){
						return;
					}
			    	if (seltd == this || curtd == this){
			    		return;
			    	}
			    	_refeshCell(this);
			 }		 
		}//end for	
	};
	
	var _refeshCell = function(argCell){
		if (!argCell){return;}
		
		argCell.style.backgroundColor = calendar.colors["td_bg_out"];
	};
		
	var _refresh = function(){	  	
	  	_refeshCell(seltd);
	  	_refeshCell(curtd);
	  	seltd = curtd = null;
		calendar.changeSelect();
	  	calendar.bindData();	  		
	};
	
	var _isShowhm = function(){
		return -1!=calendar.dateFormatStyle.indexOf("m");
	};
	
	var _isShowap = function(){
		return -1!=calendar.dateFormatStyle.indexOf("a");
	};
	
	var _getHMValue = function(){
		var hs = calendar.date.getHours();
		var ms = calendar.date.getMinutes();
		var ap = "";
		var blhm = _isShowhm();
		var blhma = _isShowap();

		if (!blhm)
		{
			throw new Error("the datepatther need not show hhmm.");
		}
		if (blhma)
		{			
			if (12 < hs)
			{
				hs = hs - 12;
				ap = "PM";
			}else{
				ap = "AM";
			}			
		}
		hs = (10<=hs?hs:("0"+hs));	
		ms = (10<=ms?ms:("0"+ms));	
		
	  	var str = hs + ":" + ms + ap;
	  		  	
	  	return str;
	};
	
	var _isCurDay = function(argTdData){
		try{
			var tday;
			
			tday = new Date();
			return (tday.getFullYear() == calendar.date.getFullYear() &&
		    		tday.getMonth() == calendar.date.getMonth() &&
		    		tday.getDate() == argTdData);
	    }catch(ex){
	    	return false;
	    }		
	};
	
	var _isSelDay = function(argTdData){
		try{		
		 	var value = new Date(calendar.date.getFullYear(),
		                 calendar.date.getMonth(),
		                 argTdData).format("yy-MM-dd");
		    var inputvalue = _getValue().toDate(calendar.dateFormatStyle).format("yy-MM-dd");  
		    
		               
		    return inputvalue == value;             
	    }catch(ex){
			return false;	    
	    }
	};
	
	var _getValue = function(){
		return calendar.dateControl.value;
	};
	
	var _setValue = function(argValue){
		calendar.dateControl.value = argValue;	
	};
	
	var isNum = function(argNum){
	   if (0 !=argNum && !argNum){
	   		return false;
	   }
	   
	   if ("" == argNum) {return false;}
	   
	   return !isNaN(new Number(argNum));
	};
	
	var _valideHM = function(event){		
		var e = "not valide";
		var v = false;		
		var hm = intputHM.value;
		
		if (_isShowap()){
			if (7!=hm.length)
			{
			}else{
				var ap = hm.substring(5);				
				if ("PM"!=ap && "AM"!=ap)
				{
					
				}else{
					var hh = hm.substring(0,2);
					var mmin = hm.substring(3,5);
					
					if(!isNum(hh) || !isNum(mmin)){
						
					}else if ("PM" == ap && (11<hh || 1>hh)){
						e = "PM hours must between 1 to 11.";
					}else if ("AM" == ap && (12<hh || 0>hh)){
						e = "AM hours must between 0 to 12.";
					}else if(59<mmin || 0>mmin){
						e = "minutes must between 0 to 59.";
					}else{
						if ("PM"==ap) hh = new Number(hh) + 12;
						
						calendar.date.setHours(hh);
						calendar.date.setMinutes(mmin);
						v = true;
					}
				}
			}
		}else{
			if (5!=hm.length)
			{
			}else{
				var hh = hm.substring(0,2);
				var mmin = hm.substring(3,5);
				
				if(!isNum(hh) || !isNum(mmin)){
					
				}else if (23<hh || 0>hh){
					e = "hours must between 0 to 23.";
				}else if(59<mmin || 0>mmin){
					e = "minutes must between 0 to 59.";
				}else{					
					calendar.date.setHours(hh);
					calendar.date.setMinutes(mmin);
					v = true;
				}
			}
		}		
		
		return {"v":v,"e":e}
	};
	
	this.dateControl = null;
	this.form  = null;
	
	this.date = new Date();
	this.year = this.date.getFullYear();
	this.month = this.date.getMonth();
	
	this.colors = {
	"cur_word"      : "#FFFFFF",  
	"cur_bg"        : "#00FF00",  
	"sel_bg"        : "#FFCCCC",  
	"sun_word"      : "#FF0000",  
	"sat_word"      : "#0000FF",  
	"td_word_light" : "#333333",  
	"td_word_dark"  : "#CCCCCC",  
	"td_bg_out"     : "#EFEFEF", 
	"td_bg_over"    : "#FFCC00",  
	"tr_word"       : "#FFFFFF",  
	"tr_bg"         : "#666666",  
	"input_border"  : "#CCCCCC",  
	"input_bg"      : "#EFEFEF"   
	}
	
	this.isVisible = function(){
		return visible;
	};
	
	/**
		this method has a problem,the id of the control is fixed
		this means you should only create one calendar in one dom,
		but on the other side,this is the right	resolvent
	*/
	this.draw = function() {		
		var STYLE_TD_SUN = 	"text-align:center;font-size:9pt;cursor:default;color:" + calendar.colors["sun_word"] + ";";
		var STYLE_TD_SAT =  "text-align:center;font-size:9pt;cursor:default;color:" + calendar.colors["sat_word"] + ";";
		var STYLE_TD_HEAD = "text-align:center;font-size:9pt;font-weight:normal;background-color:" + calendar.colors["tr_bg"] + ";color:" + calendar.colors["tr_word"] + ";";
		var STYLE_TD_DATE = "text-align:center;font-size:9pt;cursor:default;";
				
		var STYLE_BTN_PRE = "cursor:pointer;border: 1px solid " + calendar.colors["input_border"] + ";background-color:" + calendar.colors["input_bg"] + ";width:16px;height:20px;"; 
		var STYLE_BTN_NEXT = "cursor:pointer;border: 1px solid " + calendar.colors["input_border"] + ";background-color:" + calendar.colors["input_bg"] + ";width:16px;height:20px;";

		
		
		_create();
		outtable = _$("table");
		outtable.cellpadding = "0";
		outtable.cellspacing = "0";
		outTd = outtable.insertRow(-1).insertCell(-1);
		outTd.vAlign = "top";
		outTd.align = "center";
		toptb = _$("table");
		toptb.cellpadding = "0";
		toptb.cellspacing = "0";
		baseFunc.setStyle(toptb,STYLE_TB_TOP);
		
		topTr = toptb.insertRow(-1);
		cellPre = topTr.insertCell(-1);
		cellYear = topTr.insertCell(-1);
		cellMonth = topTr.insertCell(-1);
		cellNext = topTr.insertCell(-1);
				
		btnPreMonth = _$("button");
		btnNextMonth = _$("button");
		if (isIE){
			btnPreMonth.innerHTML = HTML_PRE;		
			btnNextMonth.innerHTML = HTML_NEXT;		
		}else{
			btnPreMonth.innerHTML = HTML_PRE_UC;		
			btnNextMonth.innerHTML = HTML_NEXT_UC;		
		}		
		baseFunc.setStyle(btnPreMonth,STYLE_BTN_PRE);
		baseFunc.setStyle(btnNextMonth,STYLE_BTN_NEXT);
		
		cobYear = new ComboBox(cellYear,70,16);
		cobYear.setSearchable(false); 
		cobYear.setEditable(true); 
		cobYear.setEnable(true);	  
		
		cellPre.appendChild(btnPreMonth);
		cellNext.appendChild(btnNextMonth);
		
		outTd.appendChild(toptb);		
		
		cobMonth = new ComboBox(cellMonth,70,16); 
		cobMonth.setSearchable(false); 
		cobMonth.setEditable(false); 
		cobMonth.setEnable(true); 
		
		cobYear.onSelectChanged = function () {calendar.update(calendar);};
		//the edit finished event
		cobYear.onEditfinished = function(e){			  	
			if (!_setYearValue(e.edit.value)){	   	  
		 	  	e.edit.value = calendar.year;
		 	  	return;
		 	}  	  	
			  
			calendar.update();		 
		 };
		cobMonth.onSelectChanged = function () {calendar.update(calendar);};	
		
		
		btnPreMonth.onclick = function () {calendar.goPrevMonth(calendar);};
		btnPreMonth.onblur = function () {calendar.onblur();};
		
		btnNextMonth.onclick = function () {calendar.goNextMonth(calendar);};
		btnNextMonth.onblur = function () {calendar.onblur();};
			
		//date		
		tbDate = _$("table");
		tbDate.cellpadding = "0";
		tbDate.cellspacing = "1";
		baseFunc.setStyle(tbDate,STYLE_TB_DATE);
		
		dateTr = tbDate.insertRow(-1);
		//head
		for(var i = 0; i < 7; i++) {
			dateTd = dateTr.insertCell(-1);
			baseFunc.setStyle(dateTd,STYLE_TD_HEAD);
			dateTd.innerHTML = Calendar.language["weeks"][i];
		}
		
		for(var i = 0; i < 6;i++){
			dateTr = tbDate.insertRow(-1);
			for(var j = 0; j < 7; j++){
				dateTd = dateTr.insertCell(-1);											
				if (i == 5 && 6 >= j && j >= 5  ){
		    		if (j == 5){
		    			inputTd = dateTd;
		    			inputTd.colSpan = 2;
		    			baseFunc.setStyle(dateTd,STYLE_TD_INPUT);
		    		}else{
		    			dateTd.style.display = "none";
		    		}	    				    			    			
		    	}else{		    			   
		    		_tds[_tds.length] = dateTd;		 		
		    		if (j == 0){
			        	baseFunc.setStyle(dateTd,STYLE_TD_SUN);
				    }else if(j == 6) {
				        baseFunc.setStyle(dateTd,STYLE_TD_SAT);
				    } else {
				        baseFunc.setStyle(dateTd,STYLE_TD_DATE);
				    }
		    	}		    		
			}
		}
		
		outTd.appendChild(tbDate);	
		
	 	intputHM = _$("input");
	 	intputHM.type = "text";	 
	 	intputHM.maxLength = 5;	
		baseFunc.setStyle(intputHM,STYLE_HM);
		//baseFunc.appendChildToDocBody(intputHM);
		inputTd.appendChild(intputHM);
		
		btnTb = _$("table");
		btnTb.cellpadding = "0";
		btnTb.cellspacing = "1";
		baseFunc.setStyle(btnTb,STYLE_TB_DATE);
		btnTb.insertRow(-1);
		clearTd = btnTb.rows[0].insertCell(-1);
		todayTd = btnTb.rows[0].insertCell(-1);
		okTd = btnTb.rows[0].insertCell(-1);
		closeTd = btnTb.rows[0].insertCell(-1);
		
		outTd.appendChild(btnTb);
		panlCanl.appendChild(outtable);	

		btnClear = _$("button");		
		btnToday = _$("button");
		btnConfirm = _$("button");		
		btnClose = _$("button");
		
		STYLE_BTN += calendar.colors["input_border"] + ";background-color:" + calendar.colors["input_bg"] + ";";
		baseFunc.setStyle(btnClear,STYLE_BTN);
		baseFunc.setStyle(btnToday,STYLE_BTN);
		baseFunc.setStyle(btnConfirm,STYLE_BTN);
		baseFunc.setStyle(btnClose,STYLE_BTN);
		
		btnClear.innerHTML = Calendar.language["clear"];
		btnToday.innerHTML = Calendar.language["today"];
		btnConfirm.innerHTML = Calendar.language["ok"];
		btnClose.innerHTML = Calendar.language["close"];
		
		clearTd.appendChild(btnClear);	
		todayTd.appendChild(btnToday);	
		okTd.appendChild(btnConfirm);	
		closeTd.appendChild(btnClose);	
		
		btnClear.onclick = function () {_setValue(STRING_EMPTY);calendar.hide();return false;}
		
		btnClose.onclick = function () {calendar.hide();return false;}
		
		btnToday.onclick = function () {
			var today = new Date();
			_setValue(today.format(calendar.dateFormatStyle));
			calendar.hide();
			return false;
		};
		
		btnConfirm.onclick = function(){
			if (seltd && calendar.dateControl != null){
				_setValue(new Date(calendar.date.getFullYear(),
				                     calendar.date.getMonth(),
				                     seltd.data,calendar.date.getHours(),calendar.date.getMinutes()).format(calendar.dateFormatStyle));
			}
			calendar.hide();
			return false;
		}; 		
			
		intputHM.onblur = function(){
			intputHM.value=intputHM.value.toUpperCase();
			var ve = _valideHM();
			if (!ve.v){					
				alert(ve.e);										
				intputHM.focus();
				
				return false;
			}				
		}; 
	};	

	//bind select
	this.bindYear = function() {
	 	//var cy = this.form.%%;
		for (var i = calendar.beginYear; i <= calendar.endYear; i++){
			cobYear.addItem(new SelectItem(i, i));
		}
		cobYear.setSelectValue((new Date()).getFullYear(),true);
	};
	
	//bind select
	this.bindMonth = function() {
		for (var i = 0; i < 12; i++){
		 cobMonth.addItem(new SelectItem(Calendar.language["months"][i], i));	    
		}
		cobMonth.setSelectValue((new Date()).getMonth(),true);
	};
	
	this.goPrevMonth = function(e){
	  //if (this.year == this.beginYear && this.month == 0){return;}
	  calendar.month--;
	  if (calendar.month == -1) {
	    calendar.year--;
	    calendar.month = 11;
	  }
	  try{
	  	calendar.date = new Date(calendar.year, calendar.month, 1);
	  }catch(ex){
	  	alert("illegal date!");
	  }	
	  _refresh();
	};
	
	this.goNextMonth = function(e){
	  //if (this.year == this.endYear && this.month == 11){return;}
	  calendar.month++;
	  if (calendar.month == 12) {
	    calendar.year++;
	    calendar.month = 0;
	  }
	  try{
	  	calendar.date = new Date(calendar.year, calendar.month, 1);
	  }catch(ex){
	  	alert("illegimate date!");
	  }
	  _refresh();
	};
	
	this.changeSelect = function() {
    	if (!_setYearValue(calendar.date.getFullYear())){
    		throw new Error("illegal date.");
    	}
	    cobMonth.setSelectValue(this.date.getMonth(),true);
	};
	
	this.update = function (){
	  calendar.year  = cobYear.selectItem.value;
	  calendar.month = cobMonth.selectItem.value;
	  calendar.date = new Date(calendar.year, calendar.month, 1);	 
	  _refresh();
	};
	
	this.bindData = function () {
	  var dateArray = calendar.getMonthViewArray(calendar.date.getFullYear(), calendar.date.getMonth());
	  for(var i = 0; i < _tds.length; i++) {	  		  
	    if (i > dateArray.length - 1) break;
	    _tds[i].data = dateArray[i];
	    _tds[i].innerHTML = dateArray[i];
    	//equal the input 
		if (calendar.dateControl != null && _isSelDay(_tds[i].data)) {
		     seltd = _tds[i];           
			 _tds[i].style.backgroundColor = calendar.colors["sel_bg"];
		}	
	    		
		//today
		if (_isCurDay(_tds[i].data)) {
		      curtd = _tds[i];
		      _tds[i].style.backgroundColor = calendar.colors["cur_bg"];			      
		}
	  }
	};		

	this.getMonthViewArray = function (y, m) {
	  var mvArray = [];
	  var dayOfFirstDay = new Date(y, m, 1).getDay();
	  var daysOfMonth = new Date(y, m + 1, 0).getDate();
	  for (var i = 0; i < 42; i++) {
	    mvArray[i] = "&nbsp;";
	  }
	  for (var i = 0; i < daysOfMonth; i++){
	    mvArray[i + dayOfFirstDay] = i + 1;
	  }
	  return mvArray;
	};
	
	this.getElementById = function(id){
	  if (typeof(id) != "string" || id == "") return null;
	  if (document.getElementById) return document.getElementById(id);
	  if (document.all) return document.all(id);
	  try {return eval(id);} catch(e){ return null;}
	};
	
	this.getElementsByTagName = function(object, tagName){
	  if (document.getElementsByTagName) return document.getElementsByTagName(tagName);
	  if (document.all) return document.all.tags(tagName);
	};
	
	//get the absolute postion
	this.getAbsPoint = function (e){
		var x = e.offsetLeft;
		var y = e.offsetTop;
		
		while(e = e.offsetParent){
		  x += e.offsetLeft;
		  if (e.style.overflow=="auto"){
		    x-=e.scrollLeft;		  
		  }
		  y += e.offsetTop;
		  if (e.style.overflow=="auto"){
		    y-=e.scrollTop;		  
		  }
		}		
		
		return {"x": x, "y": y};
	};

	this.show = function (argx,argy,dateObj, popControl) {
		if (!inited){
			alert("you should call init() first.");
			
			return;
		}
		if (visible){
			return;
		}
						
		calendar.dateControl = dateObj;
		calendar.date = (dateObj.value.length > 0) ? new Date(dateObj.value.toDate(calendar.dateFormatStyle)) : new Date() ;
		calendar.year = calendar.date.getFullYear();
		calendar.month = calendar.date.getMonth();
		if (_isShowhm())
		{
			intputHM.value = _getHMValue();	
			if (_isShowap())
			{
				baseFunc.setStyle(intputHM,STYLE_HM_A);	
				intputHM.maxLength = 7;
			}else{
				baseFunc.setStyle(intputHM,STYLE_HM);
				intputHM.maxLength = 5;
			}
			intputHM.style.display="";
		}else{			
			intputHM.style.display="none";
		}
		
		if (!_setYearValue(calendar.date.getFullYear())){
			calendar.date = new Date();
		}
		_refresh();
		_renderTds();
		//}
		if (popControl == null){
		  popControl = dateObj;
		}
		var xy;
		panlCanl.style.display = "block";
		//adjust position	
		if (!argx || !argy){
			xy = calendar.getAbsPoint(popControl);
		}else{
			xy = {"x":argx,"y":argy};
		}	 
		panlCanl.style.left = xy.x + "px";		
		panlCanl.style.top = (xy.y + dateObj.offsetHeight) + "px";	
		
		dateObj.onblur = function(){calendar.onblur();}
		panlCanl.onmouseover = function(){isFocuss=true;}
		panlCanl.onmouseout = function(){isFocus=false;}
		  //backup the hided select 
		baseFunc.showDivOverElement(panlCanl);
		baseFunc.hideDivOverElement(null,panlCanl);
		visible = true;
	};
	
	//hide
	this.hide = function() {
		visible = false;
		panlCanl.style.display = "none";
		isFocus=false;
		baseFunc.showDivOverElement(panlCanl);
	};
	
	//
	this.onblur = function() {
	    //if(!isFocus){calendar.hide();}
	};
	
	this.init = function(){
		if (inited){
			return;
		}
		inited = true;
		calendar.draw();
		calendar.bindYear();
		calendar.bindMonth();		
	};
}

Calendar.language = {
	"year":"",
//	"months" : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	"months" : ["01","02","03","04","05","06","07","08","09","10","11","12"],
	"weeks" : ["Sun","Mon","Tue","Wed","Tur","Fri","Sat"],
	"clear":"clear",
	"today":"today",
	"close":"close",
	"ok":"confirm"
};

window.CALENDAR = new Calendar();