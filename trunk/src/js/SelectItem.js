/**
	the item of a selectable control such as combobox
	@author Joker 
*/
function SelectItem(argText,argValue,argIcon){
	if (!argText && argText !=0 ){
		throw new Error("the argText must have value.");
	}
	var item = this;

	if (!argValue && argValue !=0){
		argValue = argText;
	}
	this.text = argText;
	this.value = argValue;
	this.icon = argIcon;
	this.rcCall = new Map();
	this.select;
	this.parent = null;
	this.indexOf = function(){
		if (!item.parent){}{return -1;}
		
		return item.parent.indexOfItem(item);
	};
	this.equal = function(argItem){
		var blIsEqual;
	
		blIsEqual = (argItem && (argItem.value == item.value));		
				
		return blIsEqual;
	};
}