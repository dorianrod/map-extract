export function reflect(promise, options = {}){
	let {
		resolveRejectValue,
		valueReject
	} = {
		resolveRejectValue: false,
		valueReject: null,
		...options
	};

	if(promise instanceof Array) {
		var ret = promise.forEach((p)=>{
			return reflect(p, options);
		});
		return ret;
	}

	if(!(promise && promise.then)) return Promise.resolve(promise);

	return promise ? promise.then(
						function(v){ return v},
						function(e){ return resolveRejectValue ? e : valueReject}) : Promise.resolve(promise);
}