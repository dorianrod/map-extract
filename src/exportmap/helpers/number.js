
import numeralLib from 'numeral';
import numeralen from "numeral/locales/en-gb";

var numlocale;
export function setNumberLocale(loc) {
	numlocale = loc;
	numeralLib.locale(loc);
}
setNumberLocale("en");

export function numeral(v) {
	return numeralLib(v);
}

export function parseValue(v) {
	var ret = numeral(v);
	return isNaN(ret.value()) ? NaN : ret.value();
}

export function reduceNumber(n) {
	if(n > 1000) return Math.round(n/1000) + "K";
	return n;
}