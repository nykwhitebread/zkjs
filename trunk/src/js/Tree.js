/**
	@param imageList image cahce of the tree,a ImageList
	@param indent the node's left-indent to its parent
	@param toObject the parent dom element of the tree
	@param labelStyle the style of the node's text
	@required Imagelist.js Shell.js Common.js 
*/ 
function Tree(imageList,indent,toObject,labelStyle)
{
	this._name="Tree";
	var baseFunc=window.SHELL;
	var	com=window.JS_COMMON;
	var COLOR_SELECT_BG = "highlight";
		
	labelStyle=labelStyle!=null?labelStyle:"padding:0;margin-left:2;vertical-align:middle;text-align:left;"
	this.labelStyle=labelStyle;
	var count=0,depth=0,nodes=[],tree=this;	
	this.err="";
		
	imageList=imageList===null?new ImageList():imageList;
	var icons=imageList.item;
	this.imageList=imageList;
	this.icons=icons;
	if(icons["default"]!==null)	
	{
		if(icons["link"]===null) 
		{
			icons["link"]=icons["default"];
		}
	}
	
	//expandable
	//only has the image for expand and collapse,it will show expandable feature
	var showExpand=icons["expand"]!=null && icons["collapse"]!=null;
	if (!showExpand) {throw new Error("image of plus and minus not found!")};
	if(showExpand)
	{	
		if(icons["expand_top"]==null)
		{
			icons["expand_top"]=icons["expand"];
		}//end if	
		if(icons["expand_mid"]==null)
		{
			icons["expand_mid"]=icons["expand"];
		}//end if	
		if(icons["expand_end"]==null)
		{
			icons["expand_end"]=icons["expand"];
		}//end if	
		if(icons["collapse_top"]==null)
		{
			icons["collapse_top"]=icons["collapse"];
		}//end if	
		if(icons["collapse_mid"]==null)
		{
			icons["collapse_mid"]=icons["collapse"];
		}//end if	
		if(icons["collapse_end"]==null)
		{
			icons["collapse_end"]=icons["collapse"];
		}//end if	
	}//end if
	//var showBranch=icons["leaf"]!=null && icons["twig"]!=null;
	var showLine=icons["line"]!=null && icons["blank"]!=null && icons["leaf"]!=null && icons["twig"]!=null;
	//is show line
	var linestyle=false;
	
	//checkbox	
	var colChkNode=new Array();
	this.colChkNode=colChkNode;
	//radiobox
	var colrdoNode=new Array();
	this.colrdoNode=colrdoNode;
	
	/**
		set if it filled with "line" between the nodes 
		this method must call immediately after the tree is newed		
		@param true or false 
	*/
	this.setLineStyle=function(argIsShow)
	{		
		linestyle=argIsShow&&showLine;
	}
	this.isLineStyle=function(){return linestyle};
	//if not show line set the image to no line
	this.getImgIconKey=function(argKey)
	{
		var strReturn;
		
		strReturn=argKey; 
		if (!tree.isLineStyle())
		{
			switch(strReturn)
			{
				case "expand_top":
				case "expand_mid":
				case "expand_end":
					strReturn="expand";
					break;
				case "collapse_top":
				case "collapse_mid":
				case "collapse_end":
					strReturn="collapse";
					break;
			}//end switch			
		}//end md
		
		return strReturn;	
	}//end md

		
	//root
	//inner object: root
	var root={};
		root.children=[];
		root.expanded=true;
		root.getTier=function(){return 0;}
		
	var selectedNode=null,activeNode=null;
	Array.prototype.remove=function(index)
	{	
		if(index<0 || index>=this.length)return;
		for(var i=index;i<this.length;i++)this[i]=this[i+1];
		this.length--;
	}
	//remove the element in the array
	Array.prototype.removeObj=function(obj)
	{
		var			bl;
		
		bl=false;
		for(var i=0;i<this.length;i++)
		{
			if (obj===this[i] || bl) 
			{
				this[i]=this[i+1];
				bl=true;
			}//end if	
		}//end for
		if (bl) {this.length--;}		
	}//end md
	//return the object's index in the array,return -1 if not found
	Array.prototype.indexOf=function(elm){for(var i=0;i<this.length;i++)if(elm==this[i])return i;return -1;}

	var isExpandable=function(srcNode){
		return srcNode.expandStyle == "always" || srcNode.hasChild;	
	};//end md
			
	var isFirstTop=function(srcNode){
		return srcNode.parent == root && root.children[0] == srcNode;
	};//end md
	
	var isLeaf=function(srcNode){
		return srcNode.next != null;
	};//end md
	
	var isTwig=function(srcNode){
		return srcNode.next == null;
	};//end md
		
	//inner function :
	/**
		set the icon of the expandable node 
		@param srcNode 
	*/
	var setExIcon=function(srcNode)	
	{	
		var	strImgkey;
		var	expanded=srcNode.expanded;

		if(!isExpandable(srcNode))
		{	
			//not expandable
			if (!tree.isLineStyle()) 
			{
				if (srcNode.exIcon) 
				{				
					baseFunc.remove(srcNode.exIcon);					
					return;
				}
			}							
			if (isFirstTop(srcNode))
			{
				//is first top,this is special
				if (isTwig(srcNode)) 
				{
					//has no sister
					if (srcNode.exIcon) 
					{
						strImgkey=icons["blank"].src;					
					}					
				}else{					
					strImgkey=icons["leaf_top"].src;
				}	
			}else if(isLeaf(srcNode)){
				strImgkey=icons["leaf"].src;
			}else{
				strImgkey=icons["twig"].src;
			}
		}else{
			//need show expand			
			if (isFirstTop(srcNode))
			{
				if (isTwig(srcNode)) 
				{
					strImgkey=expanded?"collapse":"expand";
				}else{
					strImgkey=expanded?"collapse_top":"expand_top";				
				}	
			}else if(isLeaf(srcNode)){
				strImgkey=expanded?"collapse_mid":"expand_mid";
			}else{
				strImgkey=expanded?"collapse_end":"expand_end";
			}
			strImgkey=icons[tree.getImgIconKey(strImgkey)].src;			
		}
		if (tree.isLineStyle() && !srcNode.exIcon) 
		{
			srcNode.addExIcon();			
		}
		if (srcNode.exIcon) 
		{
			srcNode.icon.style.marginLeft="0";
			srcNode.exIcon.src=strImgkey;
		}else{
			if (!tree.isLineStyle())
			{
				srcNode.icon.style.marginLeft=icons["expand"].width;
			}
		}
		
		return;				
	}
	this.setExIcon=setExIcon;
	
	/*
		setLine :set the "|" line icon
	*/	
	var setLine=function(srcNode,idx)
	{		
		if (!tree.isLineStyle()) return;	
		if(srcNode.hasChild)
		{
			for(var i=0;i<srcNode.children.length;i++)
			{
				srcNode.children[i].lineIcon[idx].src=icons["line"].src;
				setLine(srcNode.children[i],idx);
			}
		}
	}
	this.setLine=setLine;
	
	/*
		doSelect:do when select ... set the select style
	*/
	var doSelect=function(srcNode)	
	{
		
		//bgcolor
		if(selectedNode!=null)
		{
			selectedNode.setStyle();
			baseFunc.setSingleStyle(selectedNode.label,"background","none");
			baseFunc.setSingleStyle(selectedNode.label,"color","black");
		}		
		srcNode.label.style.background=COLOR_SELECT_BG;
		srcNode.label.style.color="highlighttext";
		
//		baseFunc.setSingleStyle(srcNode.label,"background","highlight");
//		baseFunc.setSingleStyle(srcNode.label,"color","highlighttext");
		selectedNode=srcNode;
	}
	this.doSelect=doSelect;
	
	/*
		doFocus
	*/
	var doFocus=function(srcNode)
	{	
		activeNode=srcNode;
	}
	this.doFocus=doFocus;
	
	var doBlur=function(srcNode)
	{	
		activeNode=null;
	}
	this.doBlur=doBlur;
	
	/*
		run:run function
	*/
	var run=function(cmd,a0,a1,a2,a3)
	{
		if(typeof(cmd)=="string")
		{	try{return eval(cmd);}
			catch(E){alert("run script string error:\n"+cmd);}
		}
		else if(typeof(cmd)=="function")
		{
			//care this use
			return cmd(a0,a1,a2,a3);
		}//end if
	}//end md
	tree.run=run;
	
	/**
		add the children to the node,this node deemed to be has no children,this method is for the aim of improving performance when
		load a large number of nodes to their parent.
		and is very useful when using lazy-load style such as ajax.
		@param toNode the parent node
		@param argNodes the children nodes 
	*/	
	var addNodes=function(toNode,argNodes)
	{	
		if (0==argNodes.length) 
		{
			return;
		}
		var newtier=toNode.getTier()+1;
		var o=toNode==root?tree.body:toNode.container;
		var node,prenode;
		var ccount=toNode.getChildrenCount();
		var nodevalues;	
		var isexpanded=toNode.expanded;
		var islinestyle=tree.isLineStyle();
		var blanksrc=tree.icons["blank"].src;
		var	imgsrc;
		var arrneedsetline=[];
		indent=indent>=0?indent:16;
		//deem the parent's children has none
		for (var j=0;j<argNodes.length;j++)
		{	
			nodevalues=argNodes[j];	
//			var node=new TreeNode(tree,text,		key,			ico,	exeCategory,	exeArg,		argExpandStyle,argNodeData,  argStyle,    argType(int));			
			node=new TreeNode(tree,nodevalues[0],nodevalues[1],nodevalues[2],nodevalues[3],nodevalues[4],nodevalues[5],nodevalues[6],nodevalues[7],nodevalues[8]);						
			node.tier=newtier;
			toNode.children[toNode.children.length]=node;			
			baseFunc.insertAdjacentElement(o,"beforeEnd",node.container);
			node.parent=toNode;	
			node.keydex=ccount+j+1;						
			node.container.style.display=isexpanded?"block":"none";			
			
			//set the line
			if(islinestyle)
			{				
				for(var i=newtier-2;i>=0;i--)
				{
					var img=new Image();
					img.src=blanksrc;
					img.align="absmiddle";
					baseFunc.insertAdjacentElement(node.body,"afterBegin",img);
					node.lineIcon[i]=img;					
				}	
			}				
						
			//get in this step now the node has a exicon
			if (islinestyle)	
			{
				node.addExIcon();				
				if(!isExpandable(node) )
				{
					imgsrc=icons["leaf"].src;
				}else{
					imgsrc=node.expanded?icons["collapse_mid"].src:icons["expand_mid"].src;					
				}
			}else{
				if(isExpandable(node) )
				{			
					node.addExIcon();		
					imgsrc=node.expanded?icons["collapse"].src:icons["expand"].src;					
				}
			}						
			
			node.expandStyle=nodevalues[5];
			if(!islinestyle) 
			{
				node.body.style.textIndent=indent*(node.tier-1) + "px";	
			}				
			//set the left margin
			if(!isExpandable(node)&&!islinestyle)
			{
				node.icon.style.marginLeft=tree.icons["expand"].width;				
			}else{
				node.icon.style.marginLeft="0";					
			}						
			if (node.exIcon) 
			{
				node.exIcon.src=imgsrc;
				node.setExpEvent();	
			}						

			if (j==0)
			{
				//opt1:get the need add line tiers only at the first time
				var n=toNode;
				var i=node.tier-2;
				while(n!=root && i>=0)
				{
					if(n.next!=null) 
					{
						arrneedsetline[arrneedsetline.length]=i;											
					}	
					n=n.parent;
					i--;
				}
				
				if(toNode.hasChild)
				{
					node.prev=toNode.last;					
					toNode.last.next=node;
					tree.setExIcon(node.prev);					
				}else{
					toNode.first=node;
					node.prev=null;
				}
				if(node.prev!=null && islinestyle) {tree.setLine(node.prev,node.tier-1);}
			}else{
				node.prev=prenode;
				prenode.next=node;
			}
			
			//see opt1
			for (var i=0;i<arrneedsetline.length&&islinestyle;i++)
			{
				node.lineIcon[arrneedsetline[i]].src=tree.icons["line"].src;	
			}			
			if(node.getKey()!=null && node.getKey()!=""){tree.nodes[node.getKey()]=node;}	
			tree.nodes[count]=node;				
			count++;
			prenode=node;
			if (Tree.CHECKBOX==nodevalues[8]){
				colChkNode[colChkNode.length]=node;
			}else if (Tree.RADIOBOX==nodevalues[8]){
				colrdoNode[colrdoNode.length]=node;
			}else{
				
			}		
		}//end for		
		toNode.last=node;
		tree.setExIcon(toNode.last);
		
		//add expand image with the style judgement				
		var ma=toNode;
		ma.hasChild=true;
		if(ma!=root)
		{	
			if(ma.exIcon==null)
			{				
				//note:the real expand icon is set when add child
				ma.exIcon=new Image();
				ma.exIcon.align="absmiddle";
				var o=ma.icon.src==""?ma.label:ma.icon;
				baseFunc.insertAdjacentElement(o,"beforeBegin",ma.exIcon);
			}
			tree.setExIcon(ma);
			if(ma.exIcon)
			{
				ma.exIcon.onclick=function()
				{ma.expand();}
			}
		}
		
		if(depth<node.tier) depth=node.tier;					
	};
	this.addNodes=addNodes;
	
	
	/**
		add node to the tree
		@param toNode parent node
		@param node 
	*/
	var addNode=function(toNode,node)
	{				
		node.tier=toNode.getTier()+1;
		toNode.children[toNode.children.length]=node;
		var o=toNode==root?tree.body:toNode.container;
		baseFunc.insertAdjacentElement(o,"beforeEnd",node.container);
		node.parent=toNode;
		//set the brother:can optimize
		if(toNode.hasChild)
		{
			node.prev=toNode.last;
			toNode.last.next=node;
			toNode.last=node;
		}else{
			toNode.first=toNode.last=node;
		}
		//can opt
		node.keydex=toNode.getChildrenCount();
		
		node.parent.hasChild=true;
		if(depth<node.tier) depth=node.tier;
		node.container.style.display=node.parent.expanded?"block":"none";
		indent=indent>=0?indent:16;
		if(!tree.isLineStyle()) 
		{
			node.body.style.textIndent=indent*(node.tier-1) + "px";	
		}	
		//is the branch icon show
		if(tree.isLineStyle())
		{
			node.exIcon=new Image();
			node.exIcon.align="absmiddle";
			baseFunc.insertAdjacentElement(node.body,"afterBegin",node.exIcon);
		}
		//set the line
		if(tree.isLineStyle())
		{				
			for(var i=node.tier-2;i>=0;i--)
			{
				var img=new Image();
				img.src=tree.icons["blank"].src;
				img.align="absmiddle";
				baseFunc.insertAdjacentElement(node.body,"afterBegin",img);
				node.lineIcon[i]=img;
			}
			if(node.prev!=null) {tree.setLine(node.prev,node.tier-1);}
			var n=node.parent;
			var i=node.tier-2;
			while(n!=root && i>=0)
			{
				if(n.next!=null) 
				{
					node.lineIcon[i].src=tree.icons["line"].src;					
				}
				n=n.parent;
				i--;
			}
		}
		//Joker:add expand image with the style judgement		
		var ma=node.parent;
		if(ma!=root)
		{	
			if(ma.exIcon==null)
			{				
				//note:the real expand icon is set when add child
				ma.exIcon=new Image();
				ma.exIcon.align="absmiddle";
				var o=ma.icon.src==""?ma.label:ma.icon;
				baseFunc.insertAdjacentElement(o,"beforeBegin",ma.exIcon);
			}
			
			//Joker:
			tree.setExIcon(ma);
			if(ma.exIcon)
			{
				ma.exIcon.onclick=function()
				{ma.expand();}
			}
		}
		node.expanded=true;
		//set the left margin
		if(!isExpandable(node))
		{
			node.icon.style.marginLeft=tree.icons["expand"].width;
		}
		node.expanded=true;
		node.setExpandStyle();
		if (node.prev && tree.isLineStyle())
		{
			tree.setExIcon(node.prev);
		} 	
		if(node.getKey()!=null && node.getKey()!=""){tree.nodes[node.getKey()]=node;}	
		tree.nodes[count]=node;				
		count++;
		
		if (Tree.CHECKBOX==node.type){
				colChkNode[colChkNode.length]=node;
		}else if (Tree.RADIOBOX==node.type){
			colrdoNode[colrdoNode.length]=node;
		}else{
			
		}
		
		return node;
	}
	this.addNode=addNode;
		
	//remove
	var remove=function(srcNode)	
	{		
		baseFunc.remove(srcNode.container);		
		nodes.removeObj(srcNode);
	}	
	
	/**
		remove all the nodes of the tree
	*/
	this.removeAll=function(){
		var count;
		var nds;
		
		nds = tree.root.children;
		count = nds.length;
		for(var i=0;i<count;){
			if (nds[i]){
				tree.removeNode(nds[i],true);
			}else{
				i++;
			}
		}
	};
	
	/**
		@param srcNode
		@param argIsRecursion is this is the recurse invoke,need this to enhance performance	
	*/
	this.removeNode=function(srcNode,argIsRecursion)
	{
		if (!srcNode) {
			return;
		}//end if
		
		if(!srcNode.hasChild)
		{			
			remove(srcNode);			
			var ma=srcNode.parent,jj=srcNode.prev,mm=srcNode.next;
			if(!argIsRecursion) {				
				//set the state
				if(ma.first==srcNode && ma.last==srcNode && ma!=root)
				{	
					ma.hasChild=false;
					//when the only child been removed,if it's not expand style of "always" 						
					//it shuold remove the expand icon,but I don't known  why "alai" use this method to remove
					//I change to remove the icon 
					//document.createElement("div").insertAdjacentElement("afterBegin",ma.exIcon);
					if (ma.expandStyle != "always") 
					{
						baseFunc.remove(ma.exIcon);
					}else{
						ma.expanded=false;
					}	
					
					setExIcon(ma);
					ma.first=ma.last=null;
				}else{					
					if(jj!=null)
					{
						jj.next=mm;
						setExIcon(jj);
					}else{
						ma.first=mm;
					}//end if
					if(mm!=null)
					{
						mm.prev=jj;
						setExIcon(mm);
						//hold the keydex state
						var dd;
						dd=mm;
						while (dd)
						{
							dd.keydex--;
							dd=dd.next;
						}
					}else{
						ma.last=jj;
					}
				}
			}
			
			//forget to remove the obj from the children
			if (ma!=root) 
			{			
				ma.children.removeObj(srcNode);
				if (ma.children.length < 1)
				{
					ma.hasChild=false;
				}
			}		
			count--;
			srcNode=null;			
		}else{
			var count=srcNode.children.length;	
			for(var i=0;i<count;)
			{
				if (srcNode.children[i]){
					tree.removeNode(srcNode.children[i],true);
				}else{
					i++;
				}
			}
			tree.removeNode(srcNode,argIsRecursion);
		}
	}
	
	/**
		tree.locate locate the node by its keydex
		@param argKeydex the keydex of the node 
	*/
	var locate=function(argKeydex)
	{
		var			strsKeydexs;
		var			index;
		var			tNode;	
		
		//the "." represent the root
		if ("."==argKeydex){
			return tree.root;
		}
		tNode=tree.root;
		strsKeydexs=argKeydex.split(".");
		for (var i=0;i<strsKeydexs.length;i++ ) {
			if ("" != strsKeydexs[i]) {
				index=new Number(strsKeydexs[i]);
				tNode=tNode.children[index-1];
			}			
		}
		//if a wrong argKeydex ,return null
		if (tree.root==tNode){
			return null;
		}
		return tNode;
	}
	this.locate=locate;	
	
	
	/**	
		get the node's keydex path,note the keydex is start from 1
		@param argNode
	*/	
	this.getNodeKeydex=function(argNode)
	{
		var				strKeydex;
		var				pNode;
		
		strKeydex=argNode!=root?argNode.keydex:"";
		pNode=argNode.parent;		
		while (root!=pNode)
		{
			strKeydex=pNode.keydex+"."+strKeydex;
			pNode=pNode.parent;
		}
		strKeydex="."+strKeydex;
		
		return strKeydex;
	}	
	
	//getChildrenCount
	root.getChildrenCount=function()
	{
		return root.children!=null?root.children.length:0;
	}
	
	this.getNodesByTier=function(num)
	{
		var col=[];
		for(var i=0;i<count;i++)
		{
			if(nodes[i].getTier()==num) {col[col.length]=nodes[i];}
		}	
		return col;
	}
	
	/**
		the param is the same as the expand
	*/
	this.expandAll=function(isShow,argIncsub,argIsNotFireEvent)
	{
		isShow=isShow==null?!root.expanded:isShow;
		for(var i=0;i<count;i++)
		{
			nodes[i].expand(isShow,argIncsub,argIsNotFireEvent);
			root.expanded=isShow;
		}
	}
	
	/**
		@param num the number of the tier
		@param argIsneedCollapse is need collapse all first [for optimize] 
	*/	
	this.expandToTier=function(num)
	{
		//collapse all first
		
		
		for(var i=0;i<count;i++)
		{
			//collapse when is this tier
			if(nodes[i].getTier()==num&&nodes[i].expanded)
			{
				nodes[i].expand(false,false,true);
			}			
			
			if(nodes[i].getTier()<num&&!nodes[i].expanded)
			{
				nodes[i].expand(true,false,true);
			}
		}
	};
	this.body=document.createElement("div")
	//tree.embed
	this.embed=function(obj,where)
	{
		if(obj==null) {obj=document.body;}
		if(where==null) {where="afterBegin";}				
		if (typeof(obj)=="string") {obj=document.getElementById(obj);}		
		if (!obj) {throw new Error("the container of the tree is null");};
		baseFunc.insertAdjacentElement(obj,where,tree.body);
	};
	
	this.count=function(){return count;}
	this.getDepth=function(){return depth;}
	//add oncontextmenu
	this.oncontextmenu=this.onclick=this.ondblclick=this.onmousemove=this.onmouseover=this.onmouseout=this.onmouseup=this.onmousedown=this.onkeypress=this.onkeydown=this.onkeyup=this.oncollapse=this.onexpand=this.afteradd=this.onblur=this.onfocus=this.onselect=new Function("return true;");
	this.onrdocheckchanged=null;	

	this.getSelectedNode=function(){return selectedNode;};
	this.getActiveNode=function(){return activeNode;};
	this.target="_self";
	this.root=root;
	this.nodes=nodes;
	this.embed(toObject);	
	
	//checkbox
	//tree.event tree.oncheck
	this.oncheck=new Function("return true;");
	this.getCheckedNodes=function(){
		var boxes = new Array();
		var box;
		for(var i=0;i<colChkNode.length;i++){
			box = colChkNode[i];
			if (!box){
				continue;
			}
			if (box.isChecked()){
				boxes[boxes.length]=box;
			}
		}
		
		return boxes;
	};		

	this.onrdocheck=null;
	
	
	/**
		get the checked radio box of its children
		@param argNode
	*/	
	this.getCheckedRadio=function(argNode)
	{
		return !argNode.CheckedRdobox?null:argNode.CheckedRdobox;
	}

}

Tree.NORMAL = 0;
Tree.CHECKBOX = 1;
Tree.RADIOBOX = 2;
