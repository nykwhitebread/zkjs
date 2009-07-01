/**
	the treenode
	@param argTree the tree of the node stand in
	@param text caption of the node show on the
	@param key a unique key in the whole tree for this node,and can find this node by the key
	@param ico the image of this node
	@param exeCategory the behavior type when the node is clicked,default is "js",another type is "expand",then when you click the node ,the tree will be expanded(if it has children)
	@param exeArg the arg you want to pass to when the node is clicked
	@param argExpandStyle "always" or "auto"(default),it is useful set to "always" when this is a lazy-loading node(such as ajax-loading)
	@param argNodeData any data you want to tag to this node,then you can use node.nodedata to read this data
	@param argStyle the text style of this node
	@param argType Tree.CHECKBOX or Tree.RADIOBOX
	@require [base] Tree.js
*/

function TreeNode(argTree,text,key,ico,exeCategory,exeArg,argExpandStyle,argNodeData,argStyle,argType)
{	
	var baseFunc=window.SHELL;
	var tree=argTree;
	this.tree=tree;
	
	var node=this;
	//keydex is the index and key of every node,but is not really the index
	var	keydex;
	node.keydex=null;
	//nbody is the nodebody
	var nbody=document.createElement("span");
	var container=document.createElement("span");
	baseFunc.insertAdjacentElement(container,"afterBegin",nbody);
	node.body=nbody;
	node.container=container;
	
	//the result :<div><span><img:expand><img:icon><span>text</span></span>...</div>

	var STYLE_NODE = "color:#000000;";
	
	node.first=node.last=node.next=node.prev=null;
	node.caption=text;	
	node.tier=null;
	node.parent=null;
	node.hasChild=false;
	node.labstyle=null;
	node.nodedata=argNodeData;
	node.type=argType;

	var depth;
	depth=tree.depth;	
	var label=document.createElement("span");
//	label.type="text";	
	baseFunc.setStyle(container,"margin:0px;padding:0px;white-space:nowrap;");
	
	baseFunc.insertAdjacentElement(nbody,"beforeEnd",label);
	baseFunc.setStyle(nbody,"margin:0px;cursor:default;text-align:left;color:black;font-size:9pt;");
	
	var icon=new Image();
	icon.align="absmiddle";
	node.label=label;
	node.icon=icon;
	//alert(ico);
	ico=ico==null||ico==""?"default":ico;		
	if(typeof(ico)=="string")
	{
		//1113:comment reason:image file extention may not be a regular but a url 
		if(ico.toLowerCase().indexOf(".")!=-1)
		{				
			ico=tree.imageList.add(ico).index;
		}
	}
	if(tree.icons[ico]!=null)		
	{	
		icon.src=tree.icons[ico].src;
		baseFunc.insertAdjacentElement(nbody,"afterBegin",icon)
	}
	//lable is the text	
	
	baseFunc.setStyle(label,tree.labelStyle);	
	this.setStyle = function(astyle){
		if (!astyle){
			if (node.labstyle){
				baseFunc.setStyle(label,node.labstyle);
			}else{
				return;
			}			
		}
		if (astyle){
			node.labstyle = argStyle;
			baseFunc.setStyle(label,astyle);
		}
//		label.style.borderStyle="none";	
//		label.style.width="1px";
//		label.style.overflowX="visible";		
	};
	if (argStyle){
		node.setStyle(argStyle);		
	}else{
		node.setStyle(STYLE_NODE);		
	}
	
	//Joker:		
	//text[div]
	label.onclick=function()
	{
		//var event = arguments[0] || window.event;		
		tree.run(node.select);
		if(tree.run(node.onclick)) 
		{
			if(tree.run(tree.onclick,node)) {tree.run(node.execute);}
		}//end if
	}//end md		

	label.ondblclick=function()
	{
		if(tree.run(node.ondblclick,node))
		{
			tree.run(tree.ondblclick,node);
		}//end if	
	};//end md
	
	label.onmouseover=function()
	{
		//out
		return;
		var event = arguments[0] || window.event;
		if(event.fromElement!=node.icon)
		{
			if(tree.run(node.onmouseover)) 
			{
				tree.run(tree.onmouseover,node);
			}//end if
		}//end if
	};//end md		
	
	label.onmouseout=function()
	{
		//out
		return;
		var event = arguments[0] || window.event;
		if(event.toElement!=node.icon)
		{
			if(tree.run(node.onmouseout))
			{
				tree.run(tree.onmouseout,node);
			}//end if
		}//end if
	}//end if
				
	label.onmousemove=function()
	{				
		//if(tree.run(node.onmousemove)) {tree.run(tree.onmousemove,node);}
	}//end md
	
	label.onmousedown=function()
	{
		//if(tree.run(node.onmousedown)) {tree.run(tree.onmousedown,node);}
	}//end md
	
	label.onmouseup=function()
	{
		//if(tree.run(node.onmouseup)) {tree.run(tree.onmouseup,node);}
	}//end md	
	
	label.onkeypress=function()
	{
		//if(tree.run(node.onkeypress)) {tree.run(tree.onkeypress,node);}
	}//end md			
	
	label.onkeydown=function()
	{
		//out
		return;
		var event=arguments[0]||window.event;
		if(tree.run(node.onkeydown)) 
		{
			if(tree.run(tree.onkeydown,node)) 
			{
				//doKeyDown(event,node);
			}//end if
		}//end if
	}//end if
	
	//onkeyup=function(){if(tree.run(node.onkeyup))tree.run(tree.onkeyup,node)}
	label.onfocus=function(){if(tree.run(node.onfocus)){if(tree.run(tree.onfocus,node))tree.doFocus(node);}}
	label.onblur=function(){if(tree.run(node.onblur)){if(tree.run(tree.onblur,node))tree.doBlur(node);}}

	
	//icon[img]
	icon.onclick=function()
	{
		tree.run(node.select,node);
		if(tree.run(node.onclick)) 
		{
			if(tree.run(tree.onclick,node))
			{
				tree.run(node.execute);
			}
		}
	}	
	
	icon.ondblclick=function(){if(tree.run(node.ondblclick))tree.run(tree.ondblclick,node)}
	icon.onmousemove=function(){if(tree.run(node.onmousemove))tree.run(tree.onmousemove,node)}
	icon.onmousedown=function(){if(tree.run(node.onmousedown))tree.run(tree.onmousedown,node)}
	icon.onmouseup=function(){if(tree.run(node.onmouseup))tree.run(tree.onmouseup,node)}
	icon.onfocus=function(){if(tree.run(node.onfocus)){if(tree.run(tree.onfocus,node))tree.doFocus(node);}}
	icon.onblur=function(){if(tree.run(node.onblur)){if(tree.run(tree.onblur,node))tree.doBlur(node);}}
	
	//whole body[span]
	nbody.onblur=function(){if(node.onfocus(node)){if(tree.onfocus(node))tree.doFocus(node);}}
	nbody.onfocus=function(){if(node.onblur(node)){if(tree.onblur(node))tree.doBlur(node);}}
	//add oncontextmenu
	nbody.oncontextmenu=function(){if(tree.run(node.oncontextmenu,node)){tree.run(tree.oncontextmenu,node);}return false;}
	
	icon.tabIndex=label.tabIndex=1;
	icon.hideFocus=true;
			
	//node object
	//node event return true
	//add oncontextmenu
	node.oncontextmenu=node.onclick=node.ondblclick=node.onmouseover=node.onmouseout=node.onmousemove=node.onmousedown=node.onmouseup=node.onkeypress=node.onkeydown=node.onkeyup=node.oncollapse=node.onexpand=node.onfocus=node.onblur=node.onselect=new Function("return true");
	node.click=function(){node.label.onclick();}
	node.focus=function(){node.label.onfocus();}
	node.blur=function(){node.icon.onblur();node.label.onblur();}
	//Joker:all add param node
	node.select=function(){
		if(node.onselect(node)){
			if(tree.onselect(node)) {tree.doSelect(node);}
		}
	}		
	node.isVisible=function()
	{
		var str;
		
		str=node.container.style.display;		
//		str=baseFunc.getSingleStyle(node.container,"display");
		return  str&&str!="none";	
	};//end md
	node.exIcon=null;		
		
	node.addExIcon=function()
	{
		if (!node.exIcon)
		{
			node.exIcon=new Image();
			node.exIcon.align="absmiddle";
			var o=node.icon.src==""?node.label:node.icon;
			baseFunc.insertAdjacentElement(o,"beforeBegin",node.exIcon);
		}//end if
	}//end md
	
	/**
		set the expand/collapse event of the node
	*/
	node.setExpEvent=function()
	{
		if (!node.exIcon) {return;}
		node.exIcon.onclick=function()
		{
			node.expand();
		}
	}
	
	//delete all the child of the node
	node.removeChildren=function()
	{
		var count=node.getChildrenCount();
		
		for(var i=0;node.children[i];){				
			tree.removeNode(node.children[i],true);														
		}//end for
	}//end md		
	//joker:node.expandStyle:alwalys|auto
	node.expandStyle=argExpandStyle!=null?argExpandStyle:"auto";
	/*
		node.setExpandStyle
			argStyle:["auto"|"always"]:node's expand styles
	*/		
	node.setExpandStyle=function(argStyle)
	{		
		//when add a new node will call this with argStyle is null
		if (null==argStyle)
		{
			argStyle=node.expandStyle;
		}//end if						
		if (argStyle=="always")
		{
			//joker:add expand icon when add this node
			node.addExIcon();
			if(node.exIcon)
			{
				//node.exIcon.onmousedown=function()
				node.exIcon.onclick=function()
				{
					node.expand();
				}//end md
			}//end if			
			if (!node.hasChild&&node.expanded)
			{
				node.expanded = false;					
			}//end if
		}else if (argStyle=="auto"&&node.expandStyle!="auto"){
			//remove expand image				
			if (!node.hasChild && node.exIcon != null && !tree.isLineStyle())
			{
				node.body.removeChild(node.exIcon);
				node.exIcon = null;
			}//end if
		}//end if
		node.expandStyle=argStyle;
		tree.setExIcon(node);
	}//end md	
	
	node.lineIcon=[];	
	
	//get the checked radio box of its children
	node.getCheckedRadio=function()
	{
		return tree.getCheckedRadio(this);
	}//end md
	
	/*
		node.getTree:get the tree of the node	
	*/
	node.getTree=function() {
		return tree;
	}//end md		
	
	/*
		get the keydex of the node
	*/
	node.getNodeKeydex=function()
	{
		return tree.getNodeKeydex(node);
	}//end md		
	
	/**
		node.expand:expand this node
		@param isShow [true|false]:is expand or collapse
		@param incSub [true|false]:is the sub node's child node need do the same thing
		@param isNotFireEvent [true|false]:is do not fire the event,for expandtotier i want not to fire event,
				default	is false that is fire the event  			  
	*/	
	node.expand=function(isShow,incSub,isNotFireEvent)
	{
		//Joker:
		//if(node.children.length==0)return;			
		if(node.children.length==0 && node.expandStyle != "always")return;			
					
		if(isShow==null) 
		{
			node.expanded=!node.expanded;
		}else{
			node.expanded=isShow;
		}//end if							
		var sh=node.expanded?"block":"none";
		var icount=node.children.length;
		for(var i=0;i<icount;i++)
		{	
			node.children[i].container.style.display=sh;
			//baseFunc.setSingleStyle(node.children[i].container,"display",sh);
			if(incSub&&(!(isShow^node.children[i].expanded))){				
				node.children[i].expand(node.expanded,true,isNotFireEvent);
			}//end if	
		}//end for
		tree.setExIcon(node);
		
		//Joker:add node Eventarg to node.onexpand
		if(node.expanded)
		{
			if(!isNotFireEvent && tree.run(node.onexpand,node))
			{
				tree.run(tree.onexpand,node);
			}//end if
		}else{ 
			if(!isNotFireEvent && node.oncollapse(node))
			{
				tree.oncollapse(node);
			}//end if
		}//end if
		
		//out,the code below has no need
		return;
	}//end md
		
	var _type = Tree.NORMAL;

	if (Tree.CHECKBOX == argType){			
		var chkBox = null;
			
		chkBox=_$("input");
		chkBox.setAttribute("type","checkbox");		
		chkBox.align="absmiddle";
		baseFunc.insertAdjacentElement(node.label,"beforeBegin",chkBox);
		node.checkBox = chkBox;
		chkBox.checked=node.checked=false;
		/*
			when node is checked
				e:the node fire this event
		*/	
		node.oncheck=new Function("return true;")
		//fire oncheck event
		chkBox.onclick=function(){		
			//Joker:set the node's isCheck property	
			node.checked = chkBox.checked;
			if (node.oncheck(node)){
				tree.oncheck(node);
			}
		};		

		node.isChecked = function(){
			return node.checked;
		};
	}else if (Tree.RADIOBOX == argType){
		node.rdobox = null;
		node.checked = false;
		
		var rdoBox=baseFunc.createRadioboxElement(null,false);
		baseFunc.insertAdjacentElement(node.label,"beforeBegin",rdoBox);		
		//if(typeof(checked)=="boolean")rdoBox.checked=checked;
		//event node.oncheck
		node.onrdocheck=null;
		//fire oncheck event
		rdoBox.onclick=function()
		{		
			node.setRadioCheck(true);
		}		
		node.rdoBox=rdoBox;
		node.isChecked=function(){
			return node.checked;
		};
	}else{
		argType = Tree.NORMAL;
	}
	_type = argType;

	this.getNodeType = function (){
		return _type;
	};
	
	/**
		set the check box checked or not,this method can't be called before this node is added to the tree
		@param _argChecked check or not check
		@param _argsetChild if set the children of the node checkd as their parent
		@param _argFireEvent if fire the oncheck event 
	*/
	node.setChecked=function(_argChecked,_argsetChild,_argFireEvent){			
		if (Tree.CHECKBOX != node.getNodeType()){
			throw new Error("this is not a checkbox node.");			
		}
		//Joker:care this check
		//is necessary or it will cause infinitude recursion		
		if (node.checkBox.checked != _argChecked)
		{
			node.checked=node.checkBox.checked=_argChecked;
			if (_argFireEvent){
				if (node.oncheck(node)){
					tree.oncheck(node);
				}
			}
		}
		if (_argsetChild)
		{
			for (var i=0;i<node.getChildrenCount();i++)
			{				
				node.children[i].setChecked(_argChecked,true);
			}
		}
	};
	
	/**
		set the radio checkbox checked,this method can't be called before this node is added to the tree
		@param _argFireEvent is fire the event 
	*/
	node.setRadioCheck = function(_argFireEvent){
		if (Tree.RADIOBOX != node.getNodeType()){
			throw new Error("this is not a radiobox node.");	
		}			

		var p;
		var nd;
		var	oNode;			
		
		p=node.parent;			
		
		if (p !=null && p!=tree.root)
		{
			oNode=p.getCheckedRadio();
			for (var i=0;i<p.getChildrenCount();i++)
			{	
				nd=p.children[i];			
				if (nd.rdoBox && node!=nd) 
				{					
					nd.checked=nd.rdoBox.checked=false;		
				}	
			}
			p.CheckedRdobox=node;
		}
		node.checked=node.rdoBox.checked=true;
		
		if (_argFireEvent){
			//fire
			if (node.parent && tree.onrdocheckchanged && node.parent != tree.root)
			{
				if (oNode != node)
				{ 
					/*
						event when the node's subordinate checked radiobox	changed
						e:the checked radio box's parent node
						e1:the orgin checked node and the current checked node
					*/				
					tree.onrdocheckchanged(node.parent,{"orgNode":oNode,"curNode":node});
				}	
			}			
				
			if (tree.onrdocheck){
				tree.onrdocheck(node);	
			}
		}			
	};
	
	this.setCaption = function(argCaption){		
		node.caption=argCaption;
		label.innerHTML=argCaption;
	};
	node.setCaption(text);
			 
	node.remove=function(){tree.removeNode(node);}
	node.getPath=function(separator){separator=separator==null?"/":separator;var path="",oNode=node;for(var i=tier;i>0;i--){path=separator+oNode.label.innerText+path;oNode=oNode.parent;}return path;}
	node.getSibling=function(){return node.parent.children};
	//Joker:add method getChildrenCount
	node.getChildrenCount=function(){return node.children?node.children.length:0};
	node.getTier=function(){return node.tier;}
	node.getIndex=function(){for(var i=0;i<count;i++)if(tree.nodes[i]==node)return i;return -1;}
	node.children=[];
	node.getKey=function(){return key==""||key==null?null:key;}
	node.key=key;
	node.execute=new Function();
	exeCategory=exeCategory==null?"":exeCategory.toLowerCase();
	switch(exeCategory)
	{	case "expand":
			node.execute=node.expand;break;
		default:
			//default is js
			if(typeof(exeArg)!="string")break;
			node.execute=function(){eval(exeArg);};
			break;
	}	
	tree.run(tree.afteradd,node,exeCategory);
	
	return node
}//end cs