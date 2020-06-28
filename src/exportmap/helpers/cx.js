import {isArray, uniq} from 'lodash';
 
function uniqClass(cls) {
 return uniq(cls.split(' ')).join(' ').trim();
}	
 
function _ClassSet(classNames) {
	var names = '';

	if (typeof classNames == 'object' && !isArray(classNames)) {
		for (var name in classNames) {
			if (!classNames.hasOwnProperty(name) || !classNames[name]) {
				continue;
			}
			names += name + ' ';
		}
		return names.trim();
	  
	} else if(isArray(classNames)) {
		for(var i = 0; i < classNames.length; i++) {
			names += _ClassSet(classNames[i]) + ' ';
		}
		return names.trim();
	} else {
	  	if(classNames) {
			return (classNames + "").trim() + ' ';
		}
	}
	return "";
}

export function cx(...args) {
	let names = _ClassSet(args);
	return uniqClass(names);
}
