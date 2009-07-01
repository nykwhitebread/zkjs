/**
	@require common.js base.js
*/

function ImageList()
{try{
	var item=[];
	count=0;
	this.path="";
	this.type="gif";
	this.err="";
	iml=this;
	this.copywrite="";	
	this.add=function(src,key)
	{
		var img=new Image()
		if(src==null || src=="")return;
		if(src.indexOf("/")==-1)src=iml.path+src
		//if(!(/\.gif$|\.jpg$|\.png$|\.bmp$/i).test(src))src+="."+iml.type
		if(key==null || key=="")key=src.replace(/(.*\/){0,}([^\.]+).*/ig,"$2")
		item[count]=img;img.index=count;item[key]=img;count++;
		img.onerror=function()
		{
			item[img.index]=null;item[key]=null;count--;
		}
		img.src=src;
		return img;
	}
	this.item=item;
	this.count=function(){return count;}
		
	}//end try
catch(e){
	iml.err="ImageList cause run time error!\nError number:"+e.number+".\nError description:"+e.description;
	
	return iml;
	}
}