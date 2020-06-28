export function asyncWait(wait) {
	return new Promise(function(resolve){
		setTimeout(resolve, wait);
	})
}